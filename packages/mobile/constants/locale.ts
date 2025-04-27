import { DEFAULT_LANGUAGE } from '@dinerito-flow/shared';
import { Locale } from 'expo-localization';

export const DEFAULT_USER_LOCALE: Locale = {
  languageTag: `${DEFAULT_LANGUAGE}-US`,
  languageCode: DEFAULT_LANGUAGE,
  languageRegionCode: 'US',
  langageCurrencySymbol: '$',
  langageCurrencyCode: 'USD',
  textDirection: 'ltr',
  digitGroupingSeparator: ',',
  decimalSeparator: '.',
  measurementSystem: 'metric',
  currencyCode: 'USD',
  currencySymbol: '$',
  regionCode: 'US',
  temperatureUnit: 'celsius',
};
