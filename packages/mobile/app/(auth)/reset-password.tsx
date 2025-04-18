import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/Button';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIRM_PASSWORD, EMAIL, PASSWORD } from '@/constants/common';

const schema = z
  .object({
    [EMAIL]: z.string().email('Invalid email address.').nonempty('Email address is required.'),
    [PASSWORD]: z.string().nonempty('Password is required'),
    [CONFIRM_PASSWORD]: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data[PASSWORD] === data[CONFIRM_PASSWORD], {
    message: "Passwords don't match",
  });

export type ResetPasswordFormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const { control } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      [EMAIL]: '',
      [PASSWORD]: '',
      [CONFIRM_PASSWORD]: '',
    },
  });

  return (
    <ThemedView>
      <ThemedText type={ThemedTextType.TITLE} style={{ marginBottom: 32 }}>
        Reset your password
      </ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Your email</ThemedText>
      <ThemedInput name={EMAIL} control={control} textContentType="emailAddress" keyboardType="email-address" />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Password</ThemedText>
      <ThemedInput name={PASSWORD} control={control} textContentType="password" secureTextEntry />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Confirm password</ThemedText>
      <ThemedInput name={CONFIRM_PASSWORD} control={control} textContentType="password" secureTextEntry />

      <Button text="Submit" style={{ marginTop: 8 }} />
    </ThemedView>
  );
}
