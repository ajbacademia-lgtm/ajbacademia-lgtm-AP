import { User, AuthCredentials, SignUpData } from '../types';
import { auth, googleAuthProvider, firestore } from '../src/lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Safely parses response text to avoid "Unexpected token '<' ... is not valid JSON" errors
 * when endpoints return HTML fallback or error pages.
 */
async function parseSafeResponse(response: Response, defaultErrorMsg: string): Promise<any> {
  const text = await response.text();
  let data: any = null;
  if (text && text.trim() && !text.trim().startsWith('<')) {
    try {
      data = JSON.parse(text);
    } catch {
      // Not valid JSON string
    }
  }

  if (!response.ok || !data?.success) {
    const errorMsg = data?.error || data?.message || (response.status === 401 ? 'Invalid email or password.' : defaultErrorMsg);
    throw new Error(errorMsg);
  }

  return data;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  private unsubscribeFirebase: (() => void) | null = null;

  constructor() {
    // Attempt session recovery on load
    this.restoreSession();
    this.initFirebaseListener();
  }

  private initFirebaseListener(): void {
    try {
      this.unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser && !this.currentUser) {
          try {
            // Attempt to fetch profile from Firestore or backend sync
            const userDocRef = doc(firestore, 'users', fbUser.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const data = userSnap.data() as any;
              this.currentUser = {
                id: data.id || fbUser.uid,
                email: data.email || fbUser.email || '',
                name: data.name || fbUser.displayName || 'User',
                role: data.role || 'author',
                institution: data.institution || '',
                department: data.department || '',
                country: data.country || '',
                orcid: data.orcid || '',
                bio: data.bio || '',
                isVerified: true,
                isActive: true
              };
              this.notifyListeners();
            }
          } catch {
            // Silent fallback to backend auth
          }
        }
      });
    } catch {
      // Firebase listener fallback
    }
  }

  private async restoreSession(): Promise<void> {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('ajp_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/auth/me', {
        headers,
        credentials: 'include'
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim() && !text.trim().startsWith('<')) {
          const data = JSON.parse(text);
          if (data.success && data.user) {
            this.currentUser = data.user;
            this.notifyListeners();
          }
        }
      }
    } catch {
      // Offline or unauthenticated
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentUser);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  /**
   * Observe authentication state changes
   */
  observeAuthState(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    // Immediately emit current state
    callback(this.currentUser);

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Register a new user account via MySQL backend and Firebase Auth
   */
  async signUp(
    dataOrEmail: SignUpData | string,
    password?: string,
    name?: string,
    role?: string,
    affiliation?: string
  ): Promise<User> {
    const payload = typeof dataOrEmail === 'string'
      ? {
          email: dataOrEmail.toLowerCase().trim(),
          password: password || '',
          name: name || dataOrEmail.split('@')[0],
          role: role || 'author',
          institution: affiliation || '',
          department: '',
          country: '',
          orcid: '',
          bio: ''
        }
      : {
          email: dataOrEmail.email.toLowerCase().trim(),
          password: dataOrEmail.password || '',
          name: `${dataOrEmail.firstName || ''} ${dataOrEmail.lastName || ''}`.trim() || dataOrEmail.name || 'User',
          role: dataOrEmail.role || 'author',
          institution: dataOrEmail.affiliation || '',
          department: dataOrEmail.department || '',
          country: dataOrEmail.country || '',
          orcid: dataOrEmail.orcidId || '',
          bio: dataOrEmail.bio || ''
        };

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ajp_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 1. Primary Registration in MySQL backend
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const resData = await parseSafeResponse(response, 'Failed to create user account.');

    // 2. Parallel Firebase Auth & Firestore registration (if email/password valid)
    try {
      if (payload.email && payload.password && payload.password.length >= 6) {
        const userCred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        if (userCred.user) {
          if (payload.name) {
            await updateProfile(userCred.user, { displayName: payload.name }).catch(() => {});
          }
          // Store user profile in Firestore
          await setDoc(doc(firestore, 'users', userCred.user.uid), {
            id: resData.user.id || userCred.user.uid,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            institution: payload.institution,
            department: payload.department,
            country: payload.country,
            orcid: payload.orcid,
            bio: payload.bio,
            isVerified: false,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }).catch(() => {});
        }
      }
    } catch {
      // Backend MySQL registration succeeded; continue smoothly
    }

    this.currentUser = resData.user;
    if (resData.token && typeof window !== 'undefined') {
      sessionStorage.setItem('ajp_token', resData.token);
    }
    this.notifyListeners();
    return resData.user;
  }

  /**
   * Backwards compatible register alias
   */
  async register(
    dataOrEmail: SignUpData | string,
    password?: string,
    name?: string,
    role?: string,
    affiliation?: string
  ): Promise<User> {
    return this.signUp(dataOrEmail, password, name, role, affiliation);
  }

  /**
   * Login with email and password or AuthCredentials
   */
  async login(credentialsOrEmail: AuthCredentials | string, password?: string): Promise<User> {
    const payload = typeof credentialsOrEmail === 'string'
      ? { email: credentialsOrEmail.toLowerCase().trim(), password: password || '' }
      : { email: credentialsOrEmail.email.toLowerCase().trim(), password: credentialsOrEmail.password };

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ajp_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 1. Primary Login against MySQL backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const resData = await parseSafeResponse(response, 'Invalid email or password.');

    // 2. Firebase Auth login sync in background
    try {
      if (payload.email && payload.password) {
        await signInWithEmailAndPassword(auth, payload.email, payload.password).catch(() => {});
      }
    } catch {
      // Ignore background sync errors
    }

    this.currentUser = resData.user;
    if (resData.token && typeof window !== 'undefined') {
      sessionStorage.setItem('ajp_token', resData.token);
    }
    this.notifyListeners();
    return resData.user;
  }

  /**
   * Firebase Google Sign-In with Firestore and MySQL backend synchronization
   */
  async loginWithGoogle(): Promise<User> {
    try {
      // 1. Trigger Firebase Auth Google popup
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = userCredential.user;

      if (!fbUser || !fbUser.email) {
        throw new Error('Google sign-in did not return a valid email address.');
      }

      // 2. Sync / Upsert in Firestore
      const userDocRef = doc(firestore, 'users', fbUser.uid);
      await setDoc(
        userDocRef,
        {
          id: fbUser.uid,
          email: fbUser.email.toLowerCase().trim(),
          name: fbUser.displayName || fbUser.email.split('@')[0],
          avatar: fbUser.photoURL || '',
          isVerified: true,
          isActive: true,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      ).catch((fsErr) => console.warn('Firestore write warning:', fsErr));

      // 3. Synchronize with local MySQL backend session and obtain JWT access token
      const syncResponse = await fetch('/api/auth/google-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email.split('@')[0],
          uid: fbUser.uid,
          photoURL: fbUser.photoURL || '',
          role: 'author'
        })
      });

      const resData = await parseSafeResponse(syncResponse, 'Failed to complete Google authentication.');

      this.currentUser = resData.user;
      if (resData.token && typeof window !== 'undefined') {
        sessionStorage.setItem('ajp_token', resData.token);
      }
      this.notifyListeners();
      return resData.user;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-In popup was closed before completing.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Google Sign-In request was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        throw new Error('Google Sign-In popup was blocked by the browser. Please allow popups.');
      }
      throw new Error(err.message || 'Failed to sign in with Google.');
    }
  }

  /**
   * Logout user session across MySQL backend and Firebase Auth
   */
  async logout(): Promise<void> {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('ajp_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include'
      });
    } catch {
      // Ignore network errors on backend logout
    }

    try {
      await signOut(auth);
    } catch {
      // Ignore Firebase signOut error
    }

    this.currentUser = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ajp_token');
    }
    this.notifyListeners();
  }

  /**
   * Request password reset via MySQL backend and Firebase Auth
   */
  async resetPassword(email: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Backend password reset dispatch
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
    await parseSafeResponse(response, 'Failed to request password reset.');

    // 2. Also attempt Firebase Auth password reset email
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch {
      // Silently fall back to backend email dispatch
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
