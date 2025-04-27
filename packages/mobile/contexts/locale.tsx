import { DEFAULT_LANGUAGE, ErrorCode } from '@dinerito-flow/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOptions } from 'i18next';
import { createContext, useContext, useEffect, useState } from 'react';

import { LOCALE_STORAGE_KEY } from '@/constants/common';
import localeService from '@/services/localeService';
import { LocaleContextType } from '@/types/locale';

const locale = localeService.getLocale();
const languageCode = locale.languageCode || DEFAULT_LANGUAGE;

const LocaleContext = createContext<LocaleContextType>({
  languageCode: languageCode,
  locale: locale,
  translate: (scope, options?: TOptions) => scope,
  translateError: (errorCode: ErrorCode, options?: TOptions) => errorCode,
  numberToCurrency: (number) => number.toString(),
  localizeDate: (date) => date,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguageCode, setCurrentLanguageCodeState] = useState(languageCode);

  useEffect(() => {
    async function loadSavedLocale() {
      try {
        const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (savedLocale) {
          localeService.setLocale(savedLocale);
          setCurrentLanguageCodeState(savedLocale);
        }
      } catch (error) {
        console.error('Error loading saved locale:', error);
      }
    }

    loadSavedLocale();
  }, []);

  const translate = (scope: string, options?: TOptions) => {
    return localeService.translate(scope, options);
  };

  const translateError = (errorCode: ErrorCode, options?: TOptions) => {
    return localeService.translateError(errorCode, options);
  };

  const numberToCurrency = (number: number) => {
    return localeService.numberToCurrency(number);
  };

  const localizeDate = (date: string) => {
    return localeService.localizeDate(date);
  };

  return (
    <LocaleContext.Provider
      value={{ languageCode: currentLanguageCode, locale, translate, translateError, numberToCurrency, localizeDate }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
