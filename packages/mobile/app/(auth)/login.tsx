import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import * as z from 'zod';

import Button from '@/components/Button';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EMAIL, PASSWORD } from '@/constants/common';
import { useAuth } from '@/contexts/authentication';
import { useLocale } from '@/contexts/locale';

export type LoginFormData = {
  [EMAIL]: string;
  [PASSWORD]: string;
};

export default function Login() {
  const { logIn } = useAuth();
  const { translate } = useLocale();

  const schema = z.object({
    [EMAIL]: z.string().email(translate('validation.invalidEmail')).nonempty(translate('validation.requiredEmail')),
    [PASSWORD]: z.string().nonempty(translate('validation.requiredPassword')),
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
    console.log('Login values:', values);
    await logIn(values[EMAIL], values[PASSWORD]);
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

      <Button text={translate('auth.login.button')} style={{ marginTop: 20 }} onPress={handleSubmit(handlePress)} />

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
