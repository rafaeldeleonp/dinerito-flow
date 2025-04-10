import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

const ThemeContext = createContext(Colors.light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
