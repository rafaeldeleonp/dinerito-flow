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
  } = useSignupForm();

  return (
    <SignupWrapper>
      <ThemedText type={ThemedTextType.SUBTITLE}>Personal information</ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>First name</ThemedText>
      <ThemedInput name={FIRST_NAME} control={control} textContentType="name" errorText={errors[FIRST_NAME]?.message} />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Last name</ThemedText>
      <ThemedInput name={LAST_NAME} control={control} textContentType="name" errorText={errors[LAST_NAME]?.message} />
    </SignupWrapper>
  );
}
