import { memo } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { IMAGES } from '../constants/images';
import { RADIUS, THEMES } from '../constants/themes';
import { useAppAudio } from '../hooks/useAudioPlayer';
import { useAudioDockSafeBottom } from '../hooks/useAudioDockInset';
import { useSettings } from '../hooks/useSettings';
import { formatTime } from '../utils/formatTime';

function AudioDockBase() {
  const router = useRouter();
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const safeBottom = useAudioDockSafeBottom();
  const { isPlaying, positionMs, durationMs, seekBy, togglePlayback } =
    useAppAudio();
  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;

  const onTogglePlayback = (event?: { stopPropagation?: () => void }) => {
    event?.stopPropagation?.();
    togglePlayback();
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingBottom: safeBottom,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open full audio player"
        accessibilityHint="Shows playback controls, speed, and offline download"
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        onPress={() => router.push('/player')}
      >
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <View
            style={{
              flex: progress,
              backgroundColor: theme.accent,
              height: 4,
              borderRadius: 2,
            }}
          />
          <View style={{ flex: 1 - progress, height: 4 }} />
        </View>

        <View style={styles.row}>
          <Image
            source={IMAGES.audioThumb}
            style={[styles.artwork, { borderColor: theme.border }]}
            resizeMode="cover"
            accessibilityLabel="Manzil artwork"
          />

          <View style={styles.textWrap}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.title, { color: theme.text }]}
                numberOfLines={1}
              >
                Manzil Recitation
              </Text>
              {isPlaying ? (
                <View
                  style={[
                    styles.liveChip,
                    {
                      backgroundColor: theme.accentSoft,
                      borderColor: theme.accent,
                    },
                  ]}
                >
                  <View
                    style={[styles.liveDot, { backgroundColor: theme.accent }]}
                  />
                  <Text style={[styles.liveText, { color: theme.accent }]}>
                    Playing
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.subtitle, { color: theme.subtext }]}>
              {formatTime(positionMs / 1000)} / {formatTime(durationMs / 1000)}
            </Text>
            <Text style={[styles.hint, { color: theme.subtext }]}>
              Tap for full player
            </Text>
          </View>

          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rewind 10 seconds"
              style={[
                styles.skipButton,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
              onPress={(event) => {
                event.stopPropagation();
                seekBy(-10);
              }}
            >
              <Text style={[styles.skipText, { color: theme.text }]}>−10</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              style={[
                styles.playButton,
                { backgroundColor: theme.accent, borderColor: theme.accent },
              ]}
              onPress={onTogglePlayback}
            >
              <Text style={[styles.playButtonText, { color: theme.accentOn }]}>
                {isPlaying ? '❚❚' : '▶'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Forward 10 seconds"
              style={[
                styles.skipButton,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
              onPress={(event) => {
                event.stopPropagation();
                seekBy(10);
              }}
            >
              <Text style={[styles.skipText, { color: theme.text }]}>+10</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export const AudioDock = memo(AudioDockBase);

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  card: {
    borderWidth: 1,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
  },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    marginTop: 2,
    fontSize: 11,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skipButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
