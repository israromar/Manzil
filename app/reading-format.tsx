import { View, StyleSheet } from 'react-native';

import { ReadingFormatPicker } from '../src/components/reader/ReadingFormatPicker';
import { ScreenBackground } from '../src/components/ui/ScreenBackground';
import { IMAGES } from '../src/constants/images';
import { THEMES } from '../src/constants/themes';
import { useSettings } from '../src/hooks/useSettings';

export default function ReadingFormatScreen() {
  const { settings } = useSettings();
  const theme = THEMES[settings.theme];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScreenBackground source={IMAGES.settingsBg} opacity={0.15} />
      <ReadingFormatPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
