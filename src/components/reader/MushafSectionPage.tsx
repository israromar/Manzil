import { memo, useMemo } from 'react';
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

import { AyahEndMarker, getAyahMarkerDimensions, getAyahMarkerLineOffset } from './AyahEndMarker';
import {
  BISMILLAH_ARABIC,
  BISMILLAH_ENGLISH,
  BISMILLAH_URDU,
  mushafPageLabel,
  sectionShowsBismillah,
  stripLeadingBismillah,
} from '../../constants/mushaf';
import { ARABIC_FONT_SIZE, LINE_HEIGHT_MULTIPLIER, RADIUS, THEMES } from '../../constants/themes';
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
  const arabicSize = (ARABIC_FONT_SIZE[settings.fontSize] + 4) * Math.min(scale, 1.2);
  const lineHeight = LINE_HEIGHT_MULTIPLIER[settings.lineHeight] + 0.35;
  const showBismillah = sectionShowsBismillah(section.surahNumber);
  const pageBackground = settings.theme === 'dark' ? '#0C0C0C' : theme.surface;

  const bismillahTranslation =
    settings.translationMode === 'arabic_urdu'
      ? BISMILLAH_URDU
      : settings.translationMode === 'arabic_english'
        ? BISMILLAH_ENGLISH
        : null;

  const segments = useMemo<VerseSegment[]>(() => {
    return verses.flatMap((verse, index) => {
      let arabicText = verse.arabic.replace(/^\uFEFF/, '');
      if (index === 0 && showBismillah) {
        arabicText = stripLeadingBismillah(arabicText);
      }
      if (!arabicText) return [];
      return [{ id: verse.id, ayah: verse.ayah, text: arabicText }];
    });
  }, [showBismillah, verses]);

  const lineHeightPx = arabicSize * lineHeight;

  return (
    <View style={[styles.page, { backgroundColor: pageBackground, borderColor: theme.border }]}>
      {showBismillah ? (
        <View style={styles.bismillahBlock}>
          <Text style={[styles.bismillahArabic, { color: theme.text, fontSize: arabicSize * 0.85, lineHeight: arabicSize * 1.4 }]}>
            {BISMILLAH_ARABIC}
          </Text>
          {bismillahTranslation ? (
            <Text style={[styles.bismillahTranslation, { color: theme.subtext }]}>{bismillahTranslation}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.flowWrap}>
        <View style={styles.flowRow}>
          {segments.map((segment) => {
            const isActive = highlightActive && segment.id === activeVerseId;
            const { height: markerHeight } = getAyahMarkerDimensions(arabicSize, segment.ayah);
            const markerLift = getAyahMarkerLineOffset(lineHeightPx, markerHeight, arabicSize);
            return (
              <View key={segment.id} style={styles.verseRun}>
                <Text
                  style={[
                    styles.arabic,
                    {
                      color: theme.text,
                      fontSize: arabicSize,
                      lineHeight: lineHeightPx,
                      backgroundColor: isActive ? theme.highlight : undefined,
                    },
                  ]}>
                  {segment.text}
                </Text>
                <View style={[styles.markerSlot, { marginBottom: markerLift }]}>
                  <AyahEndMarker ayah={segment.ayah} theme={theme} arabicSize={arabicSize} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={[styles.pageNumber, { color: theme.subtext }]}>{mushafPageLabel(sectionIndex, totalSections)}</Text>
    </View>
  );
}

function sectionHasActiveVerse(verses: ManzilVerse[], activeVerseId: number | null) {
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
    return prev.activeVerseId === next.activeVerseId && prev.highlightActive === next.highlightActive;
  }
  return true;
});

const styles = StyleSheet.create({
  page: {
    marginHorizontal: 12,
    marginVertical: 10,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 20,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    minHeight: 420,
    overflow: 'hidden',
  },
  bismillahBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bismillahArabic: {
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bismillahTranslation: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  flowWrap: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  flowRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    direction: 'rtl',
    justifyContent: 'center',
    alignItems: 'flex-end',
    rowGap: 10,
  },
  verseRun: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexShrink: 1,
    maxWidth: '100%',
    gap: 4,
  },
  markerSlot: {
    flexShrink: 0,
    marginHorizontal: 3,
  },
  arabic: {
    flexShrink: 1,
    writingDirection: 'rtl',
    textAlign: 'right',
    borderRadius: 4,
    paddingHorizontal: 1,
  },
  pageNumber: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: 1,
  },
});
