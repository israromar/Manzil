/** Canonical Manzil ayah ranges (display numbering). Shared by data + timing scripts. */
export type ManzilSegment = {
  surahNumber: number;
  ayahs: number[];
};

export const MANZIL_SEGMENTS: ManzilSegment[] = [
  { surahNumber: 1, ayahs: [1, 2, 3, 4, 5, 6] },
  { surahNumber: 2, ayahs: [1, 2, 3, 4, 5, 163, 255, 256, 257, 284, 285, 286] },
  { surahNumber: 3, ayahs: [18, 26, 27] },
  { surahNumber: 7, ayahs: [54, 55, 56] },
  { surahNumber: 17, ayahs: [110, 111] },
  { surahNumber: 23, ayahs: [115, 116, 117, 118] },
  { surahNumber: 37, ayahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { surahNumber: 55, ayahs: [33, 34, 35, 36, 37, 38, 39, 40] },
  { surahNumber: 59, ayahs: [21, 22, 23, 24] },
  { surahNumber: 72, ayahs: [1, 2, 3, 4] },
  { surahNumber: 109, ayahs: [1, 2, 3, 4, 5, 6] },
  { surahNumber: 112, ayahs: [1, 2, 3, 4] },
  { surahNumber: 113, ayahs: [1, 2, 3, 4, 5] },
  { surahNumber: 114, ayahs: [1, 2, 3, 4, 5, 6] },
];

export function verseKey(surahNumber: number, ayah: number) {
  return `${surahNumber}:${ayah}`;
}

/** Map Manzil ayah number to Quran.com verse key (Al-Fatiha skips standalone 1:1 Bismillah). */
export function manzilAyahToQuranAyah(
  surahNumber: number,
  manzilAyah: number,
): number {
  if (surahNumber === 1) {
    return manzilAyah + 1;
  }
  return manzilAyah;
}

export function quranVerseKey(surahNumber: number, manzilAyah: number) {
  return verseKey(surahNumber, manzilAyahToQuranAyah(surahNumber, manzilAyah));
}

export function buildManzilVerseSequence() {
  const items: Array<
    | { type: 'bismillah'; surahNumber: number }
    | {
        type: 'verse';
        id: number;
        surahNumber: number;
        ayah: number;
        verseKey: string;
      }
  > = [];

  let id = 1;
  for (const segment of MANZIL_SEGMENTS) {
    if (segment.surahNumber !== 9) {
      items.push({ type: 'bismillah', surahNumber: segment.surahNumber });
    }
    for (const ayah of segment.ayahs) {
      items.push({
        type: 'verse',
        id,
        surahNumber: segment.surahNumber,
        ayah,
        verseKey: quranVerseKey(segment.surahNumber, ayah),
      });
      id += 1;
    }
  }

  return items;
}
