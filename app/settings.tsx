import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SegmentedControl } from '../src/components/ui/SegmentedControl';
import { SettingGroup } from '../src/components/ui/SettingGroup';
import { SettingRow } from '../src/components/ui/SettingRow';
import { ThemeSwatchPicker } from '../src/components/ui/ThemeSwatchPicker';
import { getFormatById } from '../src/constants/readingFormats';
import { THEMES } from '../src/constants/themes';
import { useSettings } from '../src/hooks/useSettings';
import type { FontSizeMode, LineHeightMode } from '../src/types/settings';

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

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, setAutoScroll, setFontSize, setLineHeight, setTheme } = useSettings();
  const theme = THEMES[settings.theme];
  const readingFormat = getFormatById(settings.readingFormatId);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={[styles.introTitle, { color: theme.text }]}>Make Manzil yours</Text>
          <Text style={[styles.introSubtitle, { color: theme.subtext }]}>
            Tune reading layout, appearance, and listening behavior
          </Text>
        </View>

        <SettingGroup title="Reading">
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
            onPress={() => router.push('/reading-format')}>
            <View style={[styles.linkIcon, { backgroundColor: theme.accentSoft }]}>
              <Text style={[styles.linkGlyph, { color: theme.accent }]}>۞</Text>
            </View>
            <View style={styles.linkCopy}>
              <Text style={[styles.linkTitle, { color: theme.text }]}>Reading format</Text>
              <Text style={[styles.linkSubtitle, { color: theme.subtext }]}>
                {readingFormat?.title ?? 'Mushaf page'}
              </Text>
            </View>
            <Text style={[styles.linkChevron, { color: theme.accentMuted }]}>›</Text>
          </Pressable>
        </SettingGroup>

        <SettingGroup title="Appearance">
          <SettingRow label="Theme" hint="Choose a reading atmosphere" last={false}>
            <ThemeSwatchPicker value={settings.theme} onChange={setTheme} />
          </SettingRow>
          <SettingRow label="Font size" last={false}>
            <SegmentedControl
              options={['small', 'medium', 'large', 'xl'] as const}
              value={settings.fontSize}
              onChange={setFontSize}
              formatLabel={(value) => FONT_LABELS[value]}
            />
          </SettingRow>
          <SettingRow label="Line height" last>
            <SegmentedControl
              options={['compact', 'comfortable', 'spacious'] as const}
              value={settings.lineHeight}
              onChange={setLineHeight}
              formatLabel={(value) => LINE_LABELS[value]}
            />
          </SettingRow>
        </SettingGroup>

        <SettingGroup title="Listening">
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={[styles.toggleTitle, { color: theme.text }]}>Auto-scroll while listening</Text>
              <Text style={[styles.toggleSubtitle, { color: theme.subtext }]}>
                Follow the recitation in the reader automatically
              </Text>
            </View>
            <Switch
              value={settings.autoScroll}
              onValueChange={setAutoScroll}
              trackColor={{ false: theme.border, true: theme.accentMuted }}
              thumbColor={settings.autoScroll ? theme.accent : theme.surface}
              ios_backgroundColor={theme.border}
            />
          </View>
        </SettingGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  intro: {
    marginBottom: 24,
    gap: 6,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  introSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    maxWidth: 320,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkGlyph: {
    fontSize: 20,
    fontWeight: '700',
  },
  linkCopy: {
    flex: 1,
    gap: 3,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  linkChevron: {
    fontSize: 28,
    fontWeight: '300',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  toggleCopy: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.88,
  },
});
