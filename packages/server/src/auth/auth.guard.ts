import { ErrorCode, JwtPayloadDto } from '@dinerito-flow/shared';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException({ errorCode: ErrorCode.UNAUTHORIZED_ACCESS });

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({ errorCode: ErrorCode.UNAUTHORIZED_ACCESS });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
