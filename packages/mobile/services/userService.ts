import { ApiResponse, User } from '@dinerito-flow/shared';

import fetchService from './fetchService';

import { isErrorStatusCode, isServerErrorStatusCode } from '@/utils/responseStatus';

class UserService {
  async getUser(token: string): Promise<User | null> {
    const response = await fetchService.get<User | null>('/users/me/', token);

    if (isErrorStatusCode(response.statusCode) || isServerErrorStatusCode(response.statusCode)) return null;

    return (response as ApiResponse<User>).data as User;
  }
}

export default new UserService();
