import type {
  FontSizeMode,
  LineHeightMode,
  ThemeMode,
} from '../types/settings';

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceGlass: string;
  text: string;
  subtext: string;
  accent: string;
  accentOn: string;
  accentSoft: string;
  accentMuted: string;
  card: string;
  border: string;
  borderGlass: string;
  highlight: string;
  shadow: string;
}

export const THEMES: Record<ThemeMode, ThemeTokens> = {
  dark: {
    background: '#0C0C0E',
    surface: '#18181C',
    surfaceGlass: 'rgba(24, 24, 28, 0.82)',
    text: '#FAFAFA',
    subtext: '#A1A1AA',
    accent: '#F0A96D',
    accentOn: '#1A1208',
    accentSoft: 'rgba(240, 169, 109, 0.18)',
    accentMuted: 'rgba(240, 169, 109, 0.55)',
    card: '#1E1E24',
    border: '#2A2A32',
    borderGlass: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(240, 169, 109, 0.16)',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
  light: {
    background: '#F4F1EA',
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.88)',
    text: '#18181B',
    subtext: '#71717A',
    accent: '#C97B2E',
    accentOn: '#FFFFFF',
    accentSoft: 'rgba(201, 123, 46, 0.14)',
    accentMuted: 'rgba(201, 123, 46, 0.65)',
    card: '#FFFFFF',
    border: '#E4E4E7',
    borderGlass: 'rgba(255, 255, 255, 0.65)',
    highlight: 'rgba(201, 123, 46, 0.1)',
    shadow: 'rgba(24, 24, 27, 0.12)',
  },
  sepia: {
    background: '#EDE4D3',
    surface: '#FBF6EC',
    surfaceGlass: 'rgba(251, 246, 236, 0.9)',
    text: '#3D2E1A',
    subtext: '#7A6650',
    accent: '#9A6328',
    accentOn: '#FBF6EC',
    accentSoft: 'rgba(154, 99, 40, 0.16)',
    accentMuted: 'rgba(154, 99, 40, 0.6)',
    card: '#FBF6EC',
    border: '#DDD0B8',
    borderGlass: 'rgba(255, 255, 255, 0.5)',
    highlight: 'rgba(154, 99, 40, 0.12)',
    shadow: 'rgba(61, 46, 26, 0.14)',
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
  card: 20,
  button: 16,
  pill: 12,
  arch: 28,
} as const;
