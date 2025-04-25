import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreView';
import { PRIMARY_COLOR } from '@/constants/Colors';
import { SIGNUP_STEPS } from '@/constants/signup';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import { useTheme } from '@/contexts/theme';

interface SignupScreenWrapperProps {
  children: React.ReactNode;
  buttonText: string;
  loadingText: string;
  isLoading?: boolean;
  onPress?: (values: SignupFormData) => void;
}

export default function SignupWrapper({
  children,
  buttonText,
  loadingText,
  isLoading,
  onPress,
}: SignupScreenWrapperProps) {
  const theme = useTheme();
  const { methods, currentStep, nextStep } = useSignupForm();
  const stepsLength = Object.keys(SIGNUP_STEPS).length;
  const isLastStep = currentStep === stepsLength - 1;

  const handlePress = (values: SignupFormData) => {
    if (onPress) onPress(values);
    else nextStep(values);
  };

  return (
    <ThemedSafeAreaView>
      {!isLastStep && (
        <View style={[styles.baseFormProgressBar, styles.formProgressBar, { backgroundColor: theme.background }]}>
          <View
            style={[
              styles.baseFormProgressBar,
              styles.formProgressBarFill,
              { width: `${((currentStep + 1) / stepsLength) * 100}%` },
            ]}
          />
        </View>
      )}
      {children}
      <Button
        style={{ marginTop: 20 }}
        text={isLoading ? loadingText : buttonText}
        isLoading={isLoading}
        onPress={methods.handleSubmit(handlePress)}
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseFormProgressBar: {
    borderColor: PRIMARY_COLOR,
  },
  formProgressBar: {
    width: '100%',
    height: 10,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 40,
  },
  formProgressBarFill: {
    height: 8,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 2,
  },
});
