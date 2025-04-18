import { ApiErrorResponse, formatDateToDatetime } from '@dinerito-flow/shared';
import { ExceptionResponse } from '@dinerito-flow/shared/src/interfaces/response.interface';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse() as ExceptionResponse;

    const message = exceptionResponse.message || exception.message || 'Internal server error';

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode: status,
      message: this.getErrorMessage(status),
      error: Array.isArray(message) ? message.join(', ') : String(message),
      timestamp: formatDateToDatetime(new Date()),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'Authentication failed';
      case HttpStatus.FORBIDDEN:
        return 'Access denied';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found';
      case HttpStatus.BAD_REQUEST:
        return 'Invalid request';
      default:
        return 'Request failed';
    }
  }
}
