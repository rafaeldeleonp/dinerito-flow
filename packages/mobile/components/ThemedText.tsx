import { Text, type TextProps, StyleSheet } from 'react-native';

import { PRIMARY_COLOR } from '@/constants/Colors';
import { useTheme } from '@/contexts/theme';

export enum ThemedTextType {
  DEFAULT = 'default',
  DEFAULT_SEMI_BOLD = 'defaultSemiBold',
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  LINK = 'link',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | ThemedTextType.DEFAULT
    | ThemedTextType.DEFAULT_SEMI_BOLD
    | ThemedTextType.TITLE
    | ThemedTextType.SUBTITLE
    | ThemedTextType.LINK
    | ThemedTextType.SUCCESS
    | ThemedTextType.ERROR;
};

export function ThemedText({ style, lightColor, darkColor, type = ThemedTextType.DEFAULT, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = lightColor || darkColor || theme.text;

  return (
    <Text
      style={[
        { color: type === ThemedTextType.ERROR ? theme.error : color },
        type === ThemedTextType.DEFAULT ? styles.default : undefined,
        type === ThemedTextType.DEFAULT_SEMI_BOLD ? styles.defaultSemiBold : undefined,
        type === ThemedTextType.TITLE ? styles.title : undefined,
        type === ThemedTextType.SUBTITLE ? styles.subtitle : undefined,
        type === ThemedTextType.LINK ? styles.link : undefined,
        type === ThemedTextType.SUCCESS ? styles.success : undefined,
        type === ThemedTextType.ERROR ? styles.error : undefined,
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
    marginBottom: 28,
  },
  [ThemedTextType.LINK]: {
    lineHeight: 30,
    fontSize: 16,
    color: PRIMARY_COLOR,
  },
  [ThemedTextType.SUCCESS]: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 12,
    color: PRIMARY_COLOR,
  },
  [ThemedTextType.ERROR]: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 12,
  },
});
