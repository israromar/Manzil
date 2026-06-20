import { View, StyleSheet } from 'react-native';

import { ReadingFormatPicker } from '../src/components/reader/ReadingFormatPicker';

export default function ReadingFormatScreen() {
  return (
    <View style={styles.root}>
      <ReadingFormatPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
