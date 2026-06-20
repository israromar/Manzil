import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionCard } from '../src/components/ui/ActionCard';
import { GlassCard } from '../src/components/ui/GlassCard';
import { MetricTile } from '../src/components/ui/MetricTile';
import { IMAGES } from '../src/constants/images';
import { RADIUS, THEMES } from '../src/constants/themes';
import { useAppAudio } from '../src/hooks/useAudioPlayer';
import { useSettings } from '../src/hooks/useSettings';
import { useProgressContext } from '../src/context/ProgressContext';

const HERO_BODY_SCRIM = 0.68;
const HERO_FADE_STEP_HEIGHT = 14;
/** Adjacent strips (not stacked) — approximates a gradient from solid header to body scrim. */
const HERO_FADE_OPACITIES = [0.92, 0.84, 0.78, 0.73, HERO_BODY_SCRIM] as const;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { progress } = useProgressContext();
  const { downloadStatus, downloadProgress } = useAppAudio();
  const theme = THEMES[settings.theme];

  const canContinue = progress.lastVerseId !== null;
  const downloadLabel =
    downloadStatus === 'downloaded'
      ? 'Available offline'
      : downloadStatus === 'downloading'
        ? `Downloading ${Math.round(downloadProgress * 100)}%`
        : 'Stream only';

  const headerHeight = insets.top + 54;
  const fadeZoneHeight = HERO_FADE_OPACITIES.length * HERO_FADE_STEP_HEIGHT;
  const bodyScrimTop = headerHeight + fadeZoneHeight;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.heroWrap}>
        <ImageBackground
          source={IMAGES.appBackground}
          style={styles.heroImage}
          imageStyle={styles.heroImageInner}
        >
          <View
            style={[
              styles.heroHeaderCap,
              { height: headerHeight, backgroundColor: theme.background },
            ]}
          />
          {HERO_FADE_OPACITIES.map((opacity, index) => (
            <View
              key={index}
              style={[
                styles.heroFadeStep,
                {
                  top: headerHeight + index * HERO_FADE_STEP_HEIGHT,
                  height: HERO_FADE_STEP_HEIGHT,
                  backgroundColor: theme.background,
                  opacity,
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.heroBodyScrim,
              { top: bodyScrimTop, backgroundColor: theme.background },
            ]}
          />
          <View style={[styles.heroBar, { paddingTop: insets.top + 12 }]}>
            <View
              style={[
                styles.brandPill,
                {
                  backgroundColor: theme.surfaceGlass,
                  borderColor: theme.borderGlass,
                },
              ]}
            >
              <Text style={[styles.brandPillText, { color: theme.accent }]}>
                Manzil
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => router.push('/settings')}
              style={({ pressed }) => [
                styles.settingsButton,
                {
                  backgroundColor: theme.surfaceGlass,
                  borderColor: theme.borderGlass,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.settingsGlyph, { color: theme.text }]}>
                ⚙
              </Text>
            </Pressable>
          </View>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroArabic, { color: theme.accent }]}>
              منزل
            </Text>
            <Text style={[styles.heroEnglish, { color: theme.text }]}>
              Your daily Manzil companion
            </Text>
            <Text style={[styles.heroTagline, { color: theme.subtext }]}>
              Read, listen, and resume where you left off
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.body}>
        {canContinue ? (
          <GlassCard accentEdge style={styles.continueCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/reader',
                  params: { verseId: String(progress.lastVerseId) },
                })
              }
              style={({ pressed }) => [
                styles.continuePressable,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.continueCopy}>
                <Text style={[styles.continueEyebrow, { color: theme.accent }]}>
                  Pick up where you stopped
                </Text>
                <Text style={[styles.continueTitle, { color: theme.text }]}>
                  Continue reading
                </Text>
                <Text
                  style={[styles.continueSubtitle, { color: theme.subtext }]}
                >
                  Verse {progress.lastVerseId} · tap to resume
                </Text>
              </View>
              <View
                style={[
                  styles.continueAction,
                  { backgroundColor: theme.accentSoft },
                ]}
              >
                <Text style={[styles.continueArrow, { color: theme.accent }]}>
                  →
                </Text>
              </View>
            </Pressable>
          </GlassCard>
        ) : null}

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>
          Quick actions
        </Text>

        <ActionCard
          title="Read Manzil"
          subtitle="Mushaf-style pages with verse highlighting"
          glyph="۞"
          variant="primary"
          style={styles.actionCard}
          onPress={() => router.push('/reader')}
        />
        <ActionCard
          title="Listen to Manzil"
          subtitle="Background playback with lock-screen controls"
          glyph="♫"
          variant="secondary"
          style={styles.actionCard}
          onPress={() => router.push('/player')}
        />

        <View style={styles.metricsRow}>
          <MetricTile
            label="Progress"
            value={
              canContinue ? `Verse ${progress.lastVerseId}` : 'Not started'
            }
            accent={canContinue}
          />
          <MetricTile
            label="Audio"
            value={downloadLabel}
            accent={downloadStatus === 'downloaded'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 48 },
  heroWrap: {
    marginBottom: 8,
  },
  heroImage: {
    minHeight: 300,
    justifyContent: 'space-between',
  },
  heroImageInner: {
    resizeMode: 'cover',
  },
  heroHeaderCap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroFadeStep: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  heroBodyScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: HERO_BODY_SCRIM,
  },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brandPill: {
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  brandPillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsGlyph: {
    fontSize: 18,
  },
  heroCopy: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 6,
  },
  heroArabic: {
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 64,
    writingDirection: 'rtl',
    letterSpacing: -1,
  },
  heroEnglish: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  heroTagline: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginTop: 2,
    maxWidth: 280,
  },
  body: {
    paddingHorizontal: 20,
    gap: 12,
  },
  continueCard: {
    marginBottom: 4,
  },
  continuePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  continueCopy: {
    flex: 1,
    gap: 4,
  },
  continueEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  continueTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  continueSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  continueAction: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueArrow: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  actionCard: {
    marginBottom: 0,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  pressed: {
    opacity: 0.88,
  },
});
