import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SettingGroup({ title, children }: SettingGroupProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={styles.group}>
      <Text style={[styles.title, { color: theme.subtext }]}>{title}</Text>
      <View
        style={[
          styles.panel,
          {
            backgroundColor: theme.surfaceGlass,
            borderColor: theme.borderGlass,
            shadowColor: theme.shadow,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 24,
    gap: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  panel: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
});
