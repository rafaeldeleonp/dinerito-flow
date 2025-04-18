import { SafeAreaView, ScrollView, type ViewProps } from 'react-native';

import { useTheme } from '@/contexts/theme';

export type ThemedSafeAreaViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedSafeAreaViewProps) {
  const theme = useTheme();
  const backgroundColor = lightColor || darkColor || theme.background;

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }]} {...otherProps}>
      <ScrollView
        contentContainerStyle={[{ flex: 1, paddingVertical: 32, paddingHorizontal: 24 }, style]}
        showsVerticalScrollIndicator={false}
      >
        {otherProps.children}
      </ScrollView>
    </SafeAreaView>
  );
}
