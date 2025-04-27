import { ApiErrorResponse } from '@dinerito-flow/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SignupWrapper from './wrapper';

import Button, { ButtonVariant } from '@/components/Button';
import FormError from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import ThemedOTPInput from '@/components/ThemedOTPInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { EMAIL } from '@/constants/common';
import { CODE } from '@/constants/signup';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import verificationCodeService from '@/services/verificationCodeService';

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
  const [resendCodeError, setResendCodeError] = useState<string | null>(null);
  const [verifyEmailError, setVerifyEmailError] = useState<string | null>(null);

  const email = watch(EMAIL);

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      setResendCodeError(null);
      setVerifyEmailError(null);

      const response = await verificationCodeService.sendVerificationCode(email);

      if (!response.success && (response as ApiErrorResponse).errorCode)
        setResendCodeError((response as ApiErrorResponse).errorCode.message);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (values: SignupFormData) => {
      setResendCodeError(null);
      setVerifyEmailError(null);

      const response = await verificationCodeService.verifyCode(email, values[CODE]);

      if (response.success) nextStep(values);
      else if (!response.success && (response as ApiErrorResponse).errorCode) {
        setVerifyEmailError((response as ApiErrorResponse).errorCode.message);
      }
    },
  });

  return (
    <SignupWrapper
      buttonText={translate('signup.submitButton')}
      loadingText={translate('signup.verifyEmail.loading')}
      isLoading={verifyEmailMutation.isPending}
      onPress={verifyEmailMutation.mutateAsync}
    >
      <ThemedText type={ThemedTextType.SUBTITLE}>{translate('signup.verifyEmail.title')}</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('signup.verifyEmail.codeLabel')}</ThemedText>

      <ThemedOTPInput
        name={CODE}
        control={control}
        inputCount={6}
        keyboardType="numeric"
        errorText={errors[CODE]?.message || verifyEmailError || undefined}
      />

      <FormError style={styles.resendErrorMessage} message={resendCodeError} />

      {resendCodeMutation.isSuccess && <FormSuccess message={translate('signup.verifyEmail.resendCodeSent')} />}

      <ThemedText type={ThemedTextType.DEFAULT} style={[styles.baseText, styles.codeText]}>
        {translate('signup.verifyEmail.noReceiveCode')}
      </ThemedText>
      <View style={styles.messageContainer}>
        <ThemedText style={[styles.baseText, styles.message]}>
          {translate('signup.verifyEmail.receiveCode')}{' '}
        </ThemedText>
        <ThemedText style={[styles.baseText, styles.message, { fontWeight: 700 }]}>{email}.</ThemedText>
      </View>

      <Button
        text={translate('signup.verifyEmail.resendCodeButton')}
        variant={ButtonVariant.SECONDARY}
        style={styles.button}
        isLoading={resendCodeMutation.isPending}
        onPress={() => {
          resendCodeMutation.mutateAsync();
        }}
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
