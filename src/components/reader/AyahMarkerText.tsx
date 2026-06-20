import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { toArabicNumerals } from '../../constants/mushaf';
import type { ThemeTokens } from '../../constants/themes';

interface AyahMarkerTextProps {
  ayah: number;
  theme: ThemeTokens;
  arabicSize?: number;
}

const ORNATE_OPEN = '\uFD3F';
const ORNATE_CLOSE = '\uFD3E';

/**
 * Text-only ayah marker — must stay inside a flowing Text parent.
 * View-based circles break flex lines; styled nested Text borders become vertical bars on Android.
 * Ornate brackets ﴿ ﴾ flow inline like a printed mushaf.
 */
function AyahMarkerTextBase({
  ayah,
  theme,
  arabicSize = 28,
}: AyahMarkerTextProps) {
  const size = Math.max(9, Math.round(arabicSize * 0.38));

  return (
    <Text
      style={[
        styles.marker,
        { color: theme.accent, fontSize: size, lineHeight: size + 4 },
      ]}
    >
      {`\u2009${ORNATE_OPEN}${toArabicNumerals(ayah)}${ORNATE_CLOSE}\u2009`}
    </Text>
  );
}

export const AyahMarkerText = memo(AyahMarkerTextBase);

const styles = StyleSheet.create({
  marker: {
    fontWeight: '700',
    includeFontPadding: false,
  },
});
