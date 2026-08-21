import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthCredentials, SignUpData } from '../types';
import { authService } from '../services/authService';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthContextType {
  user: User | null;
  authState: AuthState;
  loading: boolean;
  login: (credentialsOrUser: AuthCredentials | User | string, password?: string) => Promise<User | void>;
  signUp: (data: SignUpData) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
  isReviewer: boolean;
  isAuthor: boolean;
  getToken: () => Promise<string | null>;
  switchUser: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to auth state changes from native Express auth service
    const unsubscribe = authService.observeAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentialsOrUser: AuthCredentials | User | string, password?: string): Promise<User | void> => {
    setLoading(true);
    try {
      if (typeof credentialsOrUser === 'string') {
        const loggedInUser = await authService.login({ email: credentialsOrUser, password: password || '' });
        setUser(loggedInUser);
        return loggedInUser;
      } else if ('email' in credentialsOrUser && 'password' in credentialsOrUser) {
        const loggedInUser = await authService.login(credentialsOrUser as AuthCredentials);
        setUser(loggedInUser);
        return loggedInUser;
      } else if ('id' in credentialsOrUser && 'role' in credentialsOrUser) {
        setUser(credentialsOrUser as User);
        return credentialsOrUser as User;
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<User> => {
    setLoading(true);
    try {
      const newUser = await authService.signUp(data);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const getToken = async (): Promise<string | null> => {
    return sessionStorage.getItem('ajp_token') || null;
  };

  // Quick switch role utility for development testing
  const switchUser = (role: string) => {
    if (!user) return;
    const updated = { ...user, role: role as any };
    setUser(updated);
  };

  const userRole = (user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin';
  const isEditor = userRole === 'editor' || userRole === 'journal_editor' || userRole === 'managing_editor' || isAdmin;
  const isReviewer = userRole === 'reviewer';
  const isAuthor = userRole === 'author' || userRole === 'admin' || userRole === 'editor';

  const authState: AuthState = {
    isAuthenticated: !!user,
    user,
    loading
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authState,
        loading,
        login,
        signUp,
        logout,
        resetPassword,
        isAdmin,
        isEditor,
        isReviewer,
        isAuthor,
        getToken,
        switchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
