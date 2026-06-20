export type ThemeMode = 'light' | 'dark' | 'sepia';
export type FontSizeMode = 'small' | 'medium' | 'large' | 'xl';
export type LineHeightMode = 'compact' | 'comfortable' | 'spacious';
export type TranslationMode = 'arabic' | 'arabic_urdu' | 'arabic_english';

export interface SettingsState {
  theme: ThemeMode;
  fontSize: FontSizeMode;
  lineHeight: LineHeightMode;
  translationMode: TranslationMode;
  autoScroll: boolean;
}

export interface ProgressState {
  lastVerseId: number | null;
  lastScrollOffset: number;
  audioPositionMs: number;
  lastVisitedAt: number | null;
}
