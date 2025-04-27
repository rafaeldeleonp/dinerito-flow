import { ApiErrorResponse } from '@dinerito-flow/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import SignupWrapper from './wrapper';

import FormError from '@/components/FormError';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { EMAIL } from '@/constants/common';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import verificationCodeService from '@/services/verificationCodeService';

export default function SignupEnterEmail() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    methods: {
      control,
      formState: { errors },
    },
    translate,
    nextStep,
  } = useSignupForm();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (values: SignupFormData) => {
      setErrorMessage(null);

      const response = await verificationCodeService.sendVerificationCode(values[EMAIL]);

      if (response.success) nextStep(values);
      else if (!response.success && (response as ApiErrorResponse).errorCode) {
        setErrorMessage((response as ApiErrorResponse).errorCode.message);
      }
    },
  });

  return (
    <SignupWrapper
      buttonText={translate('signup.submitButton')}
      loadingText={translate('signup.enterEmail.loading')}
      isLoading={isPending}
      onPress={mutateAsync}
    >
      <ThemedText type={ThemedTextType.SUBTITLE}>{translate('signup.enterEmail.title')}</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('signup.enterEmail.emailLabel')}</ThemedText>

      <ThemedInput
        name={EMAIL}
        control={control}
        textContentType="emailAddress"
        keyboardType="email-address"
        errorText={errors[EMAIL]?.message}
      />

      <FormError message={errorMessage} />
    </SignupWrapper>
  );
}
