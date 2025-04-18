import { StyleSheet, Text, View } from 'react-native';

import { PRIMARY_COLOR } from '@/constants/Colors';

export default function RoundedLogo() {
  return (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>$</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 9999,
    marginBottom: 50,
    padding: 0,
  },
  iconText: {
    fontSize: 125,
    fontWeight: 600,
    color: '#fff',
  },
});
