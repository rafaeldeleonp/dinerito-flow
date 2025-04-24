import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/authentication';

export default function ProtectedLayout() {
  const authState = useAuth();

  console.log('Auth state:', authState);

  if (!authState.isLoggedIn && !authState.isLoading) return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
