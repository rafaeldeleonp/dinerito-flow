import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadDto } from '@dinerito-flow/shared/src/dto/auth/jwt-payload.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

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
