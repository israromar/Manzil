import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ReadingFormatButton } from './ReadingFormatButton';
import { MushafSectionPage } from './MushafSectionPage';
import { THEMES } from '../../constants/themes';
import { useAppAudio } from '../../hooks/useAudioPlayer';
import { useProgressContext } from '../../context/ProgressContext';
import { useSettings } from '../../hooks/useSettings';
import type { ManzilSection, ManzilVerse } from '../../types/manzil';
import { getVerseIndexById } from '../../utils/verseTiming';

interface MushafReaderProps {
  verses: ManzilVerse[];
  sections: ManzilSection[];
  activeVerseId: number | null;
  initialVerseId: number;
  contentBottomInset?: number;
}

const PAGE_ESTIMATE = 460;
const HEADER_ESTIMATE = 72;
const PROGRESS_DEBOUNCE_MS = 400;

function findSectionIndex(
  sections: ManzilSection[],
  verses: ManzilVerse[],
  verseId: number,
) {
  const verseIndex = Math.max(0, getVerseIndexById(verses, verseId));
  const sectionIdx = sections.findIndex((section, index) => {
    const nextStart = sections[index + 1]?.startIndex ?? verses.length;
    return verseIndex >= section.startIndex && verseIndex < nextStart;
  });
  return Math.max(0, sectionIdx);
}

export function MushafReader({
  verses,
  sections,
  activeVerseId,
  initialVerseId,
  contentBottomInset = 16,
}: MushafReaderProps) {
  const router = useRouter();
  const { settings } = useSettings();
  const { isPlaying } = useAppAudio();
  const { setReadingProgress } = useProgressContext();
  const theme = THEMES[settings.theme];
  const listRef = useRef<FlatList<ManzilSection>>(null);
  const userScrollingRef = useRef(false);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialScrolledRef = useRef(false);
  const initialSectionIndexRef = useRef(
    findSectionIndex(sections, verses, initialVerseId),
  );

  const sectionVerses = useMemo(() => {
    return sections.map((section, index) => {
      const nextStart = sections[index + 1]?.startIndex ?? verses.length;
      return verses.slice(section.startIndex, nextStart);
    });
  }, [sections, verses]);

  const getItemLayout = useCallback(
    (_: ArrayLike<ManzilSection> | null | undefined, index: number) => ({
      length: PAGE_ESTIMATE,
      offset: HEADER_ESTIMATE + PAGE_ESTIMATE * index,
      index,
    }),
    [],
  );

  useEffect(() => {
    if (
      !settings.autoScroll ||
      !isPlaying ||
      activeVerseId == null ||
      userScrollingRef.current
    )
      return;
    const sectionIdx = findSectionIndex(sections, verses, activeVerseId);
    if (sectionIdx >= 0) {
      listRef.current?.scrollToIndex({
        index: sectionIdx,
        animated: true,
        viewPosition: 0.15,
      });
    }
  }, [activeVerseId, isPlaying, sections, settings.autoScroll, verses]);

  useEffect(() => {
    if (hasInitialScrolledRef.current) return;
    const index = initialSectionIndexRef.current;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: false,
        viewPosition: 0,
      });
      hasInitialScrolledRef.current = true;
    });
  }, []);

  const persistScrollProgress = useCallback(
    (offset: number) => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      progressTimerRef.current = setTimeout(() => {
        const adjusted = Math.max(0, offset - HEADER_ESTIMATE);
        const sectionIndex = Math.min(
          sections.length - 1,
          Math.max(0, Math.floor(adjusted / PAGE_ESTIMATE)),
        );
        const verse = verses[sections[sectionIndex]?.startIndex ?? 0];
        setReadingProgress({
          lastVerseId: verse?.id ?? null,
          lastScrollOffset: offset,
        });
      }, PROGRESS_DEBOUNCE_MS);
    },
    [sections, setReadingProgress, verses],
  );

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  const onScrollBeginDrag = useCallback(() => {
    userScrollingRef.current = true;
  }, []);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      userScrollingRef.current = false;
      persistScrollProgress(event.nativeEvent.contentOffset.y);
    },
    [persistScrollProgress],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ManzilSection>) => (
      <MushafSectionPage
        section={item}
        verses={sectionVerses[index] ?? []}
        sectionIndex={index}
        totalSections={sections.length}
        activeVerseId={activeVerseId}
        highlightActive={isPlaying}
      />
    ),
    [activeVerseId, isPlaying, sectionVerses, sections.length],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Read Manzil
            </Text>
            <Text style={{ color: theme.subtext }}>
              Mushaf page • {sections.length} sections
            </Text>
          </View>
          <ReadingFormatButton onPress={() => router.push('/reading-format')} />
        </View>
      </View>
    ),
    [router, sections.length, theme.subtext, theme.text],
  );

  return (
    <FlatList
      ref={listRef}
      style={styles.list}
      data={sections}
      keyExtractor={(item) => String(item.surahNumber)}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: contentBottomInset },
      ]}
      initialScrollIndex={initialSectionIndexRef.current}
      getItemLayout={getItemLayout}
      maxToRenderPerBatch={2}
      windowSize={5}
      updateCellsBatchingPeriod={50}
      onScrollBeginDrag={onScrollBeginDrag}
      onMomentumScrollEnd={onScrollEnd}
      onScrollEndDrag={onScrollEnd}
      onScrollToIndexFailed={(info) => {
        listRef.current?.scrollToOffset({
          offset: HEADER_ESTIMATE + info.index * PAGE_ESTIMATE,
          animated: false,
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { paddingTop: 8 },
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
