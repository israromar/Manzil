import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ESTIMATED_TOTAL_DURATION_SECONDS = 22 * 60;
const DATA_SOURCE_NOTE =
  'Source: api.alquran.cloud editions quran-uthmani (Arabic), en.sahih (English), ur.jalandhry (Urdu).';

type Segment = {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahs: number[];
};

const MANZIL_SEGMENTS: Segment[] = [
  {
    surahNumber: 1,
    surahName: 'Al-Fatiha',
    surahNameArabic: 'الفاتحة',
    ayahs: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    ayahs: [1, 2, 3, 4, 5, 163, 255, 256, 257, 284, 285, 286],
  },
  {
    surahNumber: 3,
    surahName: 'Aal-e-Imran',
    surahNameArabic: 'آل عمران',
    ayahs: [18, 26, 27],
  },
  {
    surahNumber: 7,
    surahName: "Al-A'raf",
    surahNameArabic: 'الأعراف',
    ayahs: [54, 55, 56],
  },
  {
    surahNumber: 17,
    surahName: 'Al-Isra',
    surahNameArabic: 'الإسراء',
    ayahs: [110, 111],
  },
  {
    surahNumber: 23,
    surahName: "Al-Mu'minun",
    surahNameArabic: 'المؤمنون',
    ayahs: [115, 116, 117, 118],
  },
  {
    surahNumber: 37,
    surahName: 'As-Saffat',
    surahNameArabic: 'الصافات',
    ayahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    surahNumber: 55,
    surahName: 'Ar-Rahman',
    surahNameArabic: 'الرحمن',
    ayahs: [33, 34, 35, 36, 37, 38, 39, 40],
  },
  {
    surahNumber: 59,
    surahName: 'Al-Hashr',
    surahNameArabic: 'الحشر',
    ayahs: [21, 22, 23, 24],
  },
  {
    surahNumber: 72,
    surahName: 'Al-Jinn',
    surahNameArabic: 'الجن',
    ayahs: [1, 2, 3, 4],
  },
  {
    surahNumber: 109,
    surahName: 'Al-Kafirun',
    surahNameArabic: 'الكافرون',
    ayahs: [1, 2, 3, 4, 5, 6],
  },
  {
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    surahNameArabic: 'الإخلاص',
    ayahs: [1, 2, 3, 4],
  },
  {
    surahNumber: 113,
    surahName: 'Al-Falaq',
    surahNameArabic: 'الفلق',
    ayahs: [1, 2, 3, 4, 5],
  },
  {
    surahNumber: 114,
    surahName: 'An-Nas',
    surahNameArabic: 'الناس',
    ayahs: [1, 2, 3, 4, 5, 6],
  },
];

async function getVerseText(
  surah: number,
  ayah: number,
  edition: string,
): Promise<string> {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition}`,
    );
    const raw = await response.text();
    try {
      const payload = JSON.parse(raw) as {
        code?: number;
        status?: string;
        data?: { text?: string };
      };
      if (payload.code === 200 && payload.data?.text) {
        return payload.data.text;
      }
    } catch {
      // ignore parse errors and retry
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 300));
  }
  throw new Error(`Failed to fetch ${surah}:${ayah} (${edition})`);
}

async function run() {
  const verses: Array<Record<string, unknown>> = [];
  const sections: Array<Record<string, unknown>> = [];
  let runningIndex = 0;

  for (const segment of MANZIL_SEGMENTS) {
    sections.push({
      surahNumber: segment.surahNumber,
      surahName: segment.surahName,
      surahNameArabic: segment.surahNameArabic,
      startIndex: runningIndex,
    });

    for (const ayah of segment.ayahs) {
      const [arabic, english, urdu] = await Promise.all([
        getVerseText(segment.surahNumber, ayah, 'quran-uthmani'),
        getVerseText(segment.surahNumber, ayah, 'en.sahih'),
        getVerseText(segment.surahNumber, ayah, 'ur.jalandhry'),
      ]);

      verses.push({
        id: verses.length + 1,
        surahNumber: segment.surahNumber,
        surahName: segment.surahName,
        surahNameArabic: segment.surahNameArabic,
        ayah,
        arabic,
        urdu,
        english,
      });
      runningIndex += 1;
    }
  }

  const totalChars = verses.reduce(
    (sum, verse) => sum + String(verse.arabic).length,
    0,
  );
  let startTime = 0;
  const withTimings = verses.map((verse) => {
    const ratio = String(verse.arabic).length / totalChars;
    const duration = Math.max(
      2,
      Math.round(ESTIMATED_TOTAL_DURATION_SECONDS * ratio),
    );
    const endTime = startTime + duration;
    const next = { ...verse, startTime, endTime };
    startTime = endTime;
    return next;
  });

  const output = {
    source: DATA_SOURCE_NOTE,
    totalDuration: startTime,
    sections,
    verses: withTimings,
  };

  const filePath = join(process.cwd(), 'assets', 'data', 'manzil.json');
  writeFileSync(filePath, JSON.stringify(output, null, 2));
  console.log(`Generated ${withTimings.length} verses at ${filePath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
