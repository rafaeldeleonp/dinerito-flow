import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranslateOptions } from 'i18n-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/constants/common';
import localeService from '@/services/localeService';
import { LocaleContextType } from '@/types/locale';

const locale = localeService.getLocale();
const languageCode = locale.languageCode || DEFAULT_LOCALE;

const LocaleContext = createContext<LocaleContextType>({
  languageCode: languageCode,
  locale: locale,
  translate: (scope) => scope,
  numberToCurreny: (number) => number.toString(),
  localizeDate: (date) => date,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguageCode, setCurrentLanguageCodeState] = useState(languageCode);

  useEffect(() => {
    async function loadSavedLocale() {
      try {
        const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (savedLocale) {
          localeService.seti18nLocale(savedLocale);
          setCurrentLanguageCodeState(savedLocale);
        }
      } catch (error) {
        console.error('Error loading saved locale:', error);
      }
    }

    loadSavedLocale();
  }, []);

  const translate = (scope: string, options?: TranslateOptions) => {
    return localeService.translate(scope, options);
  };

  const numberToCurreny = (number: number) => {
    return localeService.numberToCurreny(number);
  };

  const localizeDate = (date: string) => {
    return localeService.localizeDate(date);
  };

  return (
    <LocaleContext.Provider
      value={{ languageCode: currentLanguageCode, locale, translate, numberToCurreny, localizeDate }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
