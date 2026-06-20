import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArtworkCard } from '../src/components/player/ArtworkCard';
import { PlayerControls } from '../src/components/PlayerControls';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { ScreenBackground } from '../src/components/ui/ScreenBackground';
import { SecondaryButton } from '../src/components/ui/SecondaryButton';
import { SegmentedControl } from '../src/components/ui/SegmentedControl';
import { IMAGES } from '../src/constants/images';
import { THEMES } from '../src/constants/themes';
import { useAppAudio } from '../src/hooks/useAudioPlayer';
import { useSettings } from '../src/hooks/useSettings';
import { deleteOfflineAudio, downloadOfflineAudio } from '../src/services/audioDownload';

export default function PlayerScreen() {
  const { settings } = useSettings();
  const { downloadStatus, downloadProgress, setDownloadState, refreshDownloadState, source, setSource } = useAppAudio();
  const theme = THEMES[settings.theme];

  const onDownloadPress = async () => {
    setDownloadState('downloading', 0);
    try {
      await downloadOfflineAudio((progress) => setDownloadState('downloading', progress));
      setDownloadState('downloaded', 1);
      await refreshDownloadState();
    } catch {
      setDownloadState('none', 0);
    }
  };

  const onDeletePress = async () => {
    await deleteOfflineAudio();
    await refreshDownloadState();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScreenBackground source={IMAGES.splashBg} opacity={0.14} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ArtworkCard />
      <Text style={[styles.title, { color: theme.text }]}>Manzil Recitation</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>Stream and listen with focus</Text>

      <PlayerControls />

      <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Audio source</Text>
      <SegmentedControl
        options={['stream', 'offline'] as const}
        value={source}
        onChange={(value) => {
          if (value === 'offline' && downloadStatus !== 'downloaded') return;
          setSource(value);
        }}
        formatLabel={(value) => (value === 'stream' ? 'Stream' : 'Offline')}
      />

      {downloadStatus !== 'downloaded' ? (
        <PrimaryButton
          label={downloadStatus === 'downloading' ? `Downloading ${Math.round(downloadProgress * 100)}%` : 'Download for offline'}
          style={styles.downloadButton}
          onPress={onDownloadPress}
          disabled={downloadStatus === 'downloading'}
        />
      ) : (
        <SecondaryButton label="Delete downloaded file" style={styles.downloadButton} onPress={onDeletePress} />
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { marginTop: 6, marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginTop: 24, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  downloadButton: { marginTop: 20 },
});
