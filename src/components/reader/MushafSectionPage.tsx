import { memo, useMemo } from 'react';
import { PixelRatio, Platform, StyleSheet, Text, View } from 'react-native';

import { AyahMarkerText } from './AyahMarkerText';
import {
  BISMILLAH_ARABIC,
  BISMILLAH_ENGLISH,
  BISMILLAH_URDU,
  mushafPageLabel,
  sectionShowsBismillah,
  sectionShowsOpeningTaawwudh,
  TAAWWUDH_ARABIC,
  TAAWWUDH_ENGLISH,
  TAAWWUDH_URDU,
} from '../../constants/mushaf';
import {
  ARABIC_FONT_SIZE,
  LINE_HEIGHT_MULTIPLIER,
  RADIUS,
  THEMES,
} from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';
import type { ManzilSection, ManzilVerse } from '../../types/manzil';

interface MushafSectionPageProps {
  section: ManzilSection;
  verses: ManzilVerse[];
  sectionIndex: number;
  totalSections: number;
  activeVerseId: number | null;
  highlightActive: boolean;
}

interface VerseSegment {
  id: number;
  ayah: number;
  text: string;
}

function MushafSectionPageBase({
  section,
  verses,
  sectionIndex,
  totalSections,
  activeVerseId,
  highlightActive,
}: MushafSectionPageProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const scale = PixelRatio.getFontScale();
  const arabicSize =
    (ARABIC_FONT_SIZE[settings.fontSize] + 4) * Math.min(scale, 1.2);
  const lineHeight = LINE_HEIGHT_MULTIPLIER[settings.lineHeight] + 0.25;
  const showBismillah = sectionShowsBismillah(section.surahNumber);
  const showOpeningTaawwudh = sectionShowsOpeningTaawwudh(
    section.surahNumber,
    sectionIndex,
  );
  const pageBackground = settings.theme === 'dark' ? '#0C0C0C' : theme.surface;

  const openingTranslation =
    settings.translationMode === 'arabic_urdu'
      ? TAAWWUDH_URDU
      : settings.translationMode === 'arabic_english'
        ? TAAWWUDH_ENGLISH
        : null;

  const bismillahTranslation =
    settings.translationMode === 'arabic_urdu'
      ? BISMILLAH_URDU
      : settings.translationMode === 'arabic_english'
        ? BISMILLAH_ENGLISH
        : null;

  const segments = useMemo<VerseSegment[]>(() => {
    return verses.map((verse) => ({
      id: verse.id,
      ayah: verse.ayah,
      text: verse.arabic.replace(/^\uFEFF/, ''),
    }));
  }, [verses]);

  const lineHeightPx = arabicSize * lineHeight;

  return (
    <View
      style={[
        styles.page,
        { backgroundColor: pageBackground, borderColor: theme.border },
      ]}
    >
      {showOpeningTaawwudh ? (
        <View style={styles.bismillahBlock}>
          <Text
            style={[
              styles.bismillahArabic,
              {
                color: theme.text,
                fontSize: arabicSize * 0.85,
                lineHeight: arabicSize * 1.35,
              },
            ]}
          >
            {TAAWWUDH_ARABIC}
          </Text>
          {openingTranslation ? (
            <Text
              style={[styles.bismillahTranslation, { color: theme.subtext }]}
            >
              {openingTranslation}
            </Text>
          ) : null}
        </View>
      ) : null}

      {showBismillah ? (
        <View style={styles.bismillahBlock}>
          <Text
            style={[
              styles.bismillahArabic,
              {
                color: theme.text,
                fontSize: arabicSize * 0.85,
                lineHeight: arabicSize * 1.35,
              },
            ]}
          >
            {BISMILLAH_ARABIC}
          </Text>
          {bismillahTranslation ? (
            <Text
              style={[styles.bismillahTranslation, { color: theme.subtext }]}
            >
              {bismillahTranslation}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.flowWrap}>
        <Text
          style={[
            styles.flow,
            {
              fontSize: arabicSize,
              lineHeight: lineHeightPx,
              color: theme.text,
            },
          ]}
        >
          {segments.map((segment) => {
            const isActive = highlightActive && segment.id === activeVerseId;
            return (
              <Text key={segment.id}>
                <Text
                  style={
                    isActive
                      ? [
                          styles.activeVerse,
                          { backgroundColor: theme.highlight },
                        ]
                      : undefined
                  }
                >
                  {segment.text}
                </Text>
                <AyahMarkerText
                  ayah={segment.ayah}
                  theme={theme}
                  arabicSize={arabicSize}
                />
              </Text>
            );
          })}
        </Text>
      </View>

      <Text style={[styles.pageNumber, { color: theme.subtext }]}>
        {mushafPageLabel(sectionIndex, totalSections)}
      </Text>
    </View>
  );
}

function sectionHasActiveVerse(
  verses: ManzilVerse[],
  activeVerseId: number | null,
) {
  if (activeVerseId == null) return false;
  return verses.some((verse) => verse.id === activeVerseId);
}

export const MushafSectionPage = memo(MushafSectionPageBase, (prev, next) => {
  if (prev.sectionIndex !== next.sectionIndex) return false;
  if (prev.totalSections !== next.totalSections) return false;
  if (prev.highlightActive !== next.highlightActive) return false;
  if (prev.verses !== next.verses) return false;
  if (prev.section.surahNumber !== next.section.surahNumber) return false;

  const prevActive = sectionHasActiveVerse(prev.verses, prev.activeVerseId);
  const nextActive = sectionHasActiveVerse(next.verses, next.activeVerseId);
  if (prevActive || nextActive) {
    return (
      prev.activeVerseId === next.activeVerseId &&
      prev.highlightActive === next.highlightActive
    );
  }
  return true;
});

const styles = StyleSheet.create({
  page: {
    marginHorizontal: 6,
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingTop: 24,
    paddingBottom: 18,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    minHeight: 420,
    overflow: 'hidden',
  },
  bismillahBlock: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  bismillahArabic: {
    textAlign: 'center',
    writingDirection: 'rtl',
    width: '100%',
  },
  bismillahTranslation: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    width: '100%',
  },
  flowWrap: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  flow: {
    width: '100%',
    textAlign: 'center',
    writingDirection: 'rtl',
    ...Platform.select({
      android: { textBreakStrategy: 'highQuality' },
      default: {},
    }),
  },
  activeVerse: {
    borderRadius: 4,
  },
  pageNumber: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1,
    width: '100%',
  },
});
