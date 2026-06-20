import type { FontSizeMode, LineHeightMode, ThemeMode } from '../types/settings';

export interface ThemeTokens {
  background: string;
  surface: string;
  text: string;
  subtext: string;
  accent: string;
  accentOn: string;
  accentSoft: string;
  card: string;
  border: string;
  highlight: string;
}

export const THEMES: Record<ThemeMode, ThemeTokens> = {
  dark: {
    background: '#141414',
    surface: '#1F1F1F',
    text: '#F2F2F2',
    subtext: '#9A9A9A',
    accent: '#F2B279',
    accentOn: '#1A1A1A',
    accentSoft: 'rgba(242, 178, 121, 0.16)',
    card: '#1F1F1F',
    border: '#2E2E2E',
    highlight: 'rgba(242, 178, 121, 0.14)',
  },
  light: {
    background: '#F7F5F0',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    subtext: '#666666',
    accent: '#C8893F',
    accentOn: '#FFFFFF',
    accentSoft: 'rgba(200, 137, 63, 0.14)',
    card: '#FFFFFF',
    border: '#E6E2DA',
    highlight: 'rgba(200, 137, 63, 0.12)',
  },
  sepia: {
    background: '#F4ECD8',
    surface: '#FBF5E8',
    text: '#3E2F1C',
    subtext: '#6C5A44',
    accent: '#7D5627',
    accentOn: '#FBF5E8',
    accentSoft: 'rgba(125, 86, 39, 0.14)',
    card: '#FBF5E8',
    border: '#E3D8C4',
    highlight: 'rgba(125, 86, 39, 0.12)',
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

export const RADIUS = {
  card: 16,
  button: 14,
  pill: 10,
  arch: 24,
} as const;
