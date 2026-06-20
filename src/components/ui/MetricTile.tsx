import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface MetricTileProps {
  label: string;
  value: string;
  accent?: boolean;
}

export function MetricTile({ label, value, accent }: MetricTileProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: theme.surfaceGlass,
          borderColor: theme.borderGlass,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.subtext }]}>{label}</Text>
      <Text
        style={[styles.value, { color: accent ? theme.accent : theme.text }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
