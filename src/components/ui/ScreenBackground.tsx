import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { useSettings } from '../../hooks/useSettings';
import { THEMES } from '../../constants/themes';

interface ScreenBackgroundProps {
  source: ImageSourcePropType;
  opacity?: number;
}

export function ScreenBackground({ source, opacity = 0.12 }: ScreenBackgroundProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image source={source} style={[styles.image, { opacity }]} resizeMode="cover" />
      <View style={[styles.scrim, { backgroundColor: theme.background, opacity: 0.88 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
  },
});
