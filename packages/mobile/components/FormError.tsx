import { StyleProp, View } from 'react-native';

import { ThemedText, ThemedTextType } from './ThemedText';

interface FormErrorProps {
  style?: StyleProp<any>;
  message: string | null;
}

export default function FormError({ style, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <View style={style}>
      <ThemedText type={ThemedTextType.ERROR}>{message}</ThemedText>
    </View>
  );
}
