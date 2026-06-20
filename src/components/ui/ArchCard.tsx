import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface ArchCardProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  subtitle: string;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ArchCard({ title, subtitle, actionLabel = 'Continue', style, ...props }: ArchCardProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.92 : 1,
        },
        style,
      ]}
      {...props}>
      <View style={[styles.arch, { backgroundColor: theme.accentSoft }]} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>{subtitle}</Text>
      <Text style={[styles.action, { color: theme.accent }]}>{actionLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: RADIUS.card,
    borderTopLeftRadius: RADIUS.arch,
    borderTopRightRadius: RADIUS.arch,
    padding: 20,
    overflow: 'hidden',
  },
  arch: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    width: 220,
    height: 100,
    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 110,
    opacity: 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  action: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
  },
});
