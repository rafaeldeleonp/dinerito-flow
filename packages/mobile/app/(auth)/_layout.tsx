import MoneyBackButton from '@/components/BackButton';
import { useTheme } from '@/contexts/theme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
