import { Stack } from 'expo-router';

import MoneyBackButton from '@/components/BackButton';
import { useTheme } from '@/contexts/theme';

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerLeft: () => <MoneyBackButton />,
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
