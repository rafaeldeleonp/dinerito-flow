import { ApiResponse, LoginResponse } from '@dinerito-flow/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import fetchService from './fetchService';

import { USER_TOKEN } from '@/constants/login';
import { isWeb } from '@/utils/environment';
import { isErrorStatusCode, isServerErrorStatusCode } from '@/utils/responseStatus';

class AuthService {
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

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetchService.post<LoginResponse>('/auth/login/', {
      email,
      password,
    });

    if (isErrorStatusCode(response.statusCode) || isServerErrorStatusCode(response.statusCode))
      throw new Error('Login failed');

    const { data } = response as ApiResponse<LoginResponse>;

    if (!data) throw new Error('Invalid response');

    await this.saveToken(data?.access_token);

    return data;
  }
}

export default new AuthService();
