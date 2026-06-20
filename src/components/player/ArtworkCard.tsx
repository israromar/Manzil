import { Image, StyleSheet, Text, View } from 'react-native';

import { IMAGES } from '../../constants/images';
import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

export function ArtworkCard() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={[styles.card, { borderColor: theme.border }]}>
      <Image source={IMAGES.playerArtwork} style={styles.image} resizeMode="cover" accessibilityLabel="Manzil recitation artwork" />
      <View style={[styles.labelWrap, { backgroundColor: theme.surface }]}>
        <Text style={[styles.arabic, { color: theme.accent }]}>منزل</Text>
        <Text style={[styles.label, { color: theme.subtext }]}>Manzil Recitation</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: '78%',
  },
  labelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabic: {
    fontSize: 28,
    fontWeight: '700',
  },
  label: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});
