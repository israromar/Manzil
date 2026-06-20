import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface PrimaryButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, style, disabled, ...props }: PrimaryButtonProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.accent, opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
        style,
      ]}
      {...props}>
      <Text style={[styles.label, { color: theme.accentOn }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.button,
    paddingVertical: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
});
