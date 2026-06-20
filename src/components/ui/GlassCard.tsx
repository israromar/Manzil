import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accentEdge?: boolean;
}

export function GlassCard({ children, style, accentEdge }: GlassCardProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surfaceGlass,
          borderColor: theme.borderGlass,
          shadowColor: theme.shadow,
        },
        accentEdge && { borderLeftColor: theme.accent, borderLeftWidth: 3 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },
});
