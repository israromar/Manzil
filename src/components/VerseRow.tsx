import { memo } from 'react';
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

import { ARABIC_FONT_SIZE, LINE_HEIGHT_MULTIPLIER, THEMES, TRANSLATION_FONT_SIZE } from '../constants/themes';
import { useSettings } from '../hooks/useSettings';
import type { ManzilVerse } from '../types/manzil';

interface VerseRowProps {
  verse: ManzilVerse;
  active: boolean;
}

function VerseRowBase({ verse, active }: VerseRowProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const scale = PixelRatio.getFontScale();
  const arabicSize = ARABIC_FONT_SIZE[settings.fontSize] * Math.min(scale, 1.2);
  const translationSize = TRANSLATION_FONT_SIZE[settings.fontSize] * Math.min(scale, 1.2);
  const lineHeight = LINE_HEIGHT_MULTIPLIER[settings.lineHeight];

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Surah ${verse.surahName}, Ayah ${verse.ayah}, Arabic: ${verse.arabic}`}
      style={[
        styles.container,
        {
          backgroundColor: active ? theme.highlight : theme.card,
          borderColor: theme.border,
        },
      ]}>
      <Text style={[styles.arabic, { color: theme.text, fontSize: arabicSize, lineHeight: arabicSize * lineHeight }]}>
        {verse.arabic}
      </Text>
      {settings.translationMode === 'arabic_urdu' && (
        <Text style={[styles.translation, { color: theme.subtext, fontSize: translationSize, lineHeight: translationSize * lineHeight }]}>
          {verse.urdu}
        </Text>
      )}
      {settings.translationMode === 'arabic_english' && (
        <Text style={[styles.translation, { color: theme.subtext, fontSize: translationSize, lineHeight: translationSize * lineHeight }]}>
          {verse.english}
        </Text>
      )}
    </View>
  );
}

export const VerseRow = memo(VerseRowBase);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  arabic: {
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 10,
  },
  translation: {
    textAlign: 'left',
  },
});
