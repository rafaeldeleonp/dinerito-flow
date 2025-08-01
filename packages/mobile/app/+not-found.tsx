import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { useLocale } from '@/contexts/locale';

export default function NotFoundScreen() {
  const { translate } = useLocale();

  return (
    <ThemedSafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: translate('notFouund.title') }} />
      <View style={styles.container}>
        <ThemedText type={ThemedTextType.TITLE} style={{ textAlign: 'center' }}>
          {translate('notFouund.message')}
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type={ThemedTextType.LINK}>{translate('notFouund.button')}</ThemedText>
        </Link>
      </View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
