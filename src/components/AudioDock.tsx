import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { THEMES } from '../constants/themes';
import { useAppAudio } from '../hooks/useAudioPlayer';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../utils/formatTime';

function AudioDockBase() {
  const router = useRouter();
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const { isPlaying, player, positionMs, durationMs } = useAppAudio();

  return (
    <Pressable style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/player')}>
      <Pressable accessibilityRole="button" style={[styles.playButton, { backgroundColor: theme.accent }]} onPress={() => (isPlaying ? player.pause() : player.play())}>
        <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </Pressable>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: theme.text }]}>Manzil Recitation</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          {formatTime(positionMs / 1000)} / {formatTime(durationMs / 1000)}
        </Text>
      </View>
    </Pressable>
  );
}

export const AudioDock = memo(AudioDockBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    gap: 12,
  },
  playButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  playButtonText: { color: '#fff', fontWeight: '600' },
  textWrap: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600' },
  subtitle: { marginTop: 2, fontSize: 12 },
});
