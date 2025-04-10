import { StyleSheet, Text, View } from 'react-native';

export default function MoneyLogo() {
  return (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>$</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 300,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#78B16D',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#547C4C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 25,
  },
  iconText: {
    fontSize: 60,
    fontWeight: 700,
    color: '#fff',
  },
});
