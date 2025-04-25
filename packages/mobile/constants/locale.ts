import { Locale } from 'expo-localization';

import { DEFAULT_LOCALE } from './common';

export const DEFAULT_USER_LOCALE: Locale = {
  languageTag: `${DEFAULT_LOCALE}-US`,
  languageCode: DEFAULT_LOCALE,
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
