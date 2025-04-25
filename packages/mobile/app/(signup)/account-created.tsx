import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import SignupWrapper from './wrapper';

import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { useSignupForm } from '@/contexts/signup-form';

export default function SignupAccountCreated() {
  const router = useRouter();
  const { translate } = useSignupForm();

  return (
    <SignupWrapper
      buttonText={translate('signup.accountCreated.button')}
      loadingText=""
      isLoading={false}
      onPress={() => router.replace('/login')}
    >
      <View style={styles.innerContainer}>
        <ThemedText type={ThemedTextType.TITLE} style={styles.title}>
          {translate('signup.accountCreated.message')}
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
