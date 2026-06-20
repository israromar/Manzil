import type { ManzilTimings } from '../types/manzilTimings';

/** Delay highlight relative to audio so the indicator trails recitation slightly. */
export const VERSE_INDICATOR_DELAY_MS = 2000;

interface VerseWindow {
  verseId: number;
  startMs: number;
  endMs: number;
}

interface BismillahWindow {
  startMs: number;
  endMs: number;
}

export interface VerseSyncTimeline {
  verseWindows: VerseWindow[];
  taawwudhWindows: BismillahWindow[];
  bismillahWindows: BismillahWindow[];
}

export function buildVerseSyncTimeline(
  timings: ManzilTimings,
): VerseSyncTimeline {
  return {
    verseWindows: timings.verses.map((verse) => ({
      verseId: verse.id,
      startMs: verse.startMs,
      endMs: verse.endMs,
    })),
    taawwudhWindows: (timings.taawwudhWindows ?? []).map((window) => ({
      startMs: window.startMs,
      endMs: window.endMs,
    })),
    bismillahWindows: timings.bismillahWindows.map((window) => ({
      startMs: window.startMs,
      endMs: window.endMs,
    })),
  };
}

function mapPlaybackMs(
  positionMs: number,
  timings: ManzilTimings,
  durationMs?: number,
): number {
  if (durationMs == null || durationMs <= 0) {
    return positionMs;
  }
  return Math.round(positionMs * (timings.audioDurationMs / durationMs));
}

/**
 * Quran.com gapless model: highlight the latest ayah whose start time has passed.
 * Avoids lag from trailing silence at the end of each ayah window.
 */
export function getActiveVerseId(
  positionMs: number,
  timeline: VerseSyncTimeline,
  timings: ManzilTimings,
  durationMs?: number,
): number | null {
  if (positionMs < 0) return null;

  const playbackMs = mapPlaybackMs(positionMs, timings, durationMs);
  const syncMs = Math.max(0, playbackMs - VERSE_INDICATOR_DELAY_MS);

  const inTaawwudh = timeline.taawwudhWindows.some(
    (window) => syncMs >= window.startMs && syncMs < window.endMs,
  );
  if (inTaawwudh) return null;

  const inBismillah = timeline.bismillahWindows.some(
    (window) => syncMs >= window.startMs && syncMs < window.endMs,
  );
  if (inBismillah) return null;

  let activeVerseId: number | null = null;
  for (const window of timeline.verseWindows) {
    if (syncMs >= window.startMs) {
      activeVerseId = window.verseId;
      continue;
    }
    break;
  }

  return activeVerseId;
}

export function getVerseIndexById(
  verses: { id: number }[],
  verseId: number | null,
): number {
  if (!verseId) return -1;
  return verses.findIndex((item) => item.id === verseId);
}
