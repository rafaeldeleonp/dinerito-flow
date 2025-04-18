import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { useSignupForm } from '@/contexts/signup-form';
import { useTheme } from '@/contexts/theme';

export default function SignupBackButton() {
  const theme = useTheme();
  const { previousStep } = useSignupForm();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={previousStep}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="chevron-back" size={32} color={theme.tint} />
        <Text style={{ color: theme.tint, fontSize: 16, marginLeft: 4 }}>Back</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
