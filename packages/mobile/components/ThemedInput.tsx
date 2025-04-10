import { useTheme } from '@/contexts/theme';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export default function ThemedInput({ style, placeholder, ...rest }: TextInputProps) {
  const theme = useTheme();

  return <TextInput {...rest} style={[styles.input, theme.input, style]} selectionColor={theme.input.borderColor} />;
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 48,
    fontSize: 16,
  },
});
