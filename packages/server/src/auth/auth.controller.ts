import { ChangePasswordDto, ErrorCode, LoginResponse } from '@dinerito-flow/shared';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserEntity } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest): Promise<LoginResponse> {
    if (!req.user) {
      throw new UnauthorizedException({ errorCode: ErrorCode.UNAUTHORIZED_ACCESS });
    }

    const loginResponse = await this.authService.login(req.user as UserEntity);

    return {
      access_token: loginResponse.access_token,
      user: new UserEntity({
        ...loginResponse.user,
        password: loginResponse.user.password || '',
      }),
    };
  }

  @Post('send-password-reset-email')
  async sendPasswordResetEmail(@Body('email') email: string): Promise<boolean> {
    if (!email) throw new BadRequestException({ errorCode: ErrorCode.INVALID_INPUT });

    return this.authService.sendPasswordResetEmail(email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<UserEntity> {
    const updatedUser = await this.authService.changePassword(changePasswordDto);

    return new UserEntity(updatedUser);
  }
}
