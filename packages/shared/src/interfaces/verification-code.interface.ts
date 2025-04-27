export interface VerificationCode {
  id: number;
  code: string;
  email: string;
  expiresAt: Date;
}
