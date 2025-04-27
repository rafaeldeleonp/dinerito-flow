import { ApiErrorResponse, ApiResponse, CreateUserDto, User } from '@dinerito-flow/shared';

import fetchService from './fetchService';

class UserService {
  private readonly baseUrl = '/users/';

  async getUser(token: string): Promise<ApiResponse<User> | ApiErrorResponse | null> {
    if (!token) return null;

    return fetchService.get<User>(`${this.baseUrl}me/`, token);
  }

  async create(data: CreateUserDto): Promise<ApiResponse<User> | ApiErrorResponse> {
    return fetchService.post<User>(this.baseUrl, data);
  }
}

export default new UserService();
