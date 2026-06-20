import { useMemo } from 'react';

import { getManzilTimings } from '../services/manzilTimings';
import { useAppAudio } from './useAudioPlayer';
import { buildVerseSyncTimeline, getActiveVerseId } from '../utils/verseTiming';

export function useVerseSync() {
  const { positionMs, durationMs } = useAppAudio();
  const timings = useMemo(() => getManzilTimings(), []);
  const timeline = useMemo(() => buildVerseSyncTimeline(timings), [timings]);

  return useMemo(
    () =>
      getActiveVerseId(
        positionMs,
        timeline,
        timings,
        durationMs > 0 ? durationMs : undefined,
      ),
    [durationMs, positionMs, timeline, timings],
  );
}
