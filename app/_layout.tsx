import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager } from 'react-native';

import { AppProviders } from '../src/context/AppProviders';
import { THEMES } from '../src/constants/themes';
import { useSettings } from '../src/hooks/useSettings';

function LayoutBody() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  useEffect(() => {
    I18nManager.allowRTL(true);
  }, []);

  return (
    <>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          animation: 'fade',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.accent,
          headerTitleStyle: { color: theme.text, fontWeight: '600' },
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="home"
          options={{ title: 'Manzil', headerShown: false }}
        />
        <Stack.Screen name="reader" options={{ title: 'Read Manzil' }} />
        <Stack.Screen name="player" options={{ title: 'Listen to Manzil' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <LayoutBody />
    </AppProviders>
  );
}
