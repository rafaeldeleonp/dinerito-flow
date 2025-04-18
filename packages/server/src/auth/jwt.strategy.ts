import { JwtPayloadDto } from '@dinerito-flow/shared/src/dto/auth/jwt-payload.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY') || 'fallback-secret',
    });
  }

  validate(payload: JwtPayloadDto): { id: number; email: string } {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
