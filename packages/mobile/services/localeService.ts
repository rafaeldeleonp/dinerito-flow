import { DEFAULT_LANGUAGE, ErrorCode } from '@dinerito-flow/shared';
import { Locale } from 'expo-localization';
import { init, changeLanguage, t, TOptions } from 'i18next';

import { DEFAULT_USER_LOCALE } from '@/constants/locale';
import enErrors from '@/localization/errors/en';
import esErrors from '@/localization/errors/es';
import { getUserLocale } from '@/utils/localization';

const enJson = require('@/localization/translations/en.json');
const esJson = require('@/localization/translations/es.json');

init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  resources: {
    en: {
      translation: enJson,
      errors: enErrors,
    },
    es: {
      translation: esJson,
      errors: esErrors,
    },
  },
  interpolation: {
    escapeValue: false,
  },
  debug: __DEV__,
  keySeparator: '.',
  nsSeparator: ':',
  returnObjects: true,
  ns: ['translation', 'errors'],
  defaultNS: 'translation',
});

class LocaleService {
  locale: Locale = DEFAULT_USER_LOCALE;

  constructor() {
    this.locale = getUserLocale();
  }

  setLocale(languageCode: string) {
    this.locale = {
      ...this.locale,
      languageCode,
      languageTag: `${languageCode}-${this.locale.languageRegionCode}`,
    };

    changeLanguage(languageCode);
  }

  getLocale() {
    return this.locale;
  }

  translate(scope: string, options?: TOptions) {
    return t(scope, options);
  }

  translateError(errorCode: ErrorCode, options?: TOptions) {
    return t(`errors:${errorCode}`, {
      ...options,
      // Fallback to the error code itself if translation is missing
      defaultValue: errorCode,
    });
  }

  numberToCurrency = (number: number) => {
    return new Intl.NumberFormat(this.locale.languageTag, {
      style: 'currency',
      currency: this.locale.currencyCode || 'USD',
      currencyDisplay: 'symbol',
    }).format(number);
  };

  localizeDate = (date: string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(this.locale.languageTag, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
}

const localeService = new LocaleService();

export default localeService;
