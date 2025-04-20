import AppName from '@/components/AppName';
import Button, { ButtonSize } from '@/components/Button';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { useAuth } from '@/contexts/authentication';

export default function HomeScreen() {
  const { logOut } = useAuth();

  return (
    <ThemedSafeAreaView>
      <AppName />
      <ThemedText type={ThemedTextType.TITLE}>Welcome to Dinerito Flow</ThemedText>
      <ThemedText type={ThemedTextType.SUBTITLE}>This is the protected area of the app</ThemedText>

      <Button text="Log out" size={ButtonSize.LARGE} onPress={logOut} />
    </ThemedSafeAreaView>
  );
}
