import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import MoneyBackButton from '@/components/BackButton';
import { AuthProvider } from '@/contexts/authentication';
import { LocaleProvider } from '@/contexts/locale';
import { ThemeProvider } from '@/contexts/theme';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              headerLeft: () => <MoneyBackButton />,
            }}
          >
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="(protected)" options={{ animation: 'none' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
