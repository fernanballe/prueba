import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';

const STAMP_SLOTS = Array.from({ length: 12 }, (_, i) => i);

function PassportStampSlot({ index }: { index: number }) {
  const isEmpty = index > 1; // Solo los 2 primeros tienen ejemplos

  const EXAMPLE_STAMPS = [
    { emoji: '🇪🇸', label: 'España', type: 'Cultural', color: '#c9a84c' },
    { emoji: '🌍', label: 'Exp. África', type: 'Expedición', color: '#9C27B0' },
  ];

  const stamp = !isEmpty ? EXAMPLE_STAMPS[index] : null;

  if (!stamp) {
    return (
      <View className="w-24 h-28 border-2 border-dashed border-stamp/40 rounded-lg items-center justify-center bg-paper-dark/30">
        <Text className="text-stamp/40 text-xs font-mono text-center">sin{'\n'}sello</Text>
      </View>
    );
  }

  return (
    <View
      className="w-24 h-28 rounded-lg items-center justify-center border"
      style={{ borderColor: stamp.color, backgroundColor: `${stamp.color}15` }}
    >
      <Text className="text-3xl mb-1">{stamp.emoji}</Text>
      <Text className="font-body-bold text-ink text-xs text-center px-1">{stamp.label}</Text>
      <Text className="font-body text-stamp text-xs">{stamp.type}</Text>
    </View>
  );
}

export default function PassportScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Portada del pasaporte */}
        <View className="mx-5 mt-5 bg-gold rounded-2xl p-6 shadow-sm">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-body text-paper/80 text-xs uppercase tracking-widest">
                WorldDex
              </Text>
              <Text className="font-display text-paper text-2xl mt-1">Pasaporte</Text>
              <Text className="font-display-italic text-paper text-2xl">Vivo</Text>
            </View>
            <Text className="text-4xl">🌐</Text>
          </View>

          <View className="mt-4 border-t border-paper/30 pt-4">
            <Text className="font-body text-paper/70 text-xs">Titular</Text>
            <Text className="font-body-bold text-paper text-lg">
              {user?.email?.split('@')[0] ?? 'Explorador'}
            </Text>
          </View>

          <View className="flex-row mt-3 gap-6">
            <View>
              <Text className="font-body text-paper/70 text-xs">Países</Text>
              <Text className="font-body-bold text-paper text-base">0 / 195</Text>
            </View>
            <View>
              <Text className="font-body text-paper/70 text-xs">Sellos</Text>
              <Text className="font-body-bold text-paper text-base">2</Text>
            </View>
            <View>
              <Text className="font-body text-paper/70 text-xs">Liga</Text>
              <Text className="font-body-bold text-paper text-base">Bronce</Text>
            </View>
          </View>
        </View>

        {/* Sección de sellos */}
        <View className="px-5 mt-6">
          <Text className="font-body-bold text-ink text-sm uppercase tracking-widest mb-4">
            Sellos del Pasaporte
          </Text>

          {/* Grid de sellos */}
          <View className="flex-row flex-wrap gap-3">
            {STAMP_SLOTS.map((i) => (
              <PassportStampSlot key={i} index={i} />
            ))}
          </View>
        </View>

        {/* Info */}
        <View className="mx-5 mt-6 mb-8 bg-paper-dark rounded-xl p-4">
          <Text className="font-body-medium text-ink text-sm">
            💡 Consigue sellos completando países con trivia, juegos de idioma, y visitando físicamente con GPS.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
