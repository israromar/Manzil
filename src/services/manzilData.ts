import type { ManzilData, ManzilVerse } from '../types/manzil';
import {
  isBismillahOnlyVerse,
  stripLeadingBismillah,
} from '../constants/mushaf';

import rawData from '../../assets/data/manzil.json';

function normalizeVerses(verses: ManzilVerse[]): ManzilVerse[] {
  const filtered = verses.flatMap((verse) => {
    if (verse.surahNumber !== 9 && isBismillahOnlyVerse(verse.arabic)) {
      return [];
    }
    const arabic = stripLeadingBismillah(verse.arabic.replace(/^\uFEFF/, ''));
    if (!arabic) {
      return [];
    }
    if (arabic === verse.arabic.replace(/^\uFEFF/, '')) {
      return [verse];
    }
    return [{ ...verse, arabic }];
  });

  return filtered.map((verse, index) => ({ ...verse, id: index + 1 }));
}

function normalizeSections(data: ManzilData, verses: ManzilVerse[]) {
  return data.sections.map((section) => ({
    ...section,
    startIndex: verses.findIndex(
      (verse) => verse.surahNumber === section.surahNumber,
    ),
  }));
}

export function getManzilData(): ManzilData {
  const data = rawData as ManzilData;
  const verses = normalizeVerses(data.verses);
  return {
    ...data,
    verses,
    sections: normalizeSections(data, verses),
  };
}
