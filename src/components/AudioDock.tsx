import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { IMAGES } from '../constants/images';
import { RADIUS, THEMES } from '../constants/themes';
import { useAppAudio } from '../hooks/useAudioPlayer';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../utils/formatTime';

function AudioDockBase() {
  const router = useRouter();
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const { isPlaying, player, positionMs, durationMs } = useAppAudio();
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: theme.accent, width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
      <Pressable
        style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => router.push('/player')}>
        <Image source={IMAGES.audioThumb} style={styles.artwork} resizeMode="cover" accessibilityLabel="Manzil artwork" />
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: theme.text }]}>Manzil Recitation</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            {formatTime(positionMs / 1000)} / {formatTime(durationMs / 1000)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={[styles.playButton, { backgroundColor: theme.accent }]}
          onPress={(event) => {
            event.stopPropagation();
            if (isPlaying) player.pause();
            else player.play();
          }}>
          <Text style={[styles.playButtonText, { color: theme.accentOn }]}>{isPlaying ? '❚❚' : '▶'}</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

export const AudioDock = memo(AudioDockBase);

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'transparent',
  },
  progressFill: {
    height: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.card,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    gap: 12,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  textWrap: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600' },
  subtitle: { marginTop: 2, fontSize: 12 },
});
