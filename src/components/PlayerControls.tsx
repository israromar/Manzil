import Slider from '@react-native-community/slider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '../constants/themes';
import { useAppAudio } from '../hooks/useAudioPlayer';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../utils/formatTime';

const SPEEDS = [0.75, 1, 1.25, 1.5];

export function PlayerControls() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const { player, isPlaying, positionMs, durationMs, playbackRate, seekBy, seekTo, setPlaybackRate } = useAppAudio();
  const totalSeconds = durationMs / 1000 || 1;
  const currentSeconds = Math.min(positionMs / 1000, totalSeconds);

  return (
    <View>
      <Slider
        minimumValue={0}
        maximumValue={totalSeconds}
        value={currentSeconds}
        onSlidingComplete={(value) => seekTo(value)}
        minimumTrackTintColor={theme.accent}
        maximumTrackTintColor={theme.border}
      />
      <View style={styles.timeRow}>
        <Text style={{ color: theme.subtext }}>{formatTime(currentSeconds)}</Text>
        <Text style={{ color: theme.subtext }}>{formatTime(totalSeconds)}</Text>
      </View>
      <View style={styles.controlsRow}>
        <Pressable style={[styles.control, { borderColor: theme.border }]} onPress={() => seekBy(-10)}>
          <Text style={{ color: theme.text }}>-10s</Text>
        </Pressable>
        <Pressable style={[styles.control, { borderColor: theme.border, backgroundColor: theme.accent }]} onPress={() => (isPlaying ? player.pause() : player.play())}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </Pressable>
        <Pressable style={[styles.control, { borderColor: theme.border }]} onPress={() => seekBy(10)}>
          <Text style={{ color: theme.text }}>+10s</Text>
        </Pressable>
      </View>
      <View style={styles.speedRow}>
        {SPEEDS.map((speed) => (
          <Pressable key={speed} style={[styles.speedButton, { borderColor: theme.border, backgroundColor: playbackRate === speed ? theme.accent : 'transparent' }]} onPress={() => setPlaybackRate(speed)}>
            <Text style={{ color: playbackRate === speed ? '#fff' : theme.text }}>{speed}x</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  control: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  speedRow: { flexDirection: 'row', marginTop: 16, gap: 8, justifyContent: 'center' },
  speedButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
});
