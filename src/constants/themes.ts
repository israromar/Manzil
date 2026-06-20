import type { FontSizeMode, LineHeightMode, ThemeMode } from '../types/settings';

export const THEMES: Record<
  ThemeMode,
  { background: string; text: string; subtext: string; accent: string; card: string; border: string; highlight: string }
> = {
  light: {
    background: '#FAFAF8',
    text: '#1A1A1A',
    subtext: '#666666',
    accent: '#2D6A4F',
    card: '#FFFFFF',
    border: '#E8E8E8',
    highlight: '#EAF6EF',
  },
  dark: {
    background: '#121212',
    text: '#E8E8E8',
    subtext: '#B0B0B0',
    accent: '#52B788',
    card: '#1A1A1A',
    border: '#2A2A2A',
    highlight: '#1E2D25',
  },
  sepia: {
    background: '#F4ECD8',
    text: '#3E2F1C',
    subtext: '#6C5A44',
    accent: '#6B4E3D',
    card: '#FBF5E8',
    border: '#E3D8C4',
    highlight: '#EFE0C7',
  },
};

export const ARABIC_FONT_SIZE: Record<FontSizeMode, number> = {
  small: 20,
  medium: 24,
  large: 28,
  xl: 32,
};

export const TRANSLATION_FONT_SIZE: Record<FontSizeMode, number> = {
  small: 14,
  medium: 16,
  large: 18,
  xl: 20,
};

export const LINE_HEIGHT_MULTIPLIER: Record<LineHeightMode, number> = {
  compact: 1.4,
  comfortable: 1.6,
  spacious: 1.9,
};
