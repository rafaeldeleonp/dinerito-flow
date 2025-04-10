import { JwtPayload } from '../../interfaces/auth.interface';

export class JwtPayloadDto implements JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;

  constructor(payload: JwtPayload) {
    this.sub = payload.sub;
    this.email = payload.email;
    this.iat = payload.iat;
    this.exp = payload.exp;
  }
}
