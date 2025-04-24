import { User } from '@dinerito-flow/shared';
import { useRouter, SplashScreen } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';

import authService from '@/services/authService';

SplashScreen.preventAutoHideAsync();

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

type AuthProviderState = {
  user: User | null;
  isLoading: boolean;
};

const INITIAL_STATE: AuthProviderState = {
  user: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...INITIAL_STATE,
  isLoggedIn: false,
  logIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthProviderState>(INITIAL_STATE);

  console.log('Auth state:', authState);

  useEffect(() => {
    loadStoredToken();
  }, []);

  useEffect(() => {
    if (!authState.isLoading) {
      SplashScreen.hideAsync();
    }
  }, [authState.isLoading]);

  function setLoadingState() {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
  }

  async function loadStoredToken() {
    try {
      const token = await authService.getToken();
      let userData: User | null = null;

      if (token) {
        userData = await authService.getUser(token);

        setAuthState({
          user: userData,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to load auth state', error);

      setAuthState(INITIAL_STATE);
    }
  }

  async function logIn(email: string, password: string) {
    setLoadingState();

    try {
      const { user } = await authService.login(email, password);

      setAuthState({ user, isLoading: false });

      router.replace('/(protected)/home');
    } catch (error) {
      console.error('Log in failed:', error);

      setAuthState(INITIAL_STATE);

      throw error;
    }
  }

  async function logOut() {
    setLoadingState();

    await authService.removeToken();

    setAuthState(INITIAL_STATE);

    router.replace('/');
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isLoading: authState.isLoading,
        isLoggedIn: !!authState.user,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
