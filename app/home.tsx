import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ArchCard } from '../src/components/ui/ArchCard';
import { HeroImage } from '../src/components/ui/HeroImage';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { SecondaryButton } from '../src/components/ui/SecondaryButton';
import { StatusChip } from '../src/components/ui/StatusChip';
import { IMAGES } from '../src/constants/images';
import { THEMES } from '../src/constants/themes';
import { useAppAudio } from '../src/hooks/useAudioPlayer';
import { useSettings } from '../src/hooks/useSettings';
import { useProgressContext } from '../src/context/ProgressContext';

export default function HomeScreen() {
  const router = useRouter();
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <HeroImage source={IMAGES.heroHome} height={240}>
        <Text style={[styles.headingArabic, { color: theme.accent }]}>منزل</Text>
        <Text style={[styles.headingEnglish, { color: theme.text }]}>Your daily Manzil companion</Text>
      </HeroImage>

      {canContinue && (
        <ArchCard
          title="Continue reading"
          subtitle={`Resume from verse ${progress.lastVerseId}`}
          actionLabel="Continue"
          style={styles.archCard}
          onPress={() => router.push({ pathname: '/reader', params: { verseId: String(progress.lastVerseId) } })}
        />
      )}

      <PrimaryButton label="Read Manzil" style={styles.button} onPress={() => router.push('/reader')} />
      <SecondaryButton label="Listen to Manzil" style={styles.button} onPress={() => router.push('/player')} />

      <View style={styles.chips}>
        <StatusChip label={canContinue ? `Verse ${progress.lastVerseId}` : 'No progress yet'} />
        <StatusChip label={downloadLabel} />
      </View>

      <Pressable accessibilityRole="button" style={styles.settingsBtn} onPress={() => router.push('/settings')}>
        <Text style={{ color: theme.accent, fontWeight: '600' }}>Settings</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },
  headingArabic: { fontSize: 44, fontWeight: '700', textAlign: 'left', writingDirection: 'rtl' },
  headingEnglish: { fontSize: 16, marginTop: 6, fontWeight: '500' },
  archCard: { marginBottom: 16 },
  button: { marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  settingsBtn: { marginTop: 24, alignSelf: 'center', padding: 8 },
});
