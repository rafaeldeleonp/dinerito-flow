import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text } from 'react-native';

import MoneyBackButton from '@/components/BackButton';
import { AuthProvider, useAuth } from '@/contexts/authentication';
import { ThemeProvider } from '@/contexts/theme';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerLeft: () => <MoneyBackButton />,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="(protected)" />
        ) : (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

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
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
