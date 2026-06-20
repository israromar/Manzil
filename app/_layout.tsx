import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '../src/context/AppProviders';
import { useSettings } from '../src/hooks/useSettings';

function LayoutBody() {
  const { settings } = useSettings();
  return (
    <>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ animation: 'fade', headerBackTitle: 'Back' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Manzil', headerShown: false }} />
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
