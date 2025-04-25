import SignupWrapper from './wrapper';

import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { FIRST_NAME, LAST_NAME } from '@/constants/signup';
import { useSignupForm } from '@/contexts/signup-form';

export default function SignupVerifyEmail() {
  const {
    methods: {
      control,
      formState: { errors },
    },
    translate,
  } = useSignupForm();

  return (
    <SignupWrapper buttonText={translate('signup.submitButton')} loadingText={translate('')}>
      <ThemedText type={ThemedTextType.SUBTITLE}>{translate('signup.personalInfo.title')}</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('signup.personalInfo.firstNameLabel')}</ThemedText>
      <ThemedInput name={FIRST_NAME} control={control} textContentType="name" errorText={errors[FIRST_NAME]?.message} />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('signup.personalInfo.lastNameLabel')}</ThemedText>
      <ThemedInput name={LAST_NAME} control={control} textContentType="name" errorText={errors[LAST_NAME]?.message} />
    </SignupWrapper>
  );
}
