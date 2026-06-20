import { ImageBackground, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface HeroImageProps {
  source: ImageSourcePropType;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  height?: number;
}

export function HeroImage({ source, children, style, height = 220 }: HeroImageProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <ImageBackground
      source={source}
      accessibilityRole="image"
      style={[styles.wrap, { height, borderColor: theme.border }, style]}
      imageStyle={styles.image}>
      <View style={[styles.overlay, { backgroundColor: theme.background }]} />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.72,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
});
