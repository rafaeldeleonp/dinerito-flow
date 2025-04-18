import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';

export default function NotFoundScreen() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <ThemedText type={ThemedTextType.TITLE} style={{ textAlign: 'center' }}>
          This screen doesn't exist.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type={ThemedTextType.LINK}>Go to home screen!</ThemedText>
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
