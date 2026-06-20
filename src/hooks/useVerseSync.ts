import { useMemo } from 'react';

import { useAppAudio } from './useAudioPlayer';
import type { ManzilVerse } from '../types/manzil';
import { getActiveVerseId } from '../utils/verseTiming';

export function useVerseSync(verses: ManzilVerse[]) {
  const { positionMs } = useAppAudio();
  return useMemo(() => getActiveVerseId(positionMs / 1000, verses), [positionMs, verses]);
}
