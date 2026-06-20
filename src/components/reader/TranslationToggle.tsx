import { Pressable, StyleSheet, Text } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';
import type { TranslationMode } from '../../types/settings';

const ORDER: TranslationMode[] = ['arabic', 'arabic_urdu', 'arabic_english'];

const LABELS: Record<TranslationMode, string> = {
  arabic: 'Arabic',
  arabic_urdu: 'Urdu',
  arabic_english: 'English',
};

export function TranslationToggle() {
  const { settings, setTranslationMode } = useSettings();
  const theme = THEMES[settings.theme];

  const cycle = () => {
    const index = ORDER.indexOf(settings.translationMode);
    const next = ORDER[(index + 1) % ORDER.length];
    setTranslationMode(next);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Translation mode: ${LABELS[settings.translationMode]}`}
      onPress={cycle}
      style={[styles.button, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.accent }]}>{LABELS[settings.translationMode]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
