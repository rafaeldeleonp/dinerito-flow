import { ApiErrorResponse, ErrorCode } from '@dinerito-flow/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import * as z from 'zod';

import Button from '@/components/Button';
import FormError from '@/components/FormError';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EMAIL, PASSWORD } from '@/constants/common';
import { MIN_PASSWORD_LENGTH } from '@/constants/signup';
import { useAuth } from '@/contexts/auth';
import { useLocale } from '@/contexts/locale';

export type LoginFormData = {
  [EMAIL]: string;
  [PASSWORD]: string;
};

export default function Login() {
  const { isLoading, logIn } = useAuth();
  const { translate, translateError } = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    [EMAIL]: z
      .string()
      .email(translateError(ErrorCode.INVALID_EMAIL))
      .nonempty(translateError(ErrorCode.REQUIRED_EMAIL)),
    [PASSWORD]: z
      .string()
      .min(MIN_PASSWORD_LENGTH, translateError(ErrorCode.PASSWORD_TOO_SHORT, { min: MIN_PASSWORD_LENGTH }))
      .nonempty(translateError(ErrorCode.REQUIRED_PASSWORD)),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      [EMAIL]: '',
      [PASSWORD]: '',
    },
  });

  const handlePress = async (values: LoginFormData) => {
    setError(null);

    const response = await logIn(values[EMAIL], values[PASSWORD]);

    if (response.success) router.replace('/(protected)/home');
    else if (!response.success && (response as ApiErrorResponse).errorCode)
      setError((response as ApiErrorResponse).errorCode?.message);
  };

  return (
    <ThemedView>
      <ThemedText type={ThemedTextType.TITLE} style={{ marginBottom: 32 }}>
        {translate('auth.login.title')}
      </ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('auth.login.emailLabel')}</ThemedText>
      <ThemedInput
        name={EMAIL}
        control={control}
        textContentType="emailAddress"
        keyboardType="email-address"
        errorText={errors[EMAIL]?.message}
      />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>{translate('auth.login.passwordLabel')}</ThemedText>
      <ThemedInput
        name={PASSWORD}
        control={control}
        textContentType="password"
        secureTextEntry
        errorText={errors[PASSWORD]?.message}
      />

      <FormError message={error} />

      <Button
        text={translate('auth.login.button')}
        style={{ marginTop: 20 }}
        isLoading={isLoading}
        disabled={isLoading}
        onPress={handleSubmit(handlePress)}
      />

      <Link style={[styles.link, { marginTop: 20 }]} href="/(auth)/reset-password">
        <ThemedText type={ThemedTextType.LINK}>{translate('auth.login.forgotPassword')}</ThemedText>
      </Link>

      <Link style={[styles.link, { marginTop: 8 }]} href="/(signup)">
        <ThemedText type={ThemedTextType.LINK}>{translate('auth.login.noAccount')}</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  link: {
    textAlign: 'center',
  },
});
