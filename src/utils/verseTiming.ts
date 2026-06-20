import type { ManzilVerse } from '../types/manzil';

export function getActiveVerseId(
  currentTimeSeconds: number,
  verses: ManzilVerse[],
): number | null {
  const verse = verses.find(
    (item) =>
      currentTimeSeconds >= item.startTime && currentTimeSeconds < item.endTime,
  );
  return verse?.id ?? null;
}

export function getVerseIndexById(
  verses: ManzilVerse[],
  verseId: number | null,
): number {
  if (!verseId) return -1;
  return verses.findIndex((item) => item.id === verseId);
}
