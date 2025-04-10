import { IsEmail, IsOptional } from 'class-validator';

export class CreateVerificationCodeDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  skipFindOne?: boolean;
}
