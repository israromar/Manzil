import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.headingArabic, { color: theme.text }]}>منزل</Text>
      <Text style={[styles.headingEnglish, { color: theme.subtext }]}>Your daily Manzil companion</Text>

      <Pressable style={[styles.action, { backgroundColor: theme.accent }]} onPress={() => router.push('/reader')}>
        <Text style={styles.actionText}>Read Manzil</Text>
      </Pressable>
      <Pressable style={[styles.action, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => router.push('/player')}>
        <Text style={[styles.actionTextSecondary, { color: theme.text }]}>Listen to Manzil</Text>
      </Pressable>
      <Pressable
        disabled={!canContinue}
        style={[styles.action, { backgroundColor: canContinue ? theme.card : theme.border, borderColor: theme.border }]}
        onPress={() => router.push({ pathname: '/reader', params: { verseId: String(progress.lastVerseId ?? 1) } })}>
        <Text style={[styles.actionTextSecondary, { color: theme.text }]}>Continue</Text>
      </Pressable>

      <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Last read position</Text>
        <Text style={{ color: theme.subtext }}>
          {canContinue ? `Verse ${progress.lastVerseId}` : 'No reading progress yet'}
        </Text>
      </View>
      <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Download status</Text>
        <Text style={{ color: theme.subtext }}>
          {downloadStatus === 'downloaded'
            ? 'Available offline'
            : downloadStatus === 'downloading'
              ? `Downloading ${Math.round(downloadProgress * 100)}%`
              : 'Stream only'}
        </Text>
      </View>

      <Pressable style={styles.settingsBtn} onPress={() => router.push('/settings')}>
        <Text style={{ color: theme.accent }}>Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 72 },
  headingArabic: { fontSize: 40, textAlign: 'center', writingDirection: 'rtl' },
  headingEnglish: { fontSize: 16, textAlign: 'center', marginTop: 8, marginBottom: 30 },
  action: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1 },
  actionText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  actionTextSecondary: { fontSize: 18, fontWeight: '600' },
  infoCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 8 },
  infoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  settingsBtn: { marginTop: 20, alignSelf: 'center' },
});
