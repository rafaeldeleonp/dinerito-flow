import AppName from '@/components/AppName';
import Button, { ButtonSize } from '@/components/Button';
import MoneyLogo from '@/components/MoneyLogo';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Home() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <AppName />
      <View style={styles.bottomContainer}>
        <MoneyLogo />
        <ThemedText type={ThemedTextType.TITLE} style={styles.title}>
          Track your expenses effortlessly
        </ThemedText>
        <Link href="/(auth)" asChild>
          <Button text="Get Started" size={ButtonSize.LARGE} />
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
  title: {
    textAlign: 'center',
    marginBottom: 25,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
