import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AudioDock } from '../src/components/AudioDock';
import { SectionHeader } from '../src/components/reader/SectionHeader';
import { TranslationToggle } from '../src/components/reader/TranslationToggle';
import { VerseRow } from '../src/components/VerseRow';
import { IMAGES } from '../src/constants/images';
import { RADIUS, THEMES } from '../src/constants/themes';
import { useProgressContext } from '../src/context/ProgressContext';
import { useSettings } from '../src/hooks/useSettings';
import { useManzil } from '../src/hooks/useManzil';
import { useVerseSync } from '../src/hooks/useVerseSync';
import type { ManzilSection, ManzilVerse } from '../src/types/manzil';
import { getVerseIndexById } from '../src/utils/verseTiming';

export default function ReaderScreen() {
  const { verseId } = useLocalSearchParams<{ verseId?: string }>();
  const { settings } = useSettings();
  const { progress, setReadingProgress } = useProgressContext();
  const { verses, sections } = useManzil();
  const activeVerseId = useVerseSync(verses);
  const flatListRef = useRef<FlatList<ManzilVerse>>(null);
  const theme = THEMES[settings.theme];

  const sectionAtIndex = useMemo(() => {
    const map = new Map<number, ManzilSection>();
    sections.forEach((section) => map.set(section.startIndex, section));
    return map;
  }, [sections]);

  const initialVerseId = useMemo(() => Number(verseId ?? progress.lastVerseId ?? 1), [progress.lastVerseId, verseId]);
  const initialVerseIndex = useMemo(() => Math.max(0, getVerseIndexById(verses, initialVerseId)), [initialVerseId, verses]);

  useEffect(() => {
    if (!settings.autoScroll || !activeVerseId) return;
    const verseIndex = getVerseIndexById(verses, activeVerseId);
    if (verseIndex >= 0) {
      flatListRef.current?.scrollToIndex({ index: verseIndex, animated: true });
    }
  }, [activeVerseId, settings.autoScroll, verses]);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.y;
      const approximateIndex = Math.max(0, Math.floor(offset / 170));
      const verse = verses[approximateIndex];
      setReadingProgress({ lastVerseId: verse?.id ?? null, lastScrollOffset: offset });
    },
    [setReadingProgress, verses]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={flatListRef}
        data={verses}
        keyExtractor={(item) => String(item.id)}
        initialScrollIndex={initialVerseIndex}
        contentContainerStyle={styles.listContent}
        maxToRenderPerBatch={10}
        windowSize={7}
        onMomentumScrollEnd={onScrollEnd}
        onScrollToIndexFailed={() => {
          flatListRef.current?.scrollToOffset({ offset: initialVerseIndex * 170, animated: false });
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <ImageBackground source={IMAGES.readerHeader} style={styles.banner} imageStyle={styles.bannerImage}>
              <View style={[styles.bannerOverlay, { backgroundColor: theme.background }]} />
            </ImageBackground>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Read Manzil</Text>
                <Text style={{ color: theme.subtext }}>
                  {sections.length} sections • {verses.length} ayat
                </Text>
              </View>
              <TranslationToggle />
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const section = sectionAtIndex.get(index);
          return (
            <View>
              {section ? <SectionHeader section={section} /> : null}
              <VerseRow verse={item} active={item.id === activeVerseId} />
            </View>
          );
        }}
      />
      <AudioDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingTop: 12, paddingBottom: 6 },
  header: { marginHorizontal: 16, marginBottom: 8 },
  banner: {
    height: 120,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bannerImage: { resizeMode: 'cover' },
  bannerOverlay: { ...StyleSheet.absoluteFill, opacity: 0.55 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700' },
});
