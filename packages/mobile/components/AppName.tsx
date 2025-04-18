import { StyleSheet, View } from 'react-native';

import { PRIMARY_COLOR } from '@/constants/Colors';
import { useTheme } from '@/contexts/theme';

import { ThemedText, ThemedTextType } from './ThemedText';

type AppNameProps = {
  containerStyle?: object;
};

export default function AppName({ containerStyle }: AppNameProps) {
  const theme = useTheme();
  const textType = ThemedTextType.TITLE;

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText type={textType} style={styles.title} lightColor={PRIMARY_COLOR} darkColor={PRIMARY_COLOR}>
        Dinerito{' '}
      </ThemedText>
      <ThemedText type={textType} style={[styles.title, { color: theme.text }]}>
        Flow
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 50,
  },
});
