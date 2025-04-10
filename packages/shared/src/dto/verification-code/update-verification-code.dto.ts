import { IsEmail, IsOptional } from 'class-validator';

export class UpdateVerificationCodeDto {
  id!: number;

  @IsEmail()
  email!: string;

  @IsOptional()
  skipFindOne?: boolean;
}
