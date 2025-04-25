import { Locale } from 'expo-localization';
import { TranslateOptions } from 'i18n-js';

export type TranslateFn = (scope: string, options?: TranslateOptions) => string;

export type LocaleContextType = {
  languageCode: string;
  locale: Locale;
  translate: TranslateFn;
  numberToCurreny: (number: number) => string;
  localizeDate: (date: string) => string;
};
