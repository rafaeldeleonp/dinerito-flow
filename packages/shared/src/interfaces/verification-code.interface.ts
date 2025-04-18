export interface VerificationCode {
  id: number;
  code: string;
  email: string;
  expiresAt: Date;
}

export interface VerifyCode {
  verified: boolean;
  expired: boolean;
}
