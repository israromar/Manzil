import { memo } from 'react';
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

import { ARABIC_FONT_SIZE, LINE_HEIGHT_MULTIPLIER, RADIUS, THEMES, TRANSLATION_FONT_SIZE } from '../constants/themes';
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
  const showArabic = settings.layoutMode !== 'translation_only';
  const showTranslation =
    settings.layoutMode === 'translation_only' ||
    (settings.layoutMode === 'stacked' && settings.translationMode !== 'arabic');
  const translationText =
    settings.translationMode === 'arabic_urdu' ? verse.urdu : settings.translationMode === 'arabic_english' ? verse.english : null;
  const sideBySide = settings.layoutMode === 'side_by_side' && showArabic && translationText;

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Surah ${verse.surahName}, Ayah ${verse.ayah}, Arabic: ${verse.arabic}`}
      style={[
        styles.container,
        {
          backgroundColor: active ? theme.highlight : theme.surface,
          borderColor: active ? theme.accent : theme.border,
        },
      ]}>
      {active && <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />}
      <Text style={[styles.meta, { color: theme.subtext }]}>
        {verse.surahName} • {verse.ayah}
      </Text>

      {sideBySide ? (
        <View style={styles.parallelRow}>
          <Text
            style={[
              styles.parallelTranslation,
              { color: theme.subtext, fontSize: translationSize, lineHeight: translationSize * lineHeight, flex: 1 },
            ]}>
            {translationText}
          </Text>
          <Text
            style={[
              styles.parallelArabic,
              { color: theme.text, fontSize: arabicSize, lineHeight: arabicSize * lineHeight, flex: 1 },
            ]}>
            {verse.arabic}
          </Text>
        </View>
      ) : (
        <>
          {showArabic && (
            <Text style={[styles.arabic, { color: theme.text, fontSize: arabicSize, lineHeight: arabicSize * lineHeight }]}>
              {verse.arabic}
            </Text>
          )}
          {showTranslation && settings.translationMode === 'arabic_urdu' && (
            <Text style={[styles.translation, { color: theme.subtext, fontSize: translationSize, lineHeight: translationSize * lineHeight }]}>
              {verse.urdu}
            </Text>
          )}
          {showTranslation && settings.translationMode === 'arabic_english' && (
            <Text style={[styles.translation, { color: theme.subtext, fontSize: translationSize, lineHeight: translationSize * lineHeight }]}>
              {verse.english}
            </Text>
          )}
        </>
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
    paddingLeft: 20,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  arabic: {
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: 10,
  },
  translation: {
    textAlign: 'left',
  },
  parallelRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  parallelArabic: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  parallelTranslation: {
    textAlign: 'left',
  },
});
