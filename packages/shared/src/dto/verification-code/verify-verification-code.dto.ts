import { IsEmail, IsString } from 'class-validator';

export class VerifyVerificationCodeDto {
  @IsEmail()
  email!: string;

  @IsString()
  code!: string;
}
