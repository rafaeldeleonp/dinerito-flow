import { VerificationCode } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class VerificationCodeEntity implements VerificationCode {
  @Exclude()
  id: number;

  code: string;
  email: string;
  expiresAt: Date;

  constructor(partial: Partial<VerificationCodeEntity>) {
    Object.assign(this, partial);
  }
}
