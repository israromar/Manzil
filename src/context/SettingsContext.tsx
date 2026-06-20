import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { STORAGE_KEYS, getStoredValue, setStoredValue } from '../services/storage';
import type { FontSizeMode, LineHeightMode, SettingsState, ThemeMode, TranslationMode } from '../types/settings';

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'light',
  fontSize: 'medium',
  lineHeight: 'comfortable',
  translationMode: 'arabic_english',
  autoScroll: true,
};

interface SettingsContextValue {
  ready: boolean;
  settings: SettingsState;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (fontSize: FontSizeMode) => void;
  setLineHeight: (lineHeight: LineHeightMode) => void;
  setTranslationMode: (translationMode: TranslationMode) => void;
  setAutoScroll: (autoScroll: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    getStoredValue(STORAGE_KEYS.settings, DEFAULT_SETTINGS).then((value) => {
      setSettings(value);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timeout = setTimeout(() => setStoredValue(STORAGE_KEYS.settings, settings), 300);
    return () => clearTimeout(timeout);
  }, [ready, settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ready,
      settings,
      setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
      setFontSize: (fontSize) => setSettings((prev) => ({ ...prev, fontSize })),
      setLineHeight: (lineHeight) => setSettings((prev) => ({ ...prev, lineHeight })),
      setTranslationMode: (translationMode) => setSettings((prev) => ({ ...prev, translationMode })),
      setAutoScroll: (autoScroll) => setSettings((prev) => ({ ...prev, autoScroll })),
    }),
    [ready, settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}
