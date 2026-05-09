import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 bg-paper items-center justify-center gap-4">
      <Text className="text-4xl">🌍</Text>
      <ActivityIndicator size="large" color="#c9a84c" />
      <Text className="font-body text-stamp text-sm">{message}</Text>
    </View>
  );
}
