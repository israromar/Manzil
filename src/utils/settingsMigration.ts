import { resolveFormatSettings, normalizeFormatId } from '../constants/readingFormats';
import type { LayoutMode, ReadingFormatId, SettingsState, TranslationMode } from '../types/settings';

export function normalizeSettingsState(value: Partial<SettingsState> | null | undefined): SettingsState {
  const translationMode: TranslationMode = value?.translationMode ?? 'arabic_english';
  const layoutMode: LayoutMode = value?.layoutMode ?? 'mushaf_page';
  const readingFormatId: ReadingFormatId = normalizeFormatId(value?.readingFormatId, translationMode, layoutMode);
  const resolved = resolveFormatSettings(readingFormatId);

  return {
    theme: value?.theme ?? 'dark',
    fontSize: value?.fontSize ?? 'medium',
    lineHeight: value?.lineHeight ?? 'comfortable',
    translationMode: resolved.translationMode,
    layoutMode: resolved.layoutMode,
    readingFormatId,
    autoScroll: value?.autoScroll ?? true,
  };
}

export function applyReadingFormat(
  formatId: ReadingFormatId
): Pick<SettingsState, 'readingFormatId' | 'translationMode' | 'layoutMode'> {
  const resolved = resolveFormatSettings(formatId);
  return {
    readingFormatId: formatId,
    translationMode: resolved.translationMode,
    layoutMode: resolved.layoutMode,
  };
}
