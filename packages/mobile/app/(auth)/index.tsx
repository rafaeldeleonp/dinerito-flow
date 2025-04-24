import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import AppName from '@/components/AppName';
import Button, { ButtonSize, ButtonVariant } from '@/components/Button';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';

const MoneyFlowIcon = require('@/assets/images/money-flow.svg');

export default function Auth() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <AppName />
      <Image alt="Money Flow" style={styles.image} source={MoneyFlowIcon} contentFit="contain" />
      <View style={styles.bottomContainer}>
        <Link href="/(auth)/login" asChild>
          <Button text="Login" size={ButtonSize.LARGE} />
        </Link>

        <Link href="/(signup)" style={{ marginTop: 20 }} asChild>
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
  image: {
    flex: 1,
    width: '100%',
  },
});
