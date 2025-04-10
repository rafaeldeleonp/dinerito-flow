import { User } from './user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface JwtPayload {
  sub: number; // subject (user id)
  email: string;
  iat?: number; // issued at
  exp?: number; // expiration
}
