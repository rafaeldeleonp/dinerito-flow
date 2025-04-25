import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === 'storeClient';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isWeb(): boolean {
  return Platform.OS === 'web';
}

export function isSimulator(): boolean {
  return !isWeb() && Constants.isDevice === false;
}

export function isDevice(): boolean {
  return !isWeb() && Constants.isDevice === true;
}
