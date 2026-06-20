import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { useSettings } from '../../hooks/useSettings';
import { THEMES } from '../../constants/themes';

interface ScreenBackgroundProps {
  source: ImageSourcePropType;
  opacity?: number;
  scrimOpacity?: number;
}

export function ScreenBackground({
  source,
  opacity = 0.22,
  scrimOpacity = 0.84,
}: ScreenBackgroundProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={source}
        style={[styles.image, { opacity }]}
        resizeMode="cover"
      />
      <View
        style={[
          styles.scrim,
          { backgroundColor: theme.background, opacity: scrimOpacity },
        ]}
      />
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
