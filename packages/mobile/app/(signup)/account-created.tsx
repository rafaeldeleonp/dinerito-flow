import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import SignupWrapper from './wrapper';

import { ThemedText, ThemedTextType } from '@/components/ThemedText';

export default function SignupAccountCreated() {
  const router = useRouter();

  return (
    <SignupWrapper buttonText="Login" isLoading={false} onPress={() => router.replace('/login')}>
      <View style={styles.innerContainer}>
        <ThemedText type={ThemedTextType.TITLE} style={styles.title}>
          Your account created successfully!!
        </ThemedText>
      </View>
    </SignupWrapper>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
