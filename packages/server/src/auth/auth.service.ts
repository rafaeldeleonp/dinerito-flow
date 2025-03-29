import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      console.log('User not found');
      return null;
    }

    if (!user.password) {
      console.log('User does not have a password set');
      return null;
    }

    console.log('User found:', user);

    // const isPasswordValid = await bcrypt.compare(pass, user.password);
    const isPasswordValid = pass === user.password; // For testing purposes, use plain text comparison

    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
