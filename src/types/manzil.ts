export interface ManzilVerse {
  id: number;
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayah: number;
  arabic: string;
  urdu: string;
  english: string;
  startTime: number;
  endTime: number;
}

export interface ManzilSection {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  startIndex: number;
}

export interface ManzilData {
  totalDuration: number;
  sections: ManzilSection[];
  verses: ManzilVerse[];
}
