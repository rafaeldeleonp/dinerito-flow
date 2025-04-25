import { useState } from 'react';

import SignupWrapper from './wrapper';

import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { EMAIL } from '@/constants/common';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import signupService from '@/services/signupService';
import { FetchingState } from '@/types/signup';

export default function SignupEnterEmail() {
  const {
    methods: {
      control,
      formState: { errors },
    },
    translate,
    nextStep,
  } = useSignupForm();
  const [enterEmailState, setEnterEmailState] = useState<FetchingState>({ isFetching: false, error: null });

  const handlePress = async (values: SignupFormData) => {
    setEnterEmailState({ isFetching: true, error: null });

    const response = await signupService.sendVerificationCode(values[EMAIL]);

    if (!response.success) {
      setEnterEmailState({ isFetching: false, error: response.error });
      return;
    }

    setEnterEmailState({ isFetching: false, error: null });

    nextStep(values);
  };

  return (
    <SignupWrapper
      buttonText={translate('signup.submitButton')}
      loadingText={translate('signup.enterEmail.loading')}
      isLoading={enterEmailState.isFetching}
      onPress={handlePress}
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

      {enterEmailState.error && <ThemedText type={ThemedTextType.ERROR}>{enterEmailState.error}</ThemedText>}
    </SignupWrapper>
  );
}
