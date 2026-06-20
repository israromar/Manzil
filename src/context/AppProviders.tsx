import type { PropsWithChildren } from 'react';

import { AudioProvider } from './AudioContext';
import { ProgressProvider } from './ProgressContext';
import { SettingsProvider } from './SettingsContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <AudioProvider>{children}</AudioProvider>
      </ProgressProvider>
    </SettingsProvider>
  );
}
