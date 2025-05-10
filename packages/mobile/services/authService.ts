import { ApiErrorResponse, ApiResponse, ChangePasswordDto, LoginResponse, User } from '@dinerito-flow/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import fetchService from './fetchService';

import { USER_TOKEN } from '@/constants/login';
import { isWeb } from '@/utils/environment';

class AuthService {
  private readonly baseUrl = '/auth/';

  async getToken(): Promise<string | null> {
    let token = null;

    if (isWeb()) {
      token = await AsyncStorage.getItem(USER_TOKEN);
    } else {
      token = await SecureStore.getItemAsync(USER_TOKEN);
    }

    return token;
  }

  async saveToken(token: string) {
    if (isWeb()) {
      await AsyncStorage.setItem(USER_TOKEN, token);
    } else {
      await SecureStore.setItemAsync(USER_TOKEN, token);
    }
  }

  async removeToken() {
    if (isWeb()) {
      await AsyncStorage.removeItem(USER_TOKEN);
    } else {
      await SecureStore.deleteItemAsync(USER_TOKEN);
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse> | ApiErrorResponse> {
    const response = await fetchService.post<LoginResponse>(`${this.baseUrl}login/`, {
      email,
      password,
    });

    const { data } = response as ApiResponse<LoginResponse>;

    if (data) await this.saveToken(data?.access_token);

    return response;
  }

  async resetPassword(data: ChangePasswordDto): Promise<ApiResponse<User> | ApiErrorResponse> {
    return fetchService.post<User>(`${this.baseUrl}change-password/`, data);
  }
}

export default new AuthService();
