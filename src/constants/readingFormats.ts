import { BISMILLAH_ENGLISH } from './mushaf';
import type { LayoutMode, ReadingFormatId, TranslationMode } from '../types/settings';

export interface ReadingFormatDefinition {
  id: ReadingFormatId;
  title: string;
  titleArabic?: string;
  description: string;
  badge?: string;
  previewArabic?: string;
  previewTranslation?: string;
  previewStyle?: 'mushaf' | 'list';
  translationMode: TranslationMode;
  layoutMode: LayoutMode;
}

/** Manzil-relevant reading formats only */
export const READING_FORMATS: ReadingFormatDefinition[] = [
  {
    id: 'mushaf_page',
    title: 'Mushaf page',
    titleArabic: 'صفحة مصحف',
    description: 'Flowing Arabic with ayah markers, Bismillah header, and page numbers — like a printed mushaf.',
    badge: 'Recommended',
    previewStyle: 'mushaf',
    previewArabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ١',
    previewTranslation: BISMILLAH_ENGLISH,
    translationMode: 'arabic_english',
    layoutMode: 'mushaf_page',
  },
  {
    id: 'mushaf_arabic',
    title: 'Mushaf — Arabic only',
    titleArabic: 'مصحف — عربي',
    description: 'Same page-style layout without translation under Bismillah.',
    previewStyle: 'mushaf',
    previewArabic: 'ٱلْحَمْدُ لِلَّهِ ٢',
    translationMode: 'arabic',
    layoutMode: 'mushaf_page',
  },
  {
    id: 'list_english',
    title: 'Verse list + English',
    description: 'One ayah per card with English translation below.',
    previewStyle: 'list',
    previewArabic: 'بِسْمِ ٱللَّهِ',
    previewTranslation: 'In the name of Allah',
    translationMode: 'arabic_english',
    layoutMode: 'stacked',
  },
  {
    id: 'list_urdu',
    title: 'Verse list + Urdu',
    description: 'One ayah per card with Urdu translation below.',
    previewStyle: 'list',
    previewArabic: 'بِسْمِ ٱللَّهِ',
    previewTranslation: 'اللہ کے نام سے',
    translationMode: 'arabic_urdu',
    layoutMode: 'stacked',
  },
  {
    id: 'list_arabic',
    title: 'Verse list — Arabic only',
    titleArabic: 'قائمة — عربي',
    description: 'Card layout with Arabic text only.',
    previewStyle: 'list',
    previewArabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    translationMode: 'arabic',
    layoutMode: 'stacked',
  },
];

export const DEFAULT_READING_FORMAT_ID: ReadingFormatId = 'mushaf_page';

export function getFormatById(id: string): ReadingFormatDefinition | undefined {
  return READING_FORMATS.find((format) => format.id === id);
}

export function resolveFormatSettings(id: ReadingFormatId): {
  translationMode: TranslationMode;
  layoutMode: LayoutMode;
} {
  const format = getFormatById(id);
  if (!format) {
    return { translationMode: 'arabic_english', layoutMode: 'mushaf_page' };
  }
  return {
    translationMode: format.translationMode,
    layoutMode: format.layoutMode,
  };
}

const LEGACY_FORMAT_MAP: Record<string, ReadingFormatId> = {
  uthmani_english_below: 'list_english',
  uthmani_urdu_below: 'list_urdu',
  uthmani_arabic_only: 'list_arabic',
  uthmani_english_parallel: 'list_english',
  uthmani_urdu_parallel: 'list_urdu',
  english_only: 'list_english',
  urdu_only: 'list_urdu',
  uthmani_script: 'list_english',
};

export function normalizeFormatId(id: string | undefined, translationMode: TranslationMode, layoutMode: LayoutMode): ReadingFormatId {
  if (id && getFormatById(id)) return id as ReadingFormatId;
  if (id && LEGACY_FORMAT_MAP[id]) return LEGACY_FORMAT_MAP[id];
  if (layoutMode === 'mushaf_page') {
    return translationMode === 'arabic' ? 'mushaf_arabic' : 'mushaf_page';
  }
  if (translationMode === 'arabic_urdu') return 'list_urdu';
  if (translationMode === 'arabic') return 'list_arabic';
  return 'list_english';
}

export function inferFormatId(translationMode: TranslationMode, layoutMode: LayoutMode): ReadingFormatId {
  return normalizeFormatId(undefined, translationMode, layoutMode);
}
