import { ChangePasswordDto, ErrorCode, JwtPayload, LoginResponse, User } from '@dinerito-flow/shared';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EmailTemplates } from 'src/email/types';

import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      this.logger.warn('User not found');
      return null;
    }

    if (!user.password) {
      this.logger.warn('User does not have a password set');
      return null;
    }

    const isPasswordValid = await this.usersService.verifyPassword(pass, user.password);

    if (isPasswordValid) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const updatedUser = await this.usersService.update(user.id, {
      lastLogin: new Date(),
    });

    if (!updatedUser) throw new Error('Failed to update user last login');

    return {
      access_token: this.jwtService.sign(payload),
      user: updatedUser,
    };
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user = await this.usersService.findOne(email);

    if (!user) throw new NotFoundException({ errorCode: ErrorCode.EMAIL_NOT_FOUND });

    return this.emailService.send(email, EmailTemplates.RESET_PASSWORD, { email: email });
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    const user = await this.usersService.findOne(changePasswordDto.email);

    if (!user) throw new BadRequestException({ errorCode: ErrorCode.INVALID_CREDENTIALS });

    const isCurrentPasswordValid = await this.usersService.verifyPassword(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid)
      throw new BadRequestException({
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });

    const isNewPasswordSameAsCurrent = await this.usersService.verifyPassword(
      changePasswordDto.newPassword,
      user.password
    );

    if (isNewPasswordSameAsCurrent) {
      throw new BadRequestException({
        errorCode: ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT,
        message: 'New password must be different from current password',
      });
    }

    const hashedPassword = await this.usersService.hashPassword(changePasswordDto.newPassword);

    const updatedUser = await this.usersService.update(user.id, {
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      lastLogin: user.lastLogin || undefined,
    });

    if (!updatedUser) throw new BadRequestException({ errorCode: ErrorCode.OPERATION_FAILED });

    return {
      ...user,
      password: hashedPassword,
    } as User;
  }
}
