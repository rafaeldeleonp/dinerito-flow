import { useTheme } from '@/contexts/theme';
import { StyleSheet, View } from 'react-native';
import { ThemedText, ThemedTextType } from './ThemedText';

type AppNameProps = {
  containerStyle?: object;
};

export default function AppName({ containerStyle }: AppNameProps) {
  const theme = useTheme();
  const textType = ThemedTextType.TITLE;

  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText type={textType} style={styles.title} lightColor="#547c4c" darkColor="#547c4c">
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
