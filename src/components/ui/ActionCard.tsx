import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface ActionCardProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  subtitle: string;
  glyph: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

export function ActionCard({
  title,
  subtitle,
  glyph,
  variant = 'secondary',
  style,
  ...props
}: ActionCardProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        isPrimary
          ? {
              backgroundColor: theme.accent,
              borderColor: theme.accent,
              shadowColor: theme.accentMuted,
            }
          : {
              backgroundColor: theme.surfaceGlass,
              borderColor: theme.borderGlass,
              shadowColor: theme.shadow,
            },
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.iconWrap,
          isPrimary
            ? { backgroundColor: 'rgba(0, 0, 0, 0.14)' }
            : {
                backgroundColor: theme.accentSoft,
                borderColor: theme.borderGlass,
              },
        ]}
      >
        <Text
          style={[
            styles.glyph,
            { color: isPrimary ? theme.accentOn : theme.accent },
          ]}
        >
          {glyph}
        </Text>
      </View>
      <View style={styles.copy}>
        <Text
          style={[
            styles.title,
            { color: isPrimary ? theme.accentOn : theme.text },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isPrimary ? 'rgba(26, 18, 8, 0.72)' : theme.subtext },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <Text
        style={[
          styles.chevron,
          { color: isPrimary ? theme.accentOn : theme.accentMuted },
        ]}
      >
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.card,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 22,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
