import { StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: '#547c4c',
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
