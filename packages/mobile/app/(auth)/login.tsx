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

const schema = z.object({
  [EMAIL]: z.string().email('Invalid email address.').nonempty('Email address is required.'),
  [PASSWORD]: z.string().nonempty('Password is required'),
});

export type LoginFormData = z.infer<typeof schema>;

export default function Login() {
  const { control } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      [EMAIL]: '',
      [PASSWORD]: '',
    },
  });

  return (
    <ThemedView>
      <ThemedText type={ThemedTextType.TITLE} style={{ marginBottom: 32 }}>
        Log in
      </ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Your email</ThemedText>
      <ThemedInput name={EMAIL} control={control} textContentType="emailAddress" keyboardType="email-address" />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Password</ThemedText>
      <ThemedInput name={PASSWORD} control={control} textContentType="password" secureTextEntry />

      <Button text="Log in" style={{ marginTop: 8 }} />

      <Link style={[styles.link, { marginTop: 20 }]} href="/(auth)/reset-password">
        <ThemedText type={ThemedTextType.LINK}>Forgot your password?</ThemedText>
      </Link>

      <Link style={[styles.link, { marginTop: 8 }]} href="/(signup)">
        <ThemedText type={ThemedTextType.LINK}>Don't have an account? Sign up</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  link: {
    textAlign: 'center',
  },
});
