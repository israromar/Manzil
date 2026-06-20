import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AyahMarkerText } from './AyahMarkerText';
import {
  READING_FORMATS,
  type ReadingFormatDefinition,
} from '../../constants/readingFormats';
import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface ReadingFormatPickerProps {
  onClose?: () => void;
}

function FormatCard({
  format,
  selected,
  onSelect,
}: {
  format: ReadingFormatDefinition;
  selected: boolean;
  onSelect: (format: ReadingFormatDefinition) => void;
}) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const isMushaf = format.previewStyle === 'mushaf';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onSelect(format)}
      style={[
        styles.card,
        {
          borderColor: selected ? theme.accent : theme.border,
          backgroundColor: selected ? theme.highlight : theme.surface,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {format.title}
        </Text>
        {format.badge ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.accentSoft, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.accent }]}>
              {format.badge}
            </Text>
          </View>
        ) : null}
      </View>
      {format.titleArabic ? (
        <Text style={[styles.cardArabic, { color: theme.subtext }]}>
          {format.titleArabic}
        </Text>
      ) : null}
      <Text style={[styles.cardDescription, { color: theme.subtext }]}>
        {format.description}
      </Text>

      <View
        style={[
          styles.preview,
          {
            borderColor: theme.border,
            backgroundColor: isMushaf
              ? settings.theme === 'dark'
                ? '#0C0C0C'
                : theme.background
              : theme.background,
          },
        ]}
      >
        {isMushaf && format.previewTranslation ? (
          <>
            <Text style={[styles.previewBismillah, { color: theme.text }]}>
              بِسْمِ ٱللَّهِ
            </Text>
            <Text
              style={[
                styles.previewTranslation,
                { color: theme.subtext, textAlign: 'center' },
              ]}
            >
              {format.previewTranslation}
            </Text>
          </>
        ) : null}
        {format.previewArabic ? (
          <Text
            style={[
              styles.previewFlow,
              { color: theme.text, marginTop: isMushaf ? 12 : 0 },
            ]}
          >
            {isMushaf ? (
              <>
                {format.previewArabic.replace(/\s*[٠-٩0-9]+\s*$/, '')}
                <AyahMarkerText ayah={1} theme={theme} arabicSize={17} />
              </>
            ) : (
              format.previewArabic
            )}
          </Text>
        ) : null}
        {!isMushaf && format.previewTranslation ? (
          <Text style={[styles.previewTranslation, { color: theme.subtext }]}>
            {format.previewTranslation}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function ReadingFormatPicker({ onClose }: ReadingFormatPickerProps) {
  const { settings, setReadingFormat } = useSettings();
  const theme = THEMES[settings.theme];

  const onSelect = (format: ReadingFormatDefinition) => {
    setReadingFormat(format.id);
    onClose?.();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.text }]}>
        Reading format
      </Text>
      <Text style={[styles.subheading, { color: theme.subtext }]}>
        Choose how Manzil is displayed while you read.
      </Text>

      {READING_FORMATS.map((format) => (
        <FormatCard
          key={format.id}
          format={format}
          selected={settings.readingFormatId === format.id}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '700' },
  subheading: { marginTop: 6, marginBottom: 16, fontSize: 14, lineHeight: 20 },
  card: {
    borderWidth: 1,
    borderRadius: RADIUS.card,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  cardArabic: {
    marginTop: 2,
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  cardDescription: { marginTop: 6, fontSize: 13, lineHeight: 18 },
  badge: {
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  preview: { marginTop: 10, borderWidth: 1, borderRadius: 10, padding: 12 },
  previewBismillah: {
    fontSize: 20,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  previewFlow: {
    fontSize: 17,
    lineHeight: 28,
    width: '100%',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  previewTranslation: { marginTop: 4, fontSize: 12, lineHeight: 17 },
});
