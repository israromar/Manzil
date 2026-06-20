import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from 'expo-audio';
import { Platform, Image } from 'react-native';

import { MANZIL_AUDIO_URL } from '../constants/audio';
import { IMAGES } from '../constants/images';
import {
  getOfflineAudioInfo,
  getOfflineAudioUri,
} from '../services/audioDownload';

type DownloadStatus = 'none' | 'downloading' | 'downloaded';

const LOCK_SCREEN_METADATA = {
  title: 'Manzil',
  artist: 'Manzil Recitation',
  albumTitle: 'Manzil',
  artworkUrl: Image.resolveAssetSource(IMAGES.audioThumb).uri,
};

const LOCK_SCREEN_OPTIONS = {
  showSeekForward: true,
  showSeekBackward: true,
} as const;

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
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
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
  const lockScreenEnabledRef = useRef(false);
  const player = useAudioPlayer(MANZIL_AUDIO_URL, {
    updateInterval: 500,
    keepAudioSessionActive: true,
  });
  const status = useAudioPlayerStatus(player);

  const ensureLockScreenControls = useCallback(() => {
    if (lockScreenEnabledRef.current) return;
    lockScreenEnabledRef.current = true;
    player.setActiveForLockScreen(
      true,
      LOCK_SCREEN_METADATA,
      LOCK_SCREEN_OPTIONS,
    );
  }, [player]);

  const play = useCallback(() => {
    ensureLockScreenControls();
    player.play();
  }, [ensureLockScreenControls, player]);

  const pause = useCallback(() => {
    player.pause();
  }, [player]);

  const togglePlayback = useCallback(() => {
    if (status.playing) {
      player.pause();
      return;
    }
    ensureLockScreenControls();
    player.play();
  }, [ensureLockScreenControls, player, status.playing]);

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
    const targetSource =
      source === 'offline' && downloadStatus === 'downloaded'
        ? getOfflineAudioUri()
        : MANZIL_AUDIO_URL;
    player.replace(targetSource);
  }, [downloadStatus, player, source]);

  useEffect(() => {
    return () => {
      lockScreenEnabledRef.current = false;
      player.setActiveForLockScreen(false);
    };
  }, [player]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void import('expo-audio').then((module) =>
      module.requestNotificationPermissionsAsync().catch(() => undefined),
    );
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
      play,
      pause,
      togglePlayback,
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
    [
      downloadProgress,
      downloadStatus,
      pause,
      play,
      playbackRate,
      player,
      source,
      status.currentTime,
      status.duration,
      status.playing,
      togglePlayback,
    ],
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider');
  }
  return context;
}
