import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';

import { ScreenBackground } from '../src/components/ui/ScreenBackground';
import { AppProviders } from '../src/context/AppProviders';
import { IMAGES } from '../src/constants/images';
import { THEMES } from '../src/constants/themes';
import { useSettings } from '../src/hooks/useSettings';

ExpoSplashScreen.preventAutoHideAsync().catch(() => undefined);

function LayoutBody() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  useEffect(() => {
    I18nManager.allowRTL(true);
  }, []);

  return (
    <>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <ScreenBackground source={IMAGES.appBackground} />
        <Stack
          screenOptions={{
            animation: 'fade',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.accent,
            headerTitleStyle: { color: theme.text, fontWeight: '600' },
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="home"
            options={{ title: 'Manzil', headerShown: false }}
          />
          <Stack.Screen name="reader" options={{ title: 'Read Manzil' }} />
          <Stack.Screen name="player" options={{ title: 'Listen to Manzil' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen
            name="reading-format"
            options={{ title: 'Reading format' }}
          />
        </Stack>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default function RootLayout() {
  return (
    <AppProviders>
      <LayoutBody />
    </AppProviders>
  );
}
