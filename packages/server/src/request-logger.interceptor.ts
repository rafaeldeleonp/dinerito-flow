import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const method: string = request.method;
    const originalUrl: string = request.originalUrl;
    const ip: string = request.ip ?? '';
    const body = request.body as unknown;
    const userAgent = request.get('user-agent') || '';

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - Date.now();
        const { statusCode } = response;
        const requestBody = body ? JSON.stringify(body) : '';
        const logResponse = `${method} ${originalUrl} ${statusCode} - ${responseTime}ms / ${userAgent} -- ${ip} / ${requestBody}`;

        // Color log based on status code
        if (statusCode >= 500) {
          this.logger.error(logResponse);
        } else if (statusCode >= 400) {
          this.logger.warn(logResponse);
        } else {
          this.logger.log(logResponse);
        }
      })
    );
  }
}
