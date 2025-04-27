import { ApiErrorResponse, ApiResponse, LoginResponse, User } from '@dinerito-flow/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, SplashScreen } from 'expo-router';
import React, { createContext, useContext, useEffect } from 'react';

import authService from '@/services/authService';
import userService from '@/services/userService';

SplashScreen.preventAutoHideAsync();

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  logIn: (email: string, password: string) => Promise<ApiResponse<LoginResponse> | ApiErrorResponse>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  logIn: async (_email: string, _password: string): Promise<ApiResponse<LoginResponse> | ApiErrorResponse> => {
    return {} as ApiResponse<LoginResponse>;
  },
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data, isLoading } = useQuery<User | null>({
    queryKey: ['loggedUserData'],
    queryFn: async () => {
      console.log('Fetching user data');
      const token = await authService.getToken();

      if (!token) {
        console.log('No token found');
        return null;
      }

      const response = await userService.getUser(token);

      if (!response?.success) return null;

      return (response as ApiResponse<User>).data as User;
    },
    retry: false,
  });

  const {
    data: mutateData,
    isPending,
    mutateAsync,
  } = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return authService.login(credentials.email, credentials.password);
    },
  });

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  async function logIn(email: string, password: string) {
    return mutateAsync({ email, password });
  }

  async function logOut() {
    await authService.removeToken();

    router.replace('/');
  }

  return (
    <AuthContext.Provider
      value={{
        user: (data as User | null) || (mutateData as ApiResponse<LoginResponse>)?.data?.user || null,
        isLoading: isLoading || isPending,
        isLoggedIn: !!data || !!(mutateData as ApiResponse<LoginResponse>)?.data?.user,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
