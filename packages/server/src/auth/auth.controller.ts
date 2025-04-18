import { LoginResponse } from '@dinerito-flow/shared';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { AuthGuard } from './auth.guard';
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
      throw new UnauthorizedException();
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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
