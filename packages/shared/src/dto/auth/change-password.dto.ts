import { IsEmail, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  currentPassword!: string;

  @IsString()
  newPassword!: string;
}
