import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenBackground } from '../src/components/ui/ScreenBackground';
import { SegmentedControl } from '../src/components/ui/SegmentedControl';
import { IMAGES } from '../src/constants/images';
import { THEMES } from '../src/constants/themes';
import { useSettings } from '../src/hooks/useSettings';
import type { FontSizeMode, LineHeightMode, ThemeMode, TranslationMode } from '../src/types/settings';

function SettingRow<T extends string>({
  title,
  value,
  options,
  onChange,
  formatLabel,
}: {
  title: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
}) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{title}</Text>
      <SegmentedControl options={options} value={value} onChange={onChange} formatLabel={formatLabel} />
    </View>
  );
}

const THEME_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  sepia: 'Sepia',
};

const FONT_LABELS: Record<FontSizeMode, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
  xl: 'XL',
};

const LINE_LABELS: Record<LineHeightMode, string> = {
  compact: 'Compact',
  comfortable: 'Comfortable',
  spacious: 'Spacious',
};

const TRANSLATION_LABELS: Record<TranslationMode, string> = {
  arabic: 'Arabic',
  arabic_urdu: 'Urdu',
  arabic_english: 'English',
};

export default function SettingsScreen() {
  const { settings, setAutoScroll, setFontSize, setLineHeight, setTheme, setTranslationMode } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScreenBackground source={IMAGES.settingsBg} opacity={0.2} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingRow<ThemeMode>
        title="Theme"
        value={settings.theme}
        options={['light', 'dark', 'sepia']}
        onChange={setTheme}
        formatLabel={(value) => THEME_LABELS[value]}
      />
      <SettingRow<FontSizeMode>
        title="Font size"
        value={settings.fontSize}
        options={['small', 'medium', 'large', 'xl']}
        onChange={setFontSize}
        formatLabel={(value) => FONT_LABELS[value]}
      />
      <SettingRow<LineHeightMode>
        title="Line height"
        value={settings.lineHeight}
        options={['compact', 'comfortable', 'spacious']}
        onChange={setLineHeight}
        formatLabel={(value) => LINE_LABELS[value]}
      />
      <SettingRow<TranslationMode>
        title="Translation"
        value={settings.translationMode}
        options={['arabic', 'arabic_urdu', 'arabic_english']}
        onChange={setTranslationMode}
        formatLabel={(value) => TRANSLATION_LABELS[value]}
      />
      <Pressable
        accessibilityRole="button"
        style={[styles.autoScroll, { borderColor: theme.border, backgroundColor: theme.surface }]}
        onPress={() => setAutoScroll(!settings.autoScroll)}>
        <Text style={{ color: theme.text, fontWeight: '500' }}>Auto-scroll while listening</Text>
        <Text style={{ color: theme.accent, fontWeight: '700' }}>{settings.autoScroll ? 'On' : 'Off'}</Text>
      </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  row: { marginBottom: 22 },
  rowLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  autoScroll: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
