import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';

import { MANZIL_AUDIO_URL } from '../constants/audio';
import { getOfflineAudioInfo, getOfflineAudioUri } from '../services/audioDownload';

type DownloadStatus = 'none' | 'downloading' | 'downloaded';

interface AudioContextValue {
  player: ReturnType<typeof useAudioPlayer>;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  playbackRate: number;
  source: 'stream' | 'offline';
  downloadStatus: DownloadStatus;
  downloadProgress: number;
  setSource: (source: 'stream' | 'offline') => void;
  setPlaybackRate: (rate: number) => void;
  seekBy: (seconds: number) => void;
  seekTo: (seconds: number) => void;
  refreshDownloadState: () => Promise<void>;
  setDownloadState: (status: DownloadStatus, progress: number) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: PropsWithChildren) {
  const [source, setSource] = useState<'stream' | 'offline'>('stream');
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>('none');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const player = useAudioPlayer(MANZIL_AUDIO_URL, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
      interruptionModeAndroid: 'doNotMix',
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    void getOfflineAudioInfo().then((info) => {
      if (info.exists) {
        setDownloadStatus('downloaded');
      }
    });
  }, []);

  useEffect(() => {
    const targetSource = source === 'offline' && downloadStatus === 'downloaded' ? getOfflineAudioUri() : MANZIL_AUDIO_URL;
    player.replace(targetSource);
  }, [downloadStatus, player, source]);

  useEffect(() => {
    if (!status.playing) return;
    player.setActiveForLockScreen(
      true,
      { title: 'Manzil', artist: 'Manzil App' },
      { showSeekForward: true, showSeekBackward: true }
    );
  }, [player, status.playing]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    // Best-effort permission request for media notification controls.
    void import('expo-audio').then((module) => module.requestNotificationPermissionsAsync().catch(() => undefined));
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({
      player,
      isPlaying: status.playing,
      positionMs: Math.round(status.currentTime * 1000),
      durationMs: Math.round(status.duration * 1000),
      playbackRate,
      source,
      downloadStatus,
      downloadProgress,
      setSource,
      setPlaybackRate: (rate) => {
        player.setPlaybackRate(rate);
        setPlaybackRateState(rate);
      },
      seekBy: (seconds) => {
        void player.seekTo(Math.max(0, (status.currentTime || 0) + seconds));
      },
      seekTo: (seconds) => {
        void player.seekTo(Math.max(0, seconds));
      },
      refreshDownloadState: async () => {
        const info = await getOfflineAudioInfo();
        setDownloadStatus(info.exists ? 'downloaded' : 'none');
        if (!info.exists) setDownloadProgress(0);
        if (info.exists) setSource('offline');
      },
      setDownloadState: (nextStatus, progress) => {
        setDownloadStatus(nextStatus);
        setDownloadProgress(progress);
      },
    }),
    [downloadProgress, downloadStatus, playbackRate, player, source, status.currentTime, status.duration, status.playing]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider');
  }
  return context;
}
