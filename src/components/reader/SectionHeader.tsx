import { StyleSheet, Text, View } from 'react-native';

import { THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';
import type { ManzilSection } from '../../types/manzil';

interface SectionHeaderProps {
  section: ManzilSection;
}

export function SectionHeader({ section }: SectionHeaderProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <Text style={[styles.arabic, { color: theme.accent }]}>{section.surahNameArabic}</Text>
      <Text style={[styles.english, { color: theme.text }]}>{section.surahName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  arabic: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  english: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },
});
