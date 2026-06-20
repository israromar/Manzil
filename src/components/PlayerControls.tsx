import Slider from '@react-native-community/slider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RADIUS, THEMES } from '../constants/themes';
import { useAppAudio } from '../hooks/useAudioPlayer';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../utils/formatTime';

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

export function PlayerControls() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const {
    isPlaying,
    positionMs,
    durationMs,
    playbackRate,
    seekBy,
    seekTo,
    setPlaybackRate,
    togglePlayback,
  } = useAppAudio();
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
        thumbTintColor={theme.accent}
      />
      <View style={styles.timeRow}>
        <Text style={{ color: theme.subtext }}>
          {formatTime(currentSeconds)}
        </Text>
        <Text style={{ color: theme.subtext }}>{formatTime(totalSeconds)}</Text>
      </View>
      <View style={styles.controlsRow}>
        <Pressable
          style={[
            styles.control,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
          onPress={() => seekBy(-10)}
        >
          <Text style={{ color: theme.text }}>-10s</Text>
        </Pressable>
        <Pressable
          style={[
            styles.control,
            styles.mainControl,
            { borderColor: theme.accent, backgroundColor: theme.accent },
          ]}
          onPress={togglePlayback}
        >
          <Text style={{ color: theme.accentOn, fontWeight: '700' }}>
            {isPlaying ? 'Pause' : 'Play'}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.control,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
          onPress={() => seekBy(10)}
        >
          <Text style={{ color: theme.text }}>+10s</Text>
        </Pressable>
      </View>
      <View style={styles.speedRow}>
        {SPEEDS.map((speed) => {
          const active = playbackRate === speed;
          return (
            <Pressable
              key={speed}
              style={[
                styles.speedButton,
                {
                  borderColor: active ? theme.accent : theme.border,
                  backgroundColor: active ? theme.accent : theme.surface,
                },
              ]}
              onPress={() => setPlaybackRate(speed)}
            >
              <Text
                style={{
                  color: active ? theme.accentOn : theme.text,
                  fontWeight: active ? '600' : '400',
                }}
              >
                {speed}x
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  control: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RADIUS.button,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mainControl: { flex: 1.2 },
  speedRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    justifyContent: 'center',
  },
  speedButton: {
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
