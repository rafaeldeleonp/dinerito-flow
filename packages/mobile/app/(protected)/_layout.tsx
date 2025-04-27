import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/auth';

export default function ProtectedLayout() {
  const authState = useAuth();

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
