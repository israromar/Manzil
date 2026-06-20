export interface ManzilVerseTiming {
  id: number;
  verseKey: string;
  surahNumber: number;
  ayah: number;
  startMs: number;
  endMs: number;
}

export interface ManzilBismillahTiming {
  startMs: number;
  endMs: number;
}

export interface ManzilTimings {
  source: string;
  audioDurationMs: number;
  rawDurationMs: number;
  scale: number;
  bismillahDurationMs: number;
  taawwudhDurationMs?: number;
  generatedAt: string;
  taawwudhWindows?: ManzilBismillahTiming[];
  bismillahWindows: ManzilBismillahTiming[];
  verses: ManzilVerseTiming[];
}
