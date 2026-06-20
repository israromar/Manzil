import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AudioDock } from '../src/components/AudioDock';
import { VerseRow } from '../src/components/VerseRow';
import { THEMES } from '../src/constants/themes';
import { useProgressContext } from '../src/context/ProgressContext';
import { useSettings } from '../src/hooks/useSettings';
import { useManzil } from '../src/hooks/useManzil';
import { useVerseSync } from '../src/hooks/useVerseSync';
import { getVerseIndexById } from '../src/utils/verseTiming';

export default function ReaderScreen() {
  const { verseId } = useLocalSearchParams<{ verseId?: string }>();
  const { settings } = useSettings();
  const { progress, setReadingProgress } = useProgressContext();
  const { verses, sections } = useManzil();
  const activeVerseId = useVerseSync(verses);
  const flatListRef = useRef<FlatList>(null);
  const theme = THEMES[settings.theme];

  const initialVerseId = useMemo(() => Number(verseId ?? progress.lastVerseId ?? 1), [progress.lastVerseId, verseId]);
  const initialIndex = useMemo(() => Math.max(0, getVerseIndexById(verses, initialVerseId)), [initialVerseId, verses]);

  useEffect(() => {
    if (!settings.autoScroll || !activeVerseId) return;
    const targetIndex = getVerseIndexById(verses, activeVerseId);
    if (targetIndex >= 0) {
      flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
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
        initialScrollIndex={initialIndex}
        contentContainerStyle={styles.listContent}
        maxToRenderPerBatch={10}
        windowSize={7}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({ length: 170, offset: 170 * index, index })}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Read Manzil</Text>
            <Text style={{ color: theme.subtext }}>
              {sections.length} sections • {verses.length} ayat
            </Text>
          </View>
        }
        renderItem={({ item }) => <VerseRow verse={item} active={item.id === activeVerseId} />}
      />
      <AudioDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingTop: 12, paddingBottom: 6 },
  header: { marginHorizontal: 18, marginBottom: 6 },
  headerTitle: { fontSize: 24, fontWeight: '700' },
});
