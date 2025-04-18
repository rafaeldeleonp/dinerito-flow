import { Stack, usePathname } from 'expo-router';

import MoneyBackButton from '@/components/BackButton';
import { SIGNUP_STEPS } from '@/constants/signup';
import { SignupFormProvider } from '@/contexts/signup-form';
import { useTheme } from '@/contexts/theme';

import SignupBackButton from './BackButton';

export default function SignupLayout() {
  const theme = useTheme();
  const pathname = usePathname();
  const showBackButton = pathname !== SIGNUP_STEPS[0];

  return (
    <SignupFormProvider>
      <Stack
        screenOptions={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.tint,
          headerLeft: () => (showBackButton ? <SignupBackButton /> : <MoneyBackButton />),
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="verify-email" />
        <Stack.Screen name="personal-info" />
        <Stack.Screen name="password" />
        <Stack.Screen name="account-created" />
      </Stack>
    </SignupFormProvider>
  );
}
