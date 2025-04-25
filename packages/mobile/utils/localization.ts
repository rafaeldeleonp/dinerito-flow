import * as Localization from 'expo-localization';

import { isDevice, isSimulator } from './environment';

import { DEFAULT_USER_LOCALE } from '@/constants/locale';

export function getUserLocale(): Localization.Locale {
  let userLocale = DEFAULT_USER_LOCALE;

  if (isSimulator() || isDevice()) {
    const locales = Localization.getLocales();

    if (locales && locales.length > 0) userLocale = locales[0];
  } else {
    const browserLocale = navigator.language;

    if (browserLocale) {
      userLocale = {
        ...userLocale,
        languageTag: browserLocale,
        languageCode: browserLocale.split('-')[0],
        regionCode: browserLocale.split('-')[1],
      };
    }
  }

  return userLocale;
}
