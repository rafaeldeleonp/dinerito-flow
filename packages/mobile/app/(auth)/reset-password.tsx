import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/Button';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIRM_PASSWORD, EMAIL, PASSWORD } from '@/constants/common';
import { useLocale } from '@/contexts/locale';

export type ResetPasswordFormData = {
  [EMAIL]: string;
  [PASSWORD]: string;
  [CONFIRM_PASSWORD]: string;
};

export default function ResetPassword() {
  const { translate } = useLocale();

  const schema = z
    .object({
      [EMAIL]: z.string().email(translate('validation.invalidEmail')).nonempty(translate('validation.requiredEmail')),
      [PASSWORD]: z.string().nonempty(translate('validation.requiredPassword')),
      [CONFIRM_PASSWORD]: z.string().nonempty(translate('validation.requiredConfirmPassword')),
    })
    .refine((data) => data[PASSWORD] === data[CONFIRM_PASSWORD], {
      message: translate('validation.passwordsDontMatch'),
    });

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
        {translate('auth.resetPassword.title')}
      </ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('auth.login.emailLabel')}</ThemedText>
      <ThemedInput name={EMAIL} control={control} textContentType="emailAddress" keyboardType="email-address" />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('auth.login.passwordLabel')}</ThemedText>
      <ThemedInput name={PASSWORD} control={control} textContentType="password" secureTextEntry />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>
        {translate('auth.resetPassword.confirmPasswordLabel')}
      </ThemedText>
      <ThemedInput name={CONFIRM_PASSWORD} control={control} textContentType="password" secureTextEntry />

      <Button text={translate('auth.resetPassword.button')} style={{ marginTop: 8 }} />
    </ThemedView>
  );
}
