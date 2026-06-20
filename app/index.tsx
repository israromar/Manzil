import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { THEMES } from '../src/constants/themes';
import { useProgressContext } from '../src/context/ProgressContext';
import { useSettings } from '../src/hooks/useSettings';

export default function SplashScreen() {
  const router = useRouter();
  const { settings, ready } = useSettings();
  const { ready: progressReady } = useProgressContext();
  const theme = THEMES[settings.theme];

  useEffect(() => {
    if (ready && progressReady) {
      const timeout = setTimeout(() => router.replace('/home'), 400);
      return () => clearTimeout(timeout);
    }
  }, [progressReady, ready, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>منزل</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>Manzil</Text>
      <ActivityIndicator color={theme.accent} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 52, fontWeight: '700' },
  subtitle: { marginTop: 8, fontSize: 22 },
  loader: { marginTop: 24 },
});
