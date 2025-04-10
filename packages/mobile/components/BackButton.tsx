import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BackButtonProps = {
  onPress?: () => void;
};

export default function BackButton({ onPress }: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
      onPress={handlePress}
      accessibilityLabel="Go back"
    >
      <View style={styles.circle}>
        <Text style={styles.text}>X</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    height: 44,
    width: 60,
  },
  circle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: '#547C4C',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78B16D',
  },
});
