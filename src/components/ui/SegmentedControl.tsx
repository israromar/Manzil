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
    <View
      style={[
        styles.track,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
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
              active && {
                backgroundColor: theme.accent,
                shadowColor: theme.accentMuted,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
          >
            <Text
              style={{
                color: active ? theme.accentOn : theme.subtext,
                fontWeight: active ? '700' : '500',
                fontSize: 13,
              }}
            >
              {formatLabel(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    padding: 4,
  },
  pill: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 52,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
