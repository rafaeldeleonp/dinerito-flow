import { ApiErrorResponse, ApiResponse, ErrorCode, IErrorCode } from '@dinerito-flow/shared';

import localeService from './localeService';

const BASE_API_URL = 'http://192.168.86.97:3000';

class FetchService {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_API_URL;
  }

  private apiUrl(endpoint: string): string {
    const relativeUrl = `${endpoint}`.replace('//', '/');

    return `${this.baseURL}${relativeUrl}`;
  }

  private getFetchOptions(token?: string, options?: RequestInit): RequestInit | undefined {
    if (!options && !token) return undefined;

    const newOptions: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    if (token) {
      newOptions.headers = {
        ...newOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return newOptions;
  }

  private async fetch<T>(
    url: string,
    token?: string,
    options?: RequestInit
  ): Promise<ApiResponse<T> | ApiErrorResponse> {
    try {
      const response = await fetch(this.apiUrl(url), this.getFetchOptions(token, options));
      const responseJson: ApiResponse<T> | ApiErrorResponse = await response.json();

      if (!responseJson.success) {
        const errorCodeKey = (responseJson as ApiErrorResponse).errorCode?.key || ErrorCode.UNKNOWN_ERROR;
        (responseJson as ApiErrorResponse).errorCode = {
          key: errorCodeKey,
          message: localeService.translateError(errorCodeKey || ErrorCode.UNKNOWN_ERROR),
        };
      }

      return responseJson;
    } catch {
      return {
        success: false,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        data: null,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        errorCode: {
          key: ErrorCode.INTERNAL_SERVER_ERROR,
          message: localeService.translateError(ErrorCode.INTERNAL_SERVER_ERROR),
        },
      };
    }
  }

  async get<T>(url: string, token?: string): Promise<ApiResponse<T> | ApiErrorResponse> {
    return this.fetch<T>(url, token);
  }

  async post<T>(url: string, data: any, token?: string): Promise<ApiResponse<T> | ApiErrorResponse> {
    return this.fetch<T>(url, token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new FetchService();
