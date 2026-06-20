import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AudioDock } from '../src/components/AudioDock';
import { MushafReader } from '../src/components/reader/MushafReader';
import { ReadingFormatButton } from '../src/components/reader/ReadingFormatButton';
import { SectionHeader } from '../src/components/reader/SectionHeader';
import { VerseRow } from '../src/components/VerseRow';
import { THEMES } from '../src/constants/themes';
import { useProgressContext } from '../src/context/ProgressContext';
import { useSettings } from '../src/hooks/useSettings';
import { useManzil } from '../src/hooks/useManzil';
import { useVerseSync } from '../src/hooks/useVerseSync';
import type { ManzilSection, ManzilVerse } from '../src/types/manzil';
import { getVerseIndexById } from '../src/utils/verseTiming';

export default function ReaderScreen() {
  const router = useRouter();
  const { verseId } = useLocalSearchParams<{ verseId?: string }>();
  const { settings } = useSettings();
  const { progress, setReadingProgress } = useProgressContext();
  const { verses, sections } = useManzil();
  const activeVerseId = useVerseSync();
  const flatListRef = useRef<FlatList<ManzilVerse>>(null);
  const theme = THEMES[settings.theme];
  const isMushaf = settings.layoutMode === 'mushaf_page';

  const sectionAtIndex = useMemo(() => {
    const map = new Map<number, ManzilSection>();
    sections.forEach((section) => map.set(section.startIndex, section));
    return map;
  }, [sections]);

  const initialVerseIdRef = useRef(
    Number(verseId ?? progress.lastVerseId ?? 1),
  );
  const initialVerseIndex = useMemo(
    () => Math.max(0, getVerseIndexById(verses, initialVerseIdRef.current)),
    [verses],
  );

  useEffect(() => {
    if (isMushaf || !settings.autoScroll || !activeVerseId) return;
    const verseIndex = getVerseIndexById(verses, activeVerseId);
    if (verseIndex >= 0) {
      flatListRef.current?.scrollToIndex({ index: verseIndex, animated: true });
    }
  }, [activeVerseId, isMushaf, settings.autoScroll, verses]);

  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.y;
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      progressTimerRef.current = setTimeout(() => {
        const approximateIndex = Math.max(0, Math.floor(offset / 170));
        const verse = verses[approximateIndex];
        setReadingProgress({
          lastVerseId: verse?.id ?? null,
          lastScrollOffset: offset,
        });
      }, 400);
    },
    [setReadingProgress, verses],
  );

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.scrollArea}>
        {isMushaf ? (
          <MushafReader
            verses={verses}
            sections={sections}
            activeVerseId={activeVerseId}
            initialVerseId={initialVerseIdRef.current}
            contentBottomInset={16}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            style={styles.list}
            data={verses}
            keyExtractor={(item) => String(item.id)}
            initialScrollIndex={initialVerseIndex}
            contentContainerStyle={[styles.listContent, { paddingBottom: 16 }]}
            maxToRenderPerBatch={10}
            windowSize={7}
            onMomentumScrollEnd={onScrollEnd}
            onScrollToIndexFailed={() => {
              flatListRef.current?.scrollToOffset({
                offset: initialVerseIndex * 170,
                animated: false,
              });
            }}
            ListHeaderComponent={
              <View style={styles.header}>
                <View style={styles.headerRow}>
                  <View style={styles.headerText}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                      Read Manzil
                    </Text>
                    <Text style={{ color: theme.subtext }}>
                      {sections.length} sections • {verses.length} ayat
                    </Text>
                  </View>
                  <ReadingFormatButton
                    onPress={() => router.push('/reading-format')}
                  />
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
        )}
      </View>
      <AudioDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollArea: { flex: 1 },
  list: { flex: 1, backgroundColor: 'transparent' },
  listContent: { paddingTop: 12 },
  header: { marginHorizontal: 16, marginBottom: 8 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700' },
});
