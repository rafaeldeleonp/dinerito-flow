import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/authentication';

export default function ProtectedLayout() {
  const authState = useAuth();

  console.log('ProtectedLayout', authState);

  if (!authState.isLoggedIn) return <Redirect href="/(auth)/login" />;

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
