import { ApiErrorResponse, ErrorCode, ExceptionResponse, formatDateToDatetime } from '@dinerito-flow/shared';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const timestamp = formatDateToDatetime(new Date());

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ExceptionResponse;
      const message = exceptionResponse.message || exception.message || 'Internal Server Error';
      const errorCode: ErrorCode = exceptionResponse.errorCode
        ? exceptionResponse.errorCode
        : ErrorCode.INTERNAL_SERVER_ERROR;
      const errorResponse: ApiErrorResponse = {
        success: false,
        statusCode: status,
        error: Array.isArray(message) ? message.join(', ') : String(message),
        message: this.getErrorMessage(status),
        errorCode: {
          key: errorCode,
          message: '',
        },
        timestamp,
      };

      this.logger.error(`[${errorCode}] ${exception.message}`, exception.stack);

      return response.status(status).json(errorResponse);
    }

    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      succes: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
      errorCode: {
        key: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      },
      timestamp,
    });
  }

  private getErrorMessage(status: HttpStatus): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Service Unavailable';
      case HttpStatus.GATEWAY_TIMEOUT:
        return 'Gateway Timeout';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.PRECONDITION_FAILED:
        return 'Precondition Failed';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Too Many Requests';
      case HttpStatus.NOT_IMPLEMENTED:
        return 'Not Implemented';
      case HttpStatus.BAD_GATEWAY:
        return 'Bad Gateway';
      case HttpStatus.METHOD_NOT_ALLOWED:
        return 'Method Not Allowed';
      default:
        return 'Internal Server Error';
    }
  }
}
