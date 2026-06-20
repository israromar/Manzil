import { Pressable, StyleSheet, Text } from 'react-native';

import { getFormatById } from '../../constants/readingFormats';
import { RADIUS, THEMES } from '../../constants/themes';
import { useSettings } from '../../hooks/useSettings';

interface ReadingFormatButtonProps {
  onPress: () => void;
}

export function ReadingFormatButton({ onPress }: ReadingFormatButtonProps) {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];
  const format = getFormatById(settings.readingFormatId);
  const label = format?.title ?? 'Format';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Reading format: ${label}`}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.accent }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    maxWidth: 148,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: { fontSize: 12, fontWeight: '600' },
});
