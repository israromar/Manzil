import { StyleSheet, Text, View } from 'react-native';

import { THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface SettingRowProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  last?: boolean;
}

export function SettingRow({ label, hint, children, last }: SettingRowProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.labelWrap}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {hint ? (
          <Text style={[styles.hint, { color: theme.subtext }]}>{hint}</Text>
        ) : null}
      </View>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  labelWrap: {
    gap: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
  control: {
    gap: 10,
  },
});
