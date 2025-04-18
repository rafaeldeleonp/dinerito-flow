import { ApiResponse, VerificationCode, VerifyCode } from '@dinerito-flow/shared';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SignupWrapper from './wrapper';

import Button, { ButtonVariant } from '@/components/Button';
import ThemedOTPInput from '@/components/ThemedOTPInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { EMAIL } from '@/constants/common';
import { CODE, INITIAL_FETCHING_STATE } from '@/constants/signup';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import fetchService from '@/services/fetchService';
import { FetchingState } from '@/types/signup';

export default function SignupVerifyEmail() {
  const {
    methods: {
      control,
      formState: { errors },
      watch,
    },
    nextStep,
  } = useSignupForm();
  const [resendCodeState, setResendCodeState] = useState<FetchingState>(INITIAL_FETCHING_STATE);
  const [verifyEmailState, setVerifyEmailState] = useState<FetchingState>(INITIAL_FETCHING_STATE);

  const email = watch(EMAIL);

  const resendCode = async () => {
    setResendCodeState({ isFetching: true, error: null });

    const response = await fetchService.post<VerificationCode>('/verification-codes/send/', {
      email: email,
    });

    const state: FetchingState = { ...INITIAL_FETCHING_STATE };

    if (!response.success) state.error = 'Failed to resend code. Please try again.';

    setResendCodeState(state);
  };

  const handlePress = async (values: SignupFormData) => {
    setVerifyEmailState({ isFetching: true, error: null });

    const response = await fetchService.post<VerifyCode>('/verification-codes/verify/', {
      email: email,
      code: values[CODE],
    });

    const data = response.statusCode !== 500 ? ((response as ApiResponse<VerifyCode>).data as VerifyCode) : null;
    const state: FetchingState = { ...INITIAL_FETCHING_STATE };

    if (data?.verified) nextStep(values);
    else if (data?.expired) state.error = 'Verification code expired. Please request a new one.';
    else state.error = 'Invalid verification code. Please try again.';

    setVerifyEmailState(state);
  };

  return (
    <SignupWrapper loadingText="Verifying..." isLoading={verifyEmailState.isFetching} onPress={handlePress}>
      <ThemedText type={ThemedTextType.SUBTITLE}>Verify your email address</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Enter code</ThemedText>

      <ThemedOTPInput
        name={CODE}
        control={control}
        inputCount={6}
        keyboardType="numeric"
        errorText={errors[CODE]?.message || verifyEmailState.error || undefined}
      />

      <ThemedText type={ThemedTextType.DEFAULT} style={[styles.baseText, styles.codeText]}>
        Didn't receive the code?
      </ThemedText>
      <View style={styles.messageContainer}>
        <ThemedText style={[styles.baseText, styles.message]}>We have sent a six digit code to </ThemedText>
        <ThemedText style={[styles.baseText, styles.message, { fontWeight: 700 }]}>{email}.</ThemedText>
      </View>

      {resendCodeState.error && (
        <ThemedText type={ThemedTextType.ERROR} style={styles.resendErrorMessage}>
          {resendCodeState.error}
        </ThemedText>
      )}

      <Button text="Resend code" variant={ButtonVariant.SECONDARY} style={styles.button} onPress={resendCode} />
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
    flexDirection: 'row',
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
