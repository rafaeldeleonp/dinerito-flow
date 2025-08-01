import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import AppName from '@/components/AppName';
import Button, { ButtonSize } from '@/components/Button';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { useLocale } from '@/contexts/locale';

const AppIcon = require('@/assets/images/icon.png');

export default function Landing() {
  const { translate } = useLocale();

  return (
    <ThemedSafeAreaView style={styles.container}>
      <AppName />
      <Image alt="App icon" style={styles.image} source={AppIcon} contentFit="contain" />
      <View style={styles.bottomContainer}>
        <ThemedText type={ThemedTextType.TITLE} style={styles.title}>
          {translate('appSlogan')}
        </ThemedText>
        <Link href="/(auth)" asChild>
          <Button text={translate('landing.button')} size={ButtonSize.LARGE} />
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
  image: {
    flex: 1,
    width: '100%',
  },
});
