import { Pressable, StyleSheet, Text, View } from 'react-native';

import { THEMES } from '../src/constants/themes';
import { useSettings } from '../src/hooks/useSettings';
import type { FontSizeMode, LineHeightMode, ThemeMode, TranslationMode } from '../src/types/settings';

function ToggleRow<T extends string>({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.rowLabel}>{title}</Text>
      <View style={styles.rowWrap}>
        {options.map((item) => (
          <Pressable key={item} style={[styles.pill, value === item && styles.pillActive]} onPress={() => onChange(item)}>
            <Text style={value === item ? styles.pillTextActive : styles.pillText}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, setAutoScroll, setFontSize, setLineHeight, setTheme, setTranslationMode } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ToggleRow<ThemeMode> title="Theme" value={settings.theme} options={['light', 'dark', 'sepia']} onChange={setTheme} />
      <ToggleRow<FontSizeMode> title="Font size" value={settings.fontSize} options={['small', 'medium', 'large', 'xl']} onChange={setFontSize} />
      <ToggleRow<LineHeightMode>
        title="Line height"
        value={settings.lineHeight}
        options={['compact', 'comfortable', 'spacious']}
        onChange={setLineHeight}
      />
      <ToggleRow<TranslationMode>
        title="Translation"
        value={settings.translationMode}
        options={['arabic', 'arabic_urdu', 'arabic_english']}
        onChange={setTranslationMode}
      />
      <Pressable style={[styles.autoScroll, { borderColor: theme.border, backgroundColor: theme.card }]} onPress={() => setAutoScroll(!settings.autoScroll)}>
        <Text style={{ color: theme.text }}>Auto-scroll</Text>
        <Text style={{ color: theme.accent, fontWeight: '700' }}>{settings.autoScroll ? 'On' : 'Off'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  rowLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#CCC' },
  pillActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  pillText: { color: '#222' },
  pillTextActive: { color: '#FFF' },
  autoScroll: { marginTop: 8, borderWidth: 1, borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between' },
});
