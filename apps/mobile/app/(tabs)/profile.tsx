import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { signOut } from '@/services/auth';
import { useRouter } from 'expo-router';

const STATS = [
  { label: 'Países completados', value: '0', emoji: '🌍' },
  { label: 'Coleccionables', value: '0', emoji: '🃏' },
  { label: 'XP total', value: '0', emoji: '⭐' },
  { label: 'Racha actual', value: '0 días', emoji: '🔥' },
];

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  async function handleSignOut() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  }

  const displayName = user?.email?.split('@')[0] ?? 'Explorador';

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="px-5 pt-4 pb-3 border-b border-paper-dark">
        <Text className="font-display text-3xl text-ink">Perfil</Text>
      </View>

      {/* Avatar y nombre */}
      <View className="items-center py-8">
        <View className="w-24 h-24 bg-gold/20 border-2 border-gold rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">🌍</Text>
        </View>
        <Text className="font-display text-ink text-2xl">{displayName}</Text>
        <Text className="font-body text-stamp text-sm mt-1">{user?.email ?? ''}</Text>
        <View className="flex-row items-center gap-2 mt-2">
          <Text className="text-lg">🥉</Text>
          <Text className="font-body-medium text-ink text-sm">Liga Bronce</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="mx-5">
        <View className="flex-row flex-wrap gap-3">
          {STATS.map((stat) => (
            <View
              key={stat.label}
              className="bg-white border border-paper-dark rounded-xl p-4 items-center"
              style={{ width: '46%' }}
            >
              <Text className="text-2xl mb-1">{stat.emoji}</Text>
              <Text className="font-display text-ink text-xl">{stat.value}</Text>
              <Text className="font-body text-stamp text-xs text-center">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Acciones */}
      <View className="mx-5 mt-6 gap-3">
        <TouchableOpacity className="bg-paper-dark border border-stamp/30 rounded-xl p-4 flex-row items-center">
          <Text className="text-xl mr-3">⚙️</Text>
          <Text className="font-body-medium text-ink flex-1">Ajustes</Text>
          <Text className="text-stamp">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-paper-dark border border-stamp/30 rounded-xl p-4 flex-row items-center">
          <Text className="text-xl mr-3">📤</Text>
          <Text className="font-body-medium text-ink flex-1">Compartir pasaporte</Text>
          <Text className="text-stamp">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center"
        >
          <Text className="text-xl mr-3">🚪</Text>
          <Text className="font-body-medium text-red-600 flex-1">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
