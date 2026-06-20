import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { STORAGE_KEYS, getStoredValue, setStoredValue } from '../services/storage';
import type { ProgressState } from '../types/settings';

const DEFAULT_PROGRESS: ProgressState = {
  lastVerseId: null,
  lastScrollOffset: 0,
  audioPositionMs: 0,
  lastVisitedAt: null,
};

interface ProgressContextValue {
  ready: boolean;
  progress: ProgressState;
  setReadingProgress: (data: { lastVerseId: number | null; lastScrollOffset: number }) => void;
  setAudioPositionMs: (audioPositionMs: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);

  useEffect(() => {
    getStoredValue(STORAGE_KEYS.progress, DEFAULT_PROGRESS).then((value) => {
      setProgress(value);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timeout = setTimeout(() => setStoredValue(STORAGE_KEYS.progress, progress), 300);
    return () => clearTimeout(timeout);
  }, [ready, progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      ready,
      progress,
      setReadingProgress: ({ lastVerseId, lastScrollOffset }) =>
        setProgress((prev) => ({ ...prev, lastVerseId, lastScrollOffset, lastVisitedAt: Date.now() })),
      setAudioPositionMs: (audioPositionMs) => setProgress((prev) => ({ ...prev, audioPositionMs })),
    }),
    [ready, progress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  return context;
}
