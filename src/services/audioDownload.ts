import * as FileSystem from 'expo-file-system/legacy';

import { MANZIL_AUDIO_URL, OFFLINE_AUDIO_FILE_NAME } from '../constants/audio';

export function getOfflineAudioUri(): string {
  return `${FileSystem.documentDirectory}${OFFLINE_AUDIO_FILE_NAME}`;
}

export async function getOfflineAudioInfo() {
  return FileSystem.getInfoAsync(getOfflineAudioUri());
}

export async function deleteOfflineAudio(): Promise<void> {
  const info = await getOfflineAudioInfo();
  if (info.exists) {
    await FileSystem.deleteAsync(getOfflineAudioUri(), { idempotent: true });
  }
}

export async function downloadOfflineAudio(
  onProgress: (progress: number) => void,
  sourceUrl: string = MANZIL_AUDIO_URL
): Promise<string> {
  const task = FileSystem.createDownloadResumable(sourceUrl, getOfflineAudioUri(), {}, ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
    if (totalBytesExpectedToWrite <= 0) return;
    onProgress(totalBytesWritten / totalBytesExpectedToWrite);
  });
  const result = await task.downloadAsync();
  return result?.uri ?? getOfflineAudioUri();
}
