import {
  ApiErrorResponse,
  ApiResponse,
  CreateUserDto,
  User,
  VerificationCode,
  VerificationCodeResponse,
  VerifyCode,
} from '@dinerito-flow/shared';

import fetchService from './fetchService';
import localeService from './localeService';

import { isConflictStatusCode, isServerErrorStatusCode, isSuccessStatusCode } from '@/utils/responseStatus';

class signupService {
  private readonly verificationCodeBaseUrl = '/verification-codes/';
  private readonly userBaseUrl = '/users/';

  async sendVerificationCode(email: string): Promise<VerificationCodeResponse> {
    const response = await fetchService.post<VerificationCode>(`${this.verificationCodeBaseUrl}send/`, {
      email,
    });

    const verificationCodeResponse: VerificationCodeResponse = {
      success: false,
      error: '',
      hasConflict: false,
    };

    if (isSuccessStatusCode(response.statusCode) && response.success) {
      verificationCodeResponse.success = true;
    } else if (isConflictStatusCode(response.statusCode)) {
      verificationCodeResponse.hasConflict = true;
      verificationCodeResponse.error = localeService.translate('signup.emailConflictError');
    } else {
      verificationCodeResponse.error = localeService.translate('signup.sendVerificationCodeError');
    }

    return verificationCodeResponse;
  }

  async verifyCode(email: string, code: string): Promise<VerificationCodeResponse> {
    const response = await fetchService.post<VerifyCode>(`${this.verificationCodeBaseUrl}verify/`, {
      email: email,
      code: code,
    });

    const data = !isServerErrorStatusCode(response.statusCode)
      ? ((response as ApiResponse<VerifyCode>).data as VerifyCode)
      : null;
    const verificationCodeResponse: VerificationCodeResponse = {
      success: false,
      error: '',
    };

    if (data?.verified) verificationCodeResponse.success = true;
    else if (data?.expired) {
      verificationCodeResponse.error = localeService.translate('signup.verificationCodeExpiredError');
    } else verificationCodeResponse.error = localeService.translate('signup.invalidVerificationCodeError');

    return verificationCodeResponse;
  }

  async createAccount(data: CreateUserDto): Promise<User | ApiErrorResponse | null> {
    const response = await fetchService.post<User>(this.userBaseUrl, data);

    if (isSuccessStatusCode(response.statusCode) && response.success) {
      return (response as ApiResponse<User>).data as User;
    }

    return response as ApiErrorResponse;
  }
}

export default new signupService();
