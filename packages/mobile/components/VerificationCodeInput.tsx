import React, { useRef, useState, useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { View, TextInput, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/contexts/theme';

interface VerificationCodeInputProps {
  length?: number;
  name: string;
  control: Control<any>;
  errorText?: string;
}

const VerificationCodeInput = ({ length = 6, name, control, errorText }: VerificationCodeInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  // Focus input when component mounts
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const codeArray = value?.split('') || [];
          const filledBoxes = codeArray.length;

          return (
            <View style={styles.row}>
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={value}
                onChangeText={(text) => {
                  const formatted = text.replace(/[^0-9]/g, '').slice(0, length);
                  onChange(formatted);
                }}
                keyboardType="numeric"
                maxLength={length}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              {Array.from({ length }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.codeBox,
                    { borderColor: theme.input.borderColor },
                    isFocused && index === filledBoxes && styles.focusedBox,
                  ]}
                  onTouchEnd={handlePress}
                >
                  <Text style={[styles.codeText, { color: theme.text }]}>{codeArray[index] || ''}</Text>
                </View>
              ))}
            </View>
          );
        }}
      />
      {errorText && <Text style={[styles.error, { color: theme.error, marginBottom: 12 }]}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  codeBox: {
    width: 45,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedBox: {
    borderWidth: 2,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  error: {
    fontSize: 12,
    fontWeight: 500,
  },
});

export default VerificationCodeInput;
