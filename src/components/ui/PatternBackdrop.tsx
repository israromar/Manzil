import { StyleSheet, View } from 'react-native';

import { THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

export function PatternBackdrop() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={[styles.ring, { borderColor: theme.accent, opacity: 0.08 }]} />
      <View style={[styles.ringInner, { borderColor: theme.accent, opacity: 0.06 }]} />
      <View style={[styles.dot, { backgroundColor: theme.accent, opacity: 0.05 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
  },
  ringInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  dot: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});
