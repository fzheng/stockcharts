import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { themes, type ThemeId, type AppTheme } from './index';

interface ThemeContextValue {
  theme: AppTheme;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('stockcharts-theme') as ThemeId | null;
    return saved && themes[saved] ? saved : 'tradingview';
  });

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('stockcharts-theme', id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: themes[themeId], themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
