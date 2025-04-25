import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SignupWrapper from './wrapper';

import Button, { ButtonVariant } from '@/components/Button';
import ThemedOTPInput from '@/components/ThemedOTPInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { EMAIL } from '@/constants/common';
import { CODE, INITIAL_FETCHING_STATE } from '@/constants/signup';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import signupService from '@/services/signupService';
import { FetchingState } from '@/types/signup';

export default function SignupVerifyEmail() {
  const {
    methods: {
      control,
      formState: { errors },
      watch,
    },
    translate,
    nextStep,
  } = useSignupForm();
  const [resendCodeState, setResendCodeState] = useState<FetchingState>(INITIAL_FETCHING_STATE);
  const [verifyEmailState, setVerifyEmailState] = useState<FetchingState>(INITIAL_FETCHING_STATE);

  const email = watch(EMAIL);

  const resendCode = async () => {
    setResendCodeState({ isFetching: true, error: null });

    const response = await signupService.sendVerificationCode(email);

    setResendCodeState({ isFetching: false, error: response.error });
  };

  const handlePress = async (values: SignupFormData) => {
    setVerifyEmailState({ isFetching: true, error: null });

    const response = await signupService.verifyCode(email, values[CODE]);

    if (!response.success) {
      setVerifyEmailState({ isFetching: false, error: response.error });
      return;
    }

    setVerifyEmailState({ isFetching: false, error: null });

    nextStep(values);
  };

  return (
    <SignupWrapper
      buttonText={translate('signup.submitButton')}
      loadingText={translate('signup.verifyEmail.loading')}
      isLoading={verifyEmailState.isFetching}
      onPress={handlePress}
    >
      <ThemedText type={ThemedTextType.SUBTITLE}>{translate('signup.verifyEmail.title')}</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('signup.verifyEmail.codeLabel')}</ThemedText>

      <ThemedOTPInput
        name={CODE}
        control={control}
        inputCount={6}
        keyboardType="numeric"
        errorText={errors[CODE]?.message || verifyEmailState.error || undefined}
      />

      <ThemedText type={ThemedTextType.DEFAULT} style={[styles.baseText, styles.codeText]}>
        {translate('signup.verifyEmail.noReceiveCode')}
      </ThemedText>
      <View style={styles.messageContainer}>
        <ThemedText style={[styles.baseText, styles.message]}>
          {translate('signup.verifyEmail.receiveCode')}{' '}
        </ThemedText>
        <ThemedText style={[styles.baseText, styles.message, { fontWeight: 700 }]}>{email}.</ThemedText>
      </View>

      {resendCodeState.error && (
        <ThemedText type={ThemedTextType.ERROR} style={styles.resendErrorMessage}>
          {resendCodeState.error}
        </ThemedText>
      )}

      <Button
        text={translate('signup.verifyEmail.resendCodeButton')}
        variant={ButtonVariant.SECONDARY}
        style={styles.button}
        onPress={resendCode}
      />
    </SignupWrapper>
  );
}

const styles = StyleSheet.create({
  baseText: {
    textAlign: 'center',
  },
  codeText: {
    marginTop: 40,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 0,
  },
  resendErrorMessage: {
    marginVertical: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
  },
});
