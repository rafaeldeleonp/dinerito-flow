import { useCallback, useEffect, useRef, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/theme';

interface ThemedOTPInputProps<T extends FieldValues = FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: string;
  inputCount?: number;
  inputCellLength?: number;
  errorText?: string;
  onTextChange?: (text: string) => void;
}

function getOTPTextChucks(inputCount: number, inputCellLength: number, text: string): string[] {
  let matches = text.match(new RegExp('.{1,' + inputCellLength + '}', 'g')) || [];
  const result = Array(inputCount).fill('');

  matches.forEach((match, index) => {
    if (index < inputCount) {
      result[index] = match;
    }
  });

  return result;
}

export default function ThemedOTPInput<T extends FieldValues>({
  style,
  name,
  control,
  defaultValue = '',
  inputCount = 4,
  inputCellLength = 1,
  onTextChange,
  errorText,
  ...rest
}: ThemedOTPInputProps<T>) {
  const theme = useTheme();
  const [focusedInput, setFocusedInput] = useState<number>(0);
  const [otpText, setOtpInput] = useState<string[]>(getOTPTextChucks(inputCount, inputCellLength, defaultValue));
  const hasError = !!errorText;
  const inputs: TextInput[] = [];

  const otpTextRef = useRef<string[]>(otpText);
  const isProcessingAutoFillRef = useRef(false);
  const pendingKeysRef = useRef<string[]>([]);

  useEffect(() => {
    otpTextRef.current = otpText;
  }, [otpText]);

  const basicValidation = (text: string) => {
    return text.match(/^[0-9a-zA-Z]+$/);
  };

  const backspace = (value: string, index: number) => {
    if (!value.length && otpTextRef.current[index - 1]?.length === inputCellLength) {
      const newOtpText = [...otpTextRef.current];
      const prev = newOtpText[index - 1];

      newOtpText[index - 1] = prev
        .split('')
        .splice(0, prev.length - 1)
        .join('');

      setOtpInput(newOtpText);

      if (onTextChange) onTextChange(newOtpText.join(''));

      inputs[index - 1].focus();
    }
  };

  const handleInputFocus = (index: number) => {
    const prevIndex = index - 1;

    if (prevIndex > -1 && !otpTextRef.current[prevIndex] && !otpTextRef.current.join('')) {
      inputs[prevIndex].focus();
    }

    setFocusedInput(index);
  };

  const handleTextChange = (text: string, index: number, onChange: (...event: any[]) => void) => {
    if (text && !basicValidation(text)) return;

    const newOtpText = [...otpTextRef.current];
    newOtpText[index] = text;
    const val = newOtpText.join('');

    setOtpInput(newOtpText);
    otpTextRef.current = newOtpText;

    if (onTextChange) onTextChange(val);
    onChange(val);

    if (text.length === inputCellLength && index !== inputCount - 1) {
      inputs[index + 1].focus();
    }
  };

  const handleAutoFill = useCallback(
    (code: string, onChange: (...event: any[]) => void) => {
      isProcessingAutoFillRef.current = true;

      // Only keep valid characters
      const validChars = code
        .split('')
        .filter((char) => basicValidation(char))
        .slice(0, inputCount);

      // Create new OTP text array
      const newOtpText = Array(inputCount).fill('');
      validChars.forEach((char, idx) => {
        newOtpText[idx] = char;
      });

      // Update state
      setOtpInput(newOtpText);
      otpTextRef.current = newOtpText;

      // Call handlers
      const newValue = newOtpText.join('');
      if (onTextChange) onTextChange(newValue);
      onChange(newValue);

      // Reset the processing flag after a delay
      setTimeout(() => {
        isProcessingAutoFillRef.current = false;
        pendingKeysRef.current = [];
      }, 300);

      return newOtpText;
    },
    [inputCount, onTextChange]
  );

  const processKeyPress = useCallback(
    (key: string, index: number, onChange: (...event: any[]) => void) => {
      // If we're already processing an autofill, store keys for later
      if (isProcessingAutoFillRef.current) {
        pendingKeysRef.current.push(key);
        return;
      }

      // Special case: if multiple key presses are registered rapidly from first input,
      // it's likely an autofill
      if (index === 0 && pendingKeysRef.current.length > 0) {
        pendingKeysRef.current.push(key);

        // If we've collected enough keys, process them as autofill
        if (pendingKeysRef.current.length >= inputCount) {
          // Threshold to detect autofill
          const fullCode = pendingKeysRef.current.join('');
          handleAutoFill(fullCode, onChange);
          return;
        }
      } else if (index === 0) {
        // Start collecting keys for possible autofill
        pendingKeysRef.current = [key];

        // Set a timeout to process this as a normal key if no more keys arrive
        setTimeout(() => {
          if (pendingKeysRef.current.length === 1) {
            // Just a single key press, process normally
            const currentOtp = [...otpTextRef.current];
            currentOtp[index] = key;

            setOtpInput(currentOtp);
            otpTextRef.current = currentOtp;

            if (onTextChange) onTextChange(currentOtp.join(''));
            onChange(currentOtp.join(''));

            // Move focus to next input
            if (index !== inputCount - 1) {
              inputs[index + 1].focus();
            }

            // Clear pending keys
            pendingKeysRef.current = [];
          }
        }, 30); // Short delay to detect rapid keypresses
      } else {
        // Normal key press on non-first input
        const newOtpText = [...otpTextRef.current];
        newOtpText[index] = key;

        setOtpInput(newOtpText);
        otpTextRef.current = newOtpText;

        if (onTextChange) onTextChange(newOtpText.join(''));
        onChange(newOtpText.join(''));

        if (index !== inputCount - 1) {
          inputs[index + 1].focus();
        }
      }
    },
    [inputCount, handleAutoFill, onTextChange]
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number, onChange: (...event: any[]) => void) => {
      const val = otpTextRef.current[index] || '';
      const isBackspace = e.nativeEvent.key === 'Backspace';

      if (isBackspace && index !== 0) backspace(val, index);
      if (!isBackspace && e.nativeEvent.key) processKeyPress(e.nativeEvent.key, index, onChange);
      if (!isBackspace && val && index !== inputCount - 1) inputs[index + 1].focus();
    },
    [inputCount, otpTextRef, processKeyPress]
  );

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => {
          return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
              {Array.from({ length: inputCount }).map((_, i) => {
                return (
                  <TextInput
                    {...rest}
                    key={i}
                    ref={(e) => {
                      if (e) {
                        inputs[i] = e;
                      }
                    }}
                    style={[
                      styles.input,
                      theme.input,
                      style,
                      {
                        borderColor: focusedInput === i ? '#588166' : theme.input.borderColor,
                      },
                    ]}
                    value={otpText[i] || ''}
                    selectionColor={theme.input.borderColor}
                    cursorColor={theme.input.borderColor}
                    maxLength={inputCellLength}
                    autoCorrect={false}
                    multiline={false}
                    autoFocus={i === 0}
                    textContentType={i === 0 ? 'oneTimeCode' : 'none'}
                    onFocus={() => handleInputFocus(i)}
                    onChangeText={(text) => handleTextChange(text, i, onChange)}
                    onKeyPress={(e) => handleKeyPress(e, i, onChange)}
                  />
                );
              })}
            </View>
          );
        }}
      />

      {hasError && <Text style={[styles.error, { color: theme.error, marginBottom: 12 }]}>{errorText}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    paddingVertical: 24,
    marginVertical: 20,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    fontWeight: '500', // Fixed string format for TypeScript
  },
});
