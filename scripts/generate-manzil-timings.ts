import { execSync } from 'node:child_process';
import { unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildManzilVerseSequence,
  MANZIL_SEGMENTS,
} from './manzil-segments.ts';

const MANZIL_AUDIO_URL =
  'https://manzildua.pk/wp-content/uploads/2026/01/youtube_audio_1768290276078.mp3';

/** Mishari Rashid al-Afasy — pacing reference for Manzil full recitation. */
const QURAN_COM_RECITER_ID = 7;
const QURAN_COM_API = 'https://api.quran.com/api/v4';

/** Shorter than full 1:1 clip — Manzil gapless audio has tighter surah transitions. */
const BISMILLAH_DURATION_MS = 2800;

/** Opening Isti'adhah before Al-Fatiha — recited once at the start of Manzil audio. */
const TAAWWUDH_DURATION_MS = 4200;

type WordSegment = [number, number, number];

type ChapterTimestamp = {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments?: WordSegment[];
};

type ChapterAudioResponse = {
  audio_file: {
    audio_url: string;
    timestamps: ChapterTimestamp[];
  };
};

type VerseTimingDraft = {
  id: number;
  verseKey: string;
  surahNumber: number;
  ayah: number;
  startMs: number;
  endMs: number;
};

function measureAudioDurationMs(audioPath: string): number {
  const output = execSync(`afinfo "${audioPath}"`, { encoding: 'utf8' });
  const match = output.match(/estimated duration:\s*([\d.]+)\s*sec/);
  if (!match) {
    throw new Error(`Could not read duration from ${audioPath}`);
  }
  return Math.round(Number.parseFloat(match[1]) * 1000);
}

async function fetchChapterTimings(
  chapterNumber: number,
): Promise<Map<string, ChapterTimestamp>> {
  const url = `${QURAN_COM_API}/chapter_recitations/${QURAN_COM_RECITER_ID}/${chapterNumber}?segments=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch chapter ${chapterNumber}: ${response.status}`,
    );
  }

  const payload = (await response.json()) as ChapterAudioResponse;
  const map = new Map<string, ChapterTimestamp>();
  for (const entry of payload.audio_file.timestamps) {
    map.set(entry.verse_key, entry);
  }
  return map;
}

function wordSegments(timing: ChapterTimestamp): WordSegment[] {
  return (timing.segments ?? []).filter(
    (segment): segment is WordSegment => segment.length >= 3,
  );
}

/** Spoken length only — excludes trailing silence before the next ayah. */
function speechDurationMs(timing: ChapterTimestamp): number {
  const segments = wordSegments(timing);
  if (segments.length === 0) {
    return timing.timestamp_to - timing.timestamp_from;
  }
  const start = Math.min(...segments.map((segment) => segment[1]));
  const end = Math.max(...segments.map((segment) => segment[2]));
  return end - start;
}

function isConsecutiveQuranAyah(currentKey: string, nextKey: string): boolean {
  const [surahA, ayahA] = currentKey.split(':').map(Number);
  const [surahB, ayahB] = nextKey.split(':').map(Number);
  return surahA === surahB && ayahB === ayahA + 1;
}

function verseAdvanceMs(
  current: ChapterTimestamp,
  next: ChapterTimestamp | null,
): number {
  if (next && isConsecutiveQuranAyah(current.verse_key, next.verse_key)) {
    return next.timestamp_from - current.timestamp_from;
  }
  return speechDurationMs(current);
}

function buildRawTimeline(
  chapterMaps: Map<number, Map<string, ChapterTimestamp>>,
) {
  const taawwudhWindows: Array<{ startMs: number; endMs: number }> = [];
  const bismillahWindows: Array<{ startMs: number; endMs: number }> = [];
  const verses: VerseTimingDraft[] = [];

  let cursorMs = 0;
  const sequence = buildManzilVerseSequence();

  for (let index = 0; index < sequence.length; index += 1) {
    const item = sequence[index];

    if (item.type === 'bismillah') {
      if (item.surahNumber === 1 && taawwudhWindows.length === 0) {
        taawwudhWindows.push({
          startMs: cursorMs,
          endMs: cursorMs + TAAWWUDH_DURATION_MS,
        });
        cursorMs += TAAWWUDH_DURATION_MS;
      }

      bismillahWindows.push({
        startMs: cursorMs,
        endMs: cursorMs + BISMILLAH_DURATION_MS,
      });
      cursorMs += BISMILLAH_DURATION_MS;
      continue;
    }

    const chapterMap = chapterMaps.get(item.surahNumber);
    if (!chapterMap) {
      throw new Error(`Missing chapter map for surah ${item.surahNumber}`);
    }

    const timing = chapterMap.get(item.verseKey);
    if (!timing) {
      throw new Error(`Missing timing for ${item.verseKey}`);
    }

    const nextItem = sequence[index + 1];
    let nextTiming: ChapterTimestamp | null = null;
    if (nextItem?.type === 'verse') {
      nextTiming = chapterMap.get(nextItem.verseKey) ?? null;
    }

    const startMs = cursorMs;
    cursorMs += verseAdvanceMs(timing, nextTiming);
    verses.push({
      id: item.id,
      verseKey: item.verseKey,
      surahNumber: item.surahNumber,
      ayah: item.ayah,
      startMs,
      endMs: cursorMs,
    });
  }

  return { taawwudhWindows, bismillahWindows, verses, rawDurationMs: cursorMs };
}

function scaleTimeline<T extends { startMs: number; endMs: number }>(
  windows: T[],
  scale: number,
): T[] {
  return windows.map((window) => ({
    ...window,
    startMs: Math.round(window.startMs * scale),
    endMs: Math.round(window.endMs * scale),
  }));
}

async function run() {
  const tmpAudio = join(process.cwd(), '.tmp-manzil-audio.mp3');
  execSync(`curl -fsSL -o "${tmpAudio}" "${MANZIL_AUDIO_URL}"`);
  const audioDurationMs = measureAudioDurationMs(tmpAudio);

  const uniqueChapters = [
    ...new Set(MANZIL_SEGMENTS.map((s) => s.surahNumber)),
  ];
  const chapterMaps = new Map<number, Map<string, ChapterTimestamp>>();
  for (const chapter of uniqueChapters) {
    chapterMaps.set(chapter, await fetchChapterTimings(chapter));
  }

  const raw = buildRawTimeline(chapterMaps);
  const scale = audioDurationMs / raw.rawDurationMs;

  const output = {
    source: `Quran.com chapter_recitations/${QURAN_COM_RECITER_ID} start-to-start ayah spacing + ${TAAWWUDH_DURATION_MS}ms opening ta'awwudh + ${BISMILLAH_DURATION_MS}ms bismillah, scaled to ${MANZIL_AUDIO_URL}`,
    audioDurationMs,
    rawDurationMs: raw.rawDurationMs,
    scale,
    taawwudhDurationMs: Math.round(TAAWWUDH_DURATION_MS * scale),
    bismillahDurationMs: Math.round(BISMILLAH_DURATION_MS * scale),
    generatedAt: new Date().toISOString(),
    taawwudhWindows: scaleTimeline(raw.taawwudhWindows, scale),
    bismillahWindows: scaleTimeline(raw.bismillahWindows, scale),
    verses: scaleTimeline(raw.verses, scale),
  };

  const outPath = join(process.cwd(), 'assets', 'data', 'manzil-timings.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  try {
    unlinkSync(tmpAudio);
  } catch {
    // ignore cleanup errors
  }
  console.log(
    `Wrote ${output.verses.length} verse timings + ${output.taawwudhWindows.length} ta'awwudh + ${output.bismillahWindows.length} bismillah windows to ${outPath}`,
  );
  console.log(
    `Audio ${audioDurationMs}ms, raw ${raw.rawDurationMs}ms, scale ${scale.toFixed(4)}`,
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
