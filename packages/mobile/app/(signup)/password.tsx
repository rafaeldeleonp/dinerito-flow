import { useState } from 'react';

import SignupWrapper from './wrapper';

import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { CONFIRM_PASSWORD, EMAIL, PASSWORD } from '@/constants/common';
import { FIRST_NAME, LAST_NAME } from '@/constants/signup';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import fetchService from '@/services/fetchService';
import { FetchingState } from '@/types/signup';

export default function SignupPassword() {
  const {
    methods: {
      control,
      formState: { errors },
    },
    nextStep,
  } = useSignupForm();
  const [createAccountState, setCreateAccountState] = useState<FetchingState>({ isFetching: false, error: null });

  const handlePress = async (values: SignupFormData) => {
    setCreateAccountState({ isFetching: true, error: null });

    const response = await fetchService.post('/users/', {
      [EMAIL]: values[EMAIL],
      [PASSWORD]: values[PASSWORD],
      [FIRST_NAME]: values[FIRST_NAME],
      [LAST_NAME]: values[LAST_NAME],
    });

    if (response.statusCode !== 201 && response.statusCode !== 409) {
      setCreateAccountState({ isFetching: false, error: 'Failed to create account. Please try again.' });
      return;
    }

    if (response.statusCode === 409) {
      setCreateAccountState({ isFetching: false, error: 'Email already exists. Please try again.' });
      return;
    }

    if (response.success) nextStep(values);

    setCreateAccountState({ isFetching: false, error: null });
  };

  return (
    <SignupWrapper buttonText="Submit" onPress={handlePress}>
      <ThemedText type={ThemedTextType.SUBTITLE}>Password</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Password</ThemedText>
      <ThemedInput
        name={PASSWORD}
        control={control}
        textContentType="password"
        secureTextEntry
        errorText={errors[PASSWORD]?.message}
      />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Confirm password</ThemedText>
      <ThemedInput
        name={CONFIRM_PASSWORD}
        control={control}
        textContentType="password"
        secureTextEntry
        errorText={errors[CONFIRM_PASSWORD]?.message}
      />

      {createAccountState.error && <ThemedText type={ThemedTextType.ERROR}>{createAccountState.error}</ThemedText>}
    </SignupWrapper>
  );
}
