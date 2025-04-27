import { ErrorCode } from '@dinerito-flow/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Button from '@/components/Button';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIRM_PASSWORD, EMAIL, PASSWORD } from '@/constants/common';
import { MIN_PASSWORD_LENGTH } from '@/constants/signup';
import { useLocale } from '@/contexts/locale';

export type ResetPasswordFormData = {
  [EMAIL]: string;
  [PASSWORD]: string;
  [CONFIRM_PASSWORD]: string;
};

export default function ResetPassword() {
  const { translate, translateError } = useLocale();

  const schema = z
    .object({
      [EMAIL]: z
        .string()
        .email(translateError(ErrorCode.INVALID_EMAIL))
        .nonempty(translateError(ErrorCode.REQUIRED_EMAIL)),
      [PASSWORD]: z
        .string()
        .min(MIN_PASSWORD_LENGTH, translateError(ErrorCode.PASSWORD_TOO_SHORT))
        .nonempty(translateError(ErrorCode.REQUIRED_PASSWORD)),
      [CONFIRM_PASSWORD]: z
        .string()
        .min(MIN_PASSWORD_LENGTH, translateError(ErrorCode.PASSWORD_TOO_SHORT))
        .nonempty(translateError(ErrorCode.REQUIRED_CONFIRM_PASSWORD)),
    })
    .refine((data) => data[PASSWORD] === data[CONFIRM_PASSWORD], {
      message: translateError(ErrorCode.PASSWORDS_DONT_MATCH),
    });

  const { control } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
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
