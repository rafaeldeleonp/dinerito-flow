import { ErrorCode } from '@dinerito-flow/shared';
import { Locale } from 'expo-localization';
import { TOptions } from 'i18next';

export type TranslateFn = (scope: string, options?: TOptions) => string;
export type TranslateErrorFn = (errorCode: ErrorCode, options?: TOptions) => string;

export type ErrorMessages = {
  [key in ErrorCode]: string;
};

export type LocaleContextType = {
  languageCode: string;
  locale: Locale;
  translate: TranslateFn;
  translateError: TranslateErrorFn;
  numberToCurrency: (number: number) => string;
  localizeDate: (date: string) => string;
};
