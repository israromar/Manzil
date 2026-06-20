import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';
import type { ThemeMode } from '../../types/settings';

const THEME_OPTIONS: ThemeMode[] = ['light', 'dark', 'sepia'];

const THEME_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  sepia: 'Sepia',
};

export function ThemeSwatchPicker({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (value: ThemeMode) => void;
}) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={styles.row}>
      {THEME_OPTIONS.map((option) => {
        const swatch = THEMES[option];
        const active = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option)}
            style={[
              styles.swatch,
              {
                backgroundColor: swatch.background,
                borderColor: active ? theme.accent : theme.border,
              },
              active && styles.swatchActive,
            ]}
          >
            <View
              style={[styles.swatchInner, { backgroundColor: swatch.accent }]}
            />
            <Text
              style={[
                styles.label,
                { color: active ? theme.text : theme.subtext },
              ]}
            >
              {THEME_LABELS[option]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  swatch: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    gap: 8,
  },
  swatchActive: {
    transform: [{ scale: 1.02 }],
  },
  swatchInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
