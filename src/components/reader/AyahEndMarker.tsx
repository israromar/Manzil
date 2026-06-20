import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { toArabicNumerals } from '../../constants/mushaf';
import type { ThemeTokens } from '../../constants/themes';

interface AyahEndMarkerProps {
  ayah: number;
  theme: ThemeTokens;
  arabicSize?: number;
}

export function getAyahMarkerDimensions(arabicSize: number, ayah: number) {
  const numeral = toArabicNumerals(ayah);
  const digitCount = numeral.length;
  const height = Math.round(Math.max(22, Math.min(28, arabicSize * 0.85)));
  const width = digitCount === 1 ? height : height + (digitCount - 1) * 9;
  const fontSize = digitCount === 1 ? 11 : digitCount === 2 ? 10 : 9;
  return { width, height, fontSize, numeral };
}

/** Lift marker so it sits centered on the last line of Arabic text. */
export function getAyahMarkerLineOffset(lineHeightPx: number, markerHeight: number, fontSize?: number) {
  const base = (lineHeightPx - markerHeight) / 2;
  const arabicNudge = fontSize ? fontSize * 0.05 : 0;
  return Math.max(0, Math.round(base - arabicNudge));
}

function AyahEndMarkerBase({ ayah, theme, arabicSize = 28 }: AyahEndMarkerProps) {
  const { width, height, fontSize, numeral } = getAyahMarkerDimensions(arabicSize, ayah);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.shell,
        {
          width,
          height,
          borderRadius: height / 2,
          borderColor: theme.accent,
          backgroundColor: theme.accentSoft,
        },
      ]}>
      <Text style={[styles.number, { color: theme.accent, fontSize, lineHeight: fontSize + 2 }]}>{numeral}</Text>
    </View>
  );
}

export const AyahEndMarker = memo(AyahEndMarkerBase);

const styles = StyleSheet.create({
  shell: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  number: {
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
