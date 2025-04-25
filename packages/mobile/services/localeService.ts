import { Locale } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';

import { DEFAULT_LOCALE } from '@/constants/common';
import { DEFAULT_USER_LOCALE } from '@/constants/locale';
import en from '@/localization/translations/en';
import es from '@/localization/translations/es';
import { getUserLocale } from '@/utils/localization';

const i18n = new I18n({
  en,
  es,
});

i18n.defaultLocale = DEFAULT_LOCALE;
i18n.enableFallback = true;

class LocaleService {
  locale: Locale = DEFAULT_USER_LOCALE;

  constructor() {
    this.locale = getUserLocale();
    i18n.locale = this.locale.languageCode || DEFAULT_LOCALE;
  }

  seti18nLocale(languageCode: string) {
    i18n.locale = languageCode;
  }

  getLocale() {
    return this.locale;
  }

  translate(scope: string, options?: TranslateOptions) {
    return i18n.t(scope, options);
  }

  numberToCurreny = (number: number) => {
    return i18n.numberToCurrency(number, {
      unit: this.locale.currencySymbol as string,
      separator: this.locale.decimalSeparator as string,
      delimiter: this.locale.digitGroupingSeparator as string,
    });
  };

  localizeDate = (date: string) => {
    return i18n.l('date.formats.short', date);
  };
}

export default new LocaleService();
