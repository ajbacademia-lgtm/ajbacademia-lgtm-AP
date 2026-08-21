import { User, AuthCredentials, SignUpData } from '../types';

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Attempt session recovery from memory or /api/auth/me on load
    this.restoreSession();
  }

  private async restoreSession(): Promise<void> {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          this.currentUser = data.user;
          this.notifyListeners();
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
   * Register a new user account (Supports single object or discrete arguments)
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
          email: dataOrEmail,
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
          email: dataOrEmail.email,
          password: dataOrEmail.password || '',
          name: `${dataOrEmail.firstName || ''} ${dataOrEmail.lastName || ''}`.trim() || dataOrEmail.name || 'User',
          role: dataOrEmail.role || 'author',
          institution: dataOrEmail.affiliation || '',
          department: dataOrEmail.department || '',
          country: dataOrEmail.country || '',
          orcid: dataOrEmail.orcidId || '',
          bio: dataOrEmail.bio || ''
        };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.error || 'Failed to create user account.');
    }

    this.currentUser = resData.user;
    if (resData.token) {
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
      ? { email: credentialsOrEmail, password: password || '' }
      : credentialsOrEmail;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.error || 'Invalid email or password.');
    }

    this.currentUser = resData.user;
    if (resData.token) {
      sessionStorage.setItem('ajp_token', resData.token);
    }
    this.notifyListeners();
    return resData.user;
  }

  /**
   * Google sign in / OAuth placeholder integration
   */
  async loginWithGoogle(): Promise<User> {
    throw new Error('Google Sign-In is disabled. Please use your email and password to sign in directly.');
  }

  /**
   * Logout user session
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
    } catch {
      // Ignore network errors on logout
    }

    this.currentUser = null;
    sessionStorage.removeItem('ajp_token');
    this.notifyListeners();
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<void> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData.error || 'Failed to request password reset.');
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
