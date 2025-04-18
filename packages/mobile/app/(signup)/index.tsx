import { VerificationCode } from '@dinerito-flow/shared';
import { useState } from 'react';

import SignupWrapper from './wrapper';

import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { EMAIL } from '@/constants/common';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import FetchService from '@/services/fetchService';
import { FetchingState } from '@/types/signup';

export default function SignupEnterEmail() {
  const {
    methods: {
      control,
      formState: { errors },
    },
    nextStep,
  } = useSignupForm();
  const [enterEmailState, setEnterEmailState] = useState<FetchingState>({ isFetching: false, error: null });

  const handlePress = async (values: SignupFormData) => {
    setEnterEmailState({ isFetching: true, error: null });

    const response = await FetchService.post<VerificationCode>('/verification-codes/send/', {
      email: values[EMAIL],
    });

    if (response.statusCode !== 201 && response.statusCode !== 409) {
      setEnterEmailState({ isFetching: false, error: 'Failed to send verification code. Please try again.' });
      return;
    } else if (response.statusCode === 409) {
      setEnterEmailState({ isFetching: false, error: 'Email already exists. Please try again.' });
      return;
    }

    if (response.success) nextStep(values);
  };

  return (
    <SignupWrapper loadingText="Sending..." isLoading={enterEmailState.isFetching} onPress={handlePress}>
      <ThemedText type={ThemedTextType.SUBTITLE}>Enter your email address</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Your email address</ThemedText>

      <ThemedInput
        name={EMAIL}
        control={control}
        textContentType="emailAddress"
        keyboardType="email-address"
        errorText={errors[EMAIL]?.message}
      />

      {enterEmailState.error && <ThemedText type={ThemedTextType.ERROR}>{enterEmailState.error}</ThemedText>}
    </SignupWrapper>
  );
}
