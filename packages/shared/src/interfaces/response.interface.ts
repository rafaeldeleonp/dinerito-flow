import { ErrorCode } from '../constants/errorCodes';

interface BaseApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
}

export interface IErrorCode {
  key: ErrorCode;
  message: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data: T | null;
}

export interface ApiErrorResponse extends BaseApiResponse {
  message: string;
  error: string;
  errorCode: IErrorCode;
}

export interface ExceptionResponse {
  message?: string | string[];
  statusCode?: number;
  error?: string;
  errorCode?: ErrorCode;
}
