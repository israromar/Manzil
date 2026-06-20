import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';

import { IMAGES } from '../src/constants/images';
import { THEMES } from '../src/constants/themes';
import { useProgressContext } from '../src/context/ProgressContext';
import { useSettings } from '../src/hooks/useSettings';

export default function SplashScreen() {
  const router = useRouter();
  const { settings, ready } = useSettings();
  const { ready: progressReady } = useProgressContext();
  const theme = THEMES[settings.theme];

  const revealSplash = useCallback(() => {
    ExpoSplashScreen.hideAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!ready || !progressReady) return;
    const timeout = setTimeout(() => router.replace('/home'), 1600);
    return () => clearTimeout(timeout);
  }, [progressReady, ready, router]);

  return (
    <ImageBackground
      source={IMAGES.splashBg}
      style={styles.container}
      imageStyle={styles.image}
      onLoadEnd={revealSplash}
      accessibilityRole="image">
      <View style={[styles.overlay, { backgroundColor: theme.background }]} />
      <Image source={IMAGES.icon} style={styles.logo} accessibilityLabel="Manzil app icon" />
      <Text style={[styles.title, { color: theme.accent }]}>منزل</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Manzil</Text>
      <ActivityIndicator color={theme.accent} style={styles.loader} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFill, opacity: 0.28 },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 28,
    marginBottom: 22,
  },
  title: { fontSize: 48, fontWeight: '700' },
  subtitle: { marginTop: 6, fontSize: 20, fontWeight: '500', letterSpacing: 1 },
  loader: { marginTop: 28 },
});
