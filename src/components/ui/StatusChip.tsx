import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface StatusChipProps {
  label: string;
}

export function StatusChip({ label }: StatusChipProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={[styles.chip, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.accent }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
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
