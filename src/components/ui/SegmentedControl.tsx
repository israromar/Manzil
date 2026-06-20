import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  formatLabel = (item) => item,
}: SegmentedControlProps<T>) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option)}
            style={[
              styles.pill,
              {
                borderColor: active ? theme.accent : theme.border,
                backgroundColor: active ? theme.accent : theme.surface,
              },
            ]}>
            <Text style={{ color: active ? theme.accentOn : theme.text, fontWeight: active ? '600' : '400' }}>
              {formatLabel(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
