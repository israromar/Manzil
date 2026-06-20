import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AudioProvider } from './AudioContext';
import { ProgressProvider } from './ProgressContext';
import { SettingsProvider } from './SettingsContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ProgressProvider>
          <AudioProvider>{children}</AudioProvider>
        </ProgressProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
