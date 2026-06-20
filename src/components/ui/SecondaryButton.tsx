import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface SecondaryButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryButton({
  label,
  style,
  disabled,
  ...props
}: SecondaryButtonProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: theme.borderGlass,
          backgroundColor: theme.surfaceGlass,
          shadowColor: theme.shadow,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.button,
    borderWidth: 1,
    paddingVertical: 17,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
