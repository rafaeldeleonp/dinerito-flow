import { useTheme } from '@/contexts/theme';
import { Text, type TextProps, StyleSheet } from 'react-native';

export enum ThemedTextType {
  DEFAULT = 'default',
  DEFAULT_SEMI_BOLD = 'defaultSemiBold',
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  LINK = 'link',
}

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | ThemedTextType.DEFAULT
    | ThemedTextType.DEFAULT_SEMI_BOLD
    | ThemedTextType.TITLE
    | ThemedTextType.SUBTITLE
    | ThemedTextType.LINK;
};

export function ThemedText({ style, lightColor, darkColor, type = ThemedTextType.DEFAULT, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = lightColor || darkColor || theme.text;

  return (
    <Text
      style={[
        { color },
        type === ThemedTextType.DEFAULT ? styles.default : undefined,
        type === ThemedTextType.DEFAULT_SEMI_BOLD ? styles.defaultSemiBold : undefined,
        type === ThemedTextType.TITLE ? styles.title : undefined,
        type === ThemedTextType.SUBTITLE ? styles.subtitle : undefined,
        type === ThemedTextType.LINK ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  [ThemedTextType.DEFAULT]: {
    fontSize: 16,
    lineHeight: 24,
  },
  [ThemedTextType.DEFAULT_SEMI_BOLD]: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  [ThemedTextType.TITLE]: {
    fontSize: 48,
    fontWeight: 900,
    lineHeight: 52,
  },
  [ThemedTextType.SUBTITLE]: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  [ThemedTextType.LINK]: {
    lineHeight: 30,
    fontSize: 16,
    color: '#547c4c',
  },
});
