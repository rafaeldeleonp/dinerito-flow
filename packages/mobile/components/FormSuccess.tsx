import { StyleProp, View } from 'react-native';

import { ThemedText, ThemedTextType } from './ThemedText';

interface FormSuccessProps {
  style?: StyleProp<any>;
  message: string | null;
}

export function FormSuccess({ style, message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <View style={style}>
      <ThemedText type={ThemedTextType.SUCCESS}>{message}</ThemedText>
    </View>
  );
}
