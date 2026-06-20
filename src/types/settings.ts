export type ThemeMode = 'light' | 'dark' | 'sepia';
export type FontSizeMode = 'small' | 'medium' | 'large' | 'xl';
export type LineHeightMode = 'compact' | 'comfortable' | 'spacious';
export type TranslationMode = 'arabic' | 'arabic_urdu' | 'arabic_english';
export type LayoutMode = 'stacked' | 'side_by_side' | 'translation_only' | 'mushaf_page';

export type ReadingFormatId =
  | 'mushaf_page'
  | 'mushaf_arabic'
  | 'list_english'
  | 'list_urdu'
  | 'list_arabic';

export interface SettingsState {
  theme: ThemeMode;
  fontSize: FontSizeMode;
  lineHeight: LineHeightMode;
  translationMode: TranslationMode;
  layoutMode: LayoutMode;
  readingFormatId: ReadingFormatId;
  autoScroll: boolean;
}

export interface ProgressState {
  lastVerseId: number | null;
  lastScrollOffset: number;
  audioPositionMs: number;
  lastVisitedAt: number | null;
}
