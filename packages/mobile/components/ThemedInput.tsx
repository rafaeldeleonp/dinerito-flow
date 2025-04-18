import React, { forwardRef } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { useTheme } from '@/contexts/theme';


import { ThemedText, ThemedTextType } from './ThemedText';

interface ThemedInputProps<T extends FieldValues = FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  errorText?: string;
}

const ThemedInput = forwardRef<TextInput, ThemedInputProps<any>>(
  <T extends FieldValues>(
    { style, name, control, errorText, ...rest }: ThemedInputProps<T>,
    ref: React.ForwardedRef<TextInput>
  ) => {
    const theme = useTheme();
    const hasError = !!errorText;

    return (
      <>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              {...rest}
              ref={ref}
              style={[styles.input, theme.input, style, { marginBottom: hasError ? 8 : 12 }]}
              selectionColor={theme.input.borderColor}
              cursorColor={theme.input.borderColor}
              value={value}
              onChangeText={(text) => {
                if (rest.onChangeText) rest.onChangeText(text);
                onChange(text);
              }}
            />
          )}
        />
        {errorText && <ThemedText type={ThemedTextType.ERROR}>{errorText}</ThemedText>}
      </>
    );
  }
);

// Add display name for debugging
ThemedInput.displayName = 'ThemedInput';

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 6,
    fontSize: 16,
  },
});

export default ThemedInput;
