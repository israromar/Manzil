import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AUDIO_DOCK_BODY_HEIGHT, AUDIO_DOCK_MIN_BOTTOM_INSET } from '../constants/audioDock';

/** Total vertical space reserved for the reader audio dock (card + safe area). */
export function useAudioDockInset() {
  const insets = useSafeAreaInsets();
  return AUDIO_DOCK_BODY_HEIGHT + Math.max(insets.bottom, AUDIO_DOCK_MIN_BOTTOM_INSET);
}

/** Bottom safe-area padding applied inside the dock itself. */
export function useAudioDockSafeBottom() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, AUDIO_DOCK_MIN_BOTTOM_INSET);
}
