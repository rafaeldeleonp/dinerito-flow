import { StyleSheet, View, Text } from 'react-native';

import { api } from '@/services/api';
import { useEffect, useState } from 'react';

interface HelloResponse {
  message: string;
}

export default function HomeScreen() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the server when component mounts
    const fetchData = async () => {
      try {
        const response = await api.get<HelloResponse>('/');
        setMessage(response.message);
      } catch (err) {
        setError('Failed to connect to server. Make sure it is running.');
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Welcome to Dinerito Flow! {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
