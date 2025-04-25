import { StyleSheet, View } from 'react-native';

import { ThemedText, ThemedTextType } from './ThemedText';

import { PRIMARY_COLOR } from '@/constants/Colors';
import { useLocale } from '@/contexts/locale';
import { useTheme } from '@/contexts/theme';

type AppNameProps = {
  containerStyle?: object;
};

export default function AppName({ containerStyle }: AppNameProps) {
  const { translate } = useLocale();
  const theme = useTheme();
  const textType = ThemedTextType.TITLE;

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText type={textType} style={styles.title} lightColor={PRIMARY_COLOR} darkColor={PRIMARY_COLOR}>
        {translate('appName')}{' '}
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
