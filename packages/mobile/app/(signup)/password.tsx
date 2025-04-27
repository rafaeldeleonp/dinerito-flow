import { ApiErrorResponse } from '@dinerito-flow/shared';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import SignupWrapper from './wrapper';

import FormError from '@/components/FormError';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { CONFIRM_PASSWORD, EMAIL, PASSWORD } from '@/constants/common';
import { FIRST_NAME, LAST_NAME } from '@/constants/signup';
import { SignupFormData, useSignupForm } from '@/contexts/signup-form';
import userService from '@/services/userService';

export default function SignupPassword() {
  const [createAccountError, setCreateAccountError] = useState<string | null>(null);

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
      setCreateAccountError(null);

      const response = await userService.create({
        [EMAIL]: values[EMAIL],
        [PASSWORD]: values[PASSWORD],
        [FIRST_NAME]: values[FIRST_NAME],
        [LAST_NAME]: values[LAST_NAME],
      });

      if (response.success) nextStep(values);
      else if (!response.success && (response as ApiErrorResponse).errorCode) {
        setCreateAccountError((response as ApiErrorResponse).errorCode.message);
      }
    },
  });

  return (
    <SignupWrapper
      buttonText={translate('signup.password.button')}
      loadingText={translate('signup.password.loading')}
      isLoading={isPending}
      onPress={mutateAsync}
    >
      <ThemedText type={ThemedTextType.SUBTITLE}>{translate('signup.password.title')}</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('signup.password.passwordLabel')}</ThemedText>
      <ThemedInput
        name={PASSWORD}
        control={control}
        textContentType="password"
        secureTextEntry
        errorText={errors[PASSWORD]?.message}
      />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>
        {translate('signup.password.confirmPasswordLabel')}
      </ThemedText>

      <ThemedInput
        name={CONFIRM_PASSWORD}
        control={control}
        textContentType="password"
        secureTextEntry
        errorText={errors[CONFIRM_PASSWORD]?.message}
      />

      <FormError message={createAccountError} />
    </SignupWrapper>
  );
}
