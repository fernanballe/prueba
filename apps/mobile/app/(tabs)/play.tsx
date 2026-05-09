import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GameCardProps {
  emoji: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  onPress: () => void;
}

function GameCard({ emoji, title, description, tag, tagColor, onPress }: GameCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border border-paper-dark rounded-xl p-4 mb-3 flex-row items-center"
    >
      <View className="w-14 h-14 bg-paper rounded-lg items-center justify-center mr-4">
        <Text className="text-3xl">{emoji}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="font-body-bold text-ink text-base">{title}</Text>
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: `${tagColor}20` }}
          >
            <Text className="font-body text-xs" style={{ color: tagColor }}>{tag}</Text>
          </View>
        </View>
        <Text className="font-body text-stamp text-sm">{description}</Text>
      </View>
      <Text className="text-stamp text-lg ml-2">›</Text>
    </TouchableOpacity>
  );
}

export default function PlayScreen() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="px-5 pt-4 pb-3 border-b border-paper-dark">
        <Text className="font-display text-3xl text-ink">Jugar</Text>
        <Text className="font-body text-stamp text-sm mt-1">
          Elige tu mecánica de hoy
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Misión diaria */}
        <View className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xl">⭐</Text>
            <Text className="font-body-bold text-ink">Misión del día</Text>
          </View>
          <Text className="font-body text-ink/80 text-sm">
            Responde correctamente 5 preguntas de trivia
          </Text>
          <View className="mt-3 h-2 bg-paper-dark rounded-full overflow-hidden">
            <View className="h-full bg-gold rounded-full" style={{ width: '0%' }} />
          </View>
          <Text className="font-body text-stamp text-xs mt-1">0 / 5</Text>
        </View>

        {/* Juegos principales */}
        <Text className="font-body-bold text-ink text-sm uppercase tracking-widest mb-3">
          Mecánicas de juego
        </Text>

        <GameCard
          emoji="🧠"
          title="Trivia Cultural"
          description="Preguntas de historia, geografía y cultura"
          tag="Disponible"
          tagColor="#4CAF50"
          onPress={() => {}}
        />

        <GameCard
          emoji="🎲"
          title="Juegos Tradicionales"
          description="Shogi, Mancala, Mahjong y más"
          tag="Próximamente"
          tagColor="#9E9E9E"
          onPress={() => {}}
        />

        <GameCard
          emoji="🗣️"
          title="Lecciones de Idioma"
          description="Aprende frases clave de cada país"
          tag="Próximamente"
          tagColor="#9E9E9E"
          onPress={() => {}}
        />

        <GameCard
          emoji="📦"
          title="Abrir Sobres"
          description="Consigue coleccionables aleatorios"
          tag="0 sellos"
          tagColor="#c9a84c"
          onPress={() => {}}
        />

        <GameCard
          emoji="⚔️"
          title="Duelo 1v1"
          description="Compite contra un amigo"
          tag="Próximamente"
          tagColor="#9E9E9E"
          onPress={() => {}}
        />

        <GameCard
          emoji="🌐"
          title="Expedición Global"
          description="Reto colectivo semanal"
          tag="Próximamente"
          tagColor="#9E9E9E"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
