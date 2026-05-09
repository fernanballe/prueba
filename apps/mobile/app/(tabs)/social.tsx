import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LEAGUE_TIERS = [
  { tier: 'Élite', color: '#FF6B6B', emoji: '👑' },
  { tier: 'Diamante', color: '#B9F2FF', emoji: '💎' },
  { tier: 'Oro', color: '#FFD700', emoji: '🥇' },
  { tier: 'Plata', color: '#C0C0C0', emoji: '🥈' },
  { tier: 'Bronce', color: '#CD7F32', emoji: '🥉' },
];

const PLACEHOLDER_LEADERBOARD = [
  { rank: 1, name: 'Explorador_1', xp: 2480, flag: '🇪🇸' },
  { rank: 2, name: 'Viajero_Global', xp: 2210, flag: '🇯🇵' },
  { rank: 3, name: 'Mundovista', xp: 1990, flag: '🇧🇷' },
  { rank: 4, name: 'CulturaPro', xp: 1750, flag: '🇩🇪' },
  { rank: 5, name: 'Tú', xp: 0, flag: '🌍', isMe: true },
];

export default function SocialScreen() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="px-5 pt-4 pb-3 border-b border-paper-dark">
        <Text className="font-display text-3xl text-ink">Social</Text>
        <Text className="font-body text-stamp text-sm mt-1">
          Liga semanal y amigos
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Tu posición actual */}
        <View className="mx-5 mt-4 bg-gold/10 border border-gold/30 rounded-xl p-4">
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl">🥉</Text>
            <View>
              <Text className="font-body text-stamp text-xs uppercase tracking-widest">
                Tu liga actual
              </Text>
              <Text className="font-display text-ink text-xl">Liga Bronce</Text>
            </View>
            <View className="flex-1" />
            <View className="items-end">
              <Text className="font-body text-stamp text-xs">XP semanal</Text>
              <Text className="font-body-bold text-ink text-lg">0</Text>
            </View>
          </View>
          <View className="mt-3 h-2 bg-paper-dark rounded-full overflow-hidden">
            <View className="h-full bg-gold rounded-full" style={{ width: '0%' }} />
          </View>
          <Text className="font-body text-stamp text-xs mt-1">0 / 1000 XP para ascender</Text>
        </View>

        {/* Clasificación semanal */}
        <View className="px-5 mt-5">
          <Text className="font-body-bold text-ink text-sm uppercase tracking-widest mb-3">
            Clasificación — Semana actual
          </Text>

          {PLACEHOLDER_LEADERBOARD.map((player) => (
            <View
              key={player.rank}
              className={`flex-row items-center p-3 rounded-xl mb-2 ${
                player.isMe
                  ? 'bg-gold/15 border border-gold/40'
                  : 'bg-white border border-paper-dark'
              }`}
            >
              <Text className="font-body-bold text-ink w-8 text-center">
                {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `${player.rank}.`}
              </Text>
              <Text className="text-xl mx-3">{player.flag}</Text>
              <Text className={`font-body-medium flex-1 ${player.isMe ? 'text-gold-dark' : 'text-ink'}`}>
                {player.name}
              </Text>
              <Text className="font-mono text-stamp text-sm">{player.xp.toLocaleString()} XP</Text>
            </View>
          ))}
        </View>

        {/* Categorías de liga */}
        <View className="px-5 mt-5">
          <Text className="font-body-bold text-ink text-sm uppercase tracking-widest mb-3">
            Sistema de ligas
          </Text>
          {LEAGUE_TIERS.map((league) => (
            <View
              key={league.tier}
              className="flex-row items-center mb-2"
            >
              <Text className="text-xl w-8">{league.emoji}</Text>
              <Text className="font-body-medium text-ink ml-3">{league.tier}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
