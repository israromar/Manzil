import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PlayerControls } from '../src/components/PlayerControls';
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: 'https://dummyimage.com/500x500/1a1a1a/ffffff&text=Manzil' }} style={styles.artwork} />
      <Text style={[styles.title, { color: theme.text }]}>Manzil Recitation</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>Stream and listen with focus</Text>

      <PlayerControls />
      <View style={styles.sourceRow}>
        <Pressable style={[styles.sourceBtn, { borderColor: theme.border, backgroundColor: source === 'stream' ? theme.accent : 'transparent' }]} onPress={() => setSource('stream')}>
          <Text style={{ color: source === 'stream' ? '#fff' : theme.text }}>Stream</Text>
        </Pressable>
        <Pressable
          disabled={downloadStatus !== 'downloaded'}
          style={[styles.sourceBtn, { borderColor: theme.border, backgroundColor: source === 'offline' ? theme.accent : 'transparent', opacity: downloadStatus === 'downloaded' ? 1 : 0.5 }]}
          onPress={() => setSource('offline')}>
          <Text style={{ color: source === 'offline' ? '#fff' : theme.text }}>Offline</Text>
        </Pressable>
      </View>

      {downloadStatus !== 'downloaded' ? (
        <Pressable style={[styles.downloadButton, { backgroundColor: theme.accent }]} onPress={onDownloadPress} disabled={downloadStatus === 'downloading'}>
          <Text style={styles.downloadText}>
            {downloadStatus === 'downloading' ? `Downloading ${Math.round(downloadProgress * 100)}%` : 'Download for offline'}
          </Text>
        </Pressable>
      ) : (
        <Pressable style={[styles.downloadButton, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onDeletePress}>
          <Text style={[styles.downloadText, { color: theme.text }]}>Delete downloaded file</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  artwork: { width: '100%', aspectRatio: 1, borderRadius: 16, marginBottom: 18 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { marginTop: 6, marginBottom: 18 },
  downloadButton: { marginTop: 24, borderRadius: 12, borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  downloadText: { color: '#fff', fontWeight: '700' },
  sourceRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  sourceBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
});
