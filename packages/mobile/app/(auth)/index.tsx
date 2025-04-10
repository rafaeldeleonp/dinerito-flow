import AppName from '@/components/AppName';
import Button, { ButtonSize, ButtonVariant } from '@/components/Button';
import RoundedLogo from '@/components/RoundedLogo';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Auth() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <AppName />
      <View style={styles.bottomContainer}>
        <RoundedLogo />
        <Link href="/(auth)/login" asChild>
          <Button text="Login" size={ButtonSize.LARGE} />
        </Link>

        <Link href="/(auth)/sign-up" style={{ marginTop: 20 }} asChild>
          <Button text="Register" variant={ButtonVariant.SECONDARY} size={ButtonSize.LARGE} />
        </Link>
      </View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
