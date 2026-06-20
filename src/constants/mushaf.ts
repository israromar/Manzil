export const TAAWWUDH_ARABIC = 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ';

export const TAAWWUDH_ENGLISH =
  'I seek refuge in Allah from Satan, the accursed.';

export const TAAWWUDH_URDU = 'میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے۔';

export const BISMILLAH_ARABIC = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export const BISMILLAH_ENGLISH =
  'In the Name of Allah—the Most Compassionate, Most Merciful';

export const BISMILLAH_URDU =
  'شروع الله کے نام سے جو بڑا مہربان نہایت رحم والا ہے';

const BISMILLAH_PREFIX = /^(\uFEFF)?بِسْمِ[\s\S]*?ٱلرَّحِيمِ\s*/u;

/** Surah At-Tawbah (9) has no Bismillah */
export function sectionShowsBismillah(surahNumber: number) {
  return surahNumber !== 9;
}

/** Opening Ta'awwudh before Al-Fatiha at the start of Manzil recitation. */
export function sectionShowsOpeningTaawwudh(
  surahNumber: number,
  sectionIndex: number,
) {
  return sectionIndex === 0 && surahNumber === 1;
}

export function stripLeadingBismillah(arabic: string) {
  return arabic.replace(BISMILLAH_PREFIX, '').trim();
}

/** True when the verse text is only Bismillah (e.g. Al-Fatiha ayah 1 in standard numbering). */
export function isBismillahOnlyVerse(arabic: string) {
  const normalized = arabic.replace(/^\uFEFF/, '').trim();
  if (!normalized) return false;
  return stripLeadingBismillah(normalized) === '';
}

export function toArabicNumerals(value: number) {
  const eastern = '٠١٢٣٤٥٦٧٨٩';
  return String(value)
    .split('')
    .map((digit) => eastern[Number(digit)] ?? digit)
    .join('');
}

export function mushafPageLabel(sectionIndex: number, totalSections: number) {
  return `${sectionIndex + 1} / ${totalSections}`;
}
