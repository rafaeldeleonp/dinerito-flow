import Button from '@/components/Button';
import ThemedInput from '@/components/ThemedInput';
import { ThemedText, ThemedTextType } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Login() {
  return (
    <ThemedView>
      <ThemedText type={ThemedTextType.TITLE} style={{ marginBottom: 32 }}>
        Log in
      </ThemedText>

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Your email</ThemedText>
      <ThemedInput placeholder="Your email" textContentType="emailAddress" keyboardType="email-address" />

      <ThemedText type={ThemedTextType.DEFAULT_SEMI_BOLD}>Password</ThemedText>
      <ThemedInput placeholder="Password" textContentType="password" secureTextEntry />

      <Button text="Log in" style={{ marginTop: 8 }} />
    </ThemedView>
  );
}
