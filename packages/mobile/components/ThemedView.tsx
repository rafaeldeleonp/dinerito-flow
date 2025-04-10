import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/contexts/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  const backgroundColor = lightColor || darkColor || theme.background;

  return (
    <View style={[{ flex: 1, paddingVertical: 32, paddingHorizontal: 24, backgroundColor }, style]} {...otherProps} />
  );
}
