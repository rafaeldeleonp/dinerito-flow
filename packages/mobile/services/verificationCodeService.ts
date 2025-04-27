import { ApiErrorResponse, ApiResponse, VerificationCode } from '@dinerito-flow/shared';

import fetchService from './fetchService';

class VerificationCodeService {
  private readonly baseUrl = '/verification-codes/';

  async sendVerificationCode(email: string): Promise<ApiResponse<VerificationCode> | ApiErrorResponse> {
    return fetchService.post<VerificationCode>(`${this.baseUrl}send/`, {
      email,
    });
  }

  async verifyCode(email: string, code: string): Promise<ApiResponse<VerificationCode> | ApiErrorResponse> {
    return fetchService.post<VerificationCode>(`${this.baseUrl}verify/`, {
      email: email,
      code: code,
    });
  }
}

export default new VerificationCodeService();
