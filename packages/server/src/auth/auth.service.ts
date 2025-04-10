import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResponse, User } from '@dinerito-flow/shared';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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
}
