import { ApiErrorResponse, ApiResponse } from '@dinerito-flow/shared';

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

  private async fetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T> | ApiErrorResponse> {
    try {
      const response = await fetch(this.apiUrl(url), options);
      const responseJson = await response.json();

      return response.ok ? (responseJson as Promise<ApiResponse<T>>) : (responseJson as Promise<ApiErrorResponse>);
    } catch {
      return {
        success: false,
        statusCode: 500,
        timestamp: new Date().toISOString(),
        data: null,
        message: 'Network error',
        error: 'Network error',
      };
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T> | ApiErrorResponse> {
    return this.fetch<T>(url);
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T> | ApiErrorResponse> {
    return this.fetch<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
}

export default new FetchService();
