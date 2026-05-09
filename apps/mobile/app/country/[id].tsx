import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

const COUNTRY_DATA: Record<string, {
  name: string;
  flag: string;
  continent: string;
  capital: string;
  language: string;
  game: string;
  funFact: string;
}> = {
  ES: { name: 'España', flag: '🇪🇸', continent: 'Europa', capital: 'Madrid', language: 'Español', game: 'Mus', funFact: 'España tiene más bares per cápita que cualquier otro país de Europa.' },
  JP: { name: 'Japón', flag: '🇯🇵', continent: 'Asia', capital: 'Tokio', language: 'Japonés', game: 'Shogi', funFact: 'Japón tiene más de 6.800 islas habitadas.' },
  BR: { name: 'Brasil', flag: '🇧🇷', continent: 'América', capital: 'Brasilia', language: 'Portugués', game: 'Capoeira', funFact: 'Brasil es el único país de América del Sur donde se habla portugués.' },
  GH: { name: 'Ghana', flag: '🇬🇭', continent: 'África', capital: 'Acra', language: 'Inglés', game: 'Oware', funFact: 'Ghana fue el primer país de África subsahariana en obtener la independencia en 1957.' },
  MN: { name: 'Mongolia', flag: '🇲🇳', continent: 'Asia', capital: 'Ulán Bator', language: 'Mongol', game: 'Shagai', funFact: 'Mongolia es el país con la menor densidad de población del mundo.' },
  MX: { name: 'México', flag: '🇲🇽', continent: 'América', capital: 'Ciudad de México', language: 'Español', game: 'Lotería', funFact: 'México es el país hispanohablante más poblado del mundo.' },
};

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const country = typeof id === 'string' ? COUNTRY_DATA[id.toUpperCase()] : null;

  if (!country) {
    return (
      <SafeAreaView className="flex-1 bg-paper items-center justify-center">
        <Text className="font-display text-ink text-xl">País no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="font-body text-gold">← Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cabecera */}
        <View className="px-5 pt-4 flex-row items-center gap-3 mb-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Text className="text-ink text-xl">←</Text>
          </TouchableOpacity>
          <Text className="font-body text-stamp text-sm">{country.continent}</Text>
        </View>

        {/* Hero */}
        <View className="items-center py-8 bg-gold/5 mx-5 rounded-2xl border border-gold/20 mb-6">
          <Text className="text-8xl mb-3">{country.flag}</Text>
          <Text className="font-display text-ink text-3xl">{country.name}</Text>
          <Text className="font-body text-stamp text-sm mt-1">Capital: {country.capital}</Text>
        </View>

        {/* Info básica */}
        <View className="px-5 mb-5">
          <Text className="font-body-bold text-ink text-sm uppercase tracking-widest mb-3">
            Datos del país
          </Text>
          <View className="bg-white border border-paper-dark rounded-xl overflow-hidden">
            {[
              { label: 'Idioma oficial', value: country.language, emoji: '🗣️' },
              { label: 'Juego tradicional', value: country.game, emoji: '🎲' },
            ].map((item, i, arr) => (
              <View
                key={item.label}
                className={`flex-row items-center px-4 py-3 ${
                  i < arr.length - 1 ? 'border-b border-paper-dark' : ''
                }`}
              >
                <Text className="text-xl mr-3">{item.emoji}</Text>
                <Text className="font-body text-stamp text-sm flex-1">{item.label}</Text>
                <Text className="font-body-medium text-ink text-sm">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dato curioso */}
        <View className="mx-5 bg-gold/10 border border-gold/30 rounded-xl p-4 mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xl">💡</Text>
            <Text className="font-body-bold text-ink text-sm">¿Sabías que...?</Text>
          </View>
          <Text className="font-body text-ink/80 text-sm leading-relaxed">{country.funFact}</Text>
        </View>

        {/* Cómo desbloquear */}
        <View className="px-5">
          <Text className="font-body-bold text-ink text-sm uppercase tracking-widest mb-3">
            Cómo conseguir sellos
          </Text>
          {[
            { emoji: '🧠', title: 'Trivia', desc: 'Responde preguntas culturales para desbloquear coleccionables', available: true },
            { emoji: '🎲', title: 'Juego: ' + country.game, desc: 'Domina el juego tradicional del país', available: false },
            { emoji: '🗣️', title: 'Idioma', desc: 'Aprende frases básicas de ' + country.language, available: false },
            { emoji: '📍', title: 'GPS', desc: 'Visita ' + country.name + ' físicamente', available: false },
          ].map((action) => (
            <TouchableOpacity
              key={action.title}
              disabled={!action.available}
              className={`flex-row items-center p-3 rounded-xl mb-2 ${
                action.available
                  ? 'bg-white border border-paper-dark'
                  : 'bg-paper-dark/50 border border-paper-dark/50'
              }`}
            >
              <Text className={`text-xl mr-3 ${!action.available ? 'opacity-40' : ''}`}>{action.emoji}</Text>
              <View className="flex-1">
                <Text className={`font-body-medium text-sm ${action.available ? 'text-ink' : 'text-stamp/60'}`}>
                  {action.title}
                </Text>
                <Text className={`font-body text-xs ${action.available ? 'text-stamp' : 'text-stamp/50'}`}>
                  {action.available ? action.desc : 'Próximamente'}
                </Text>
              </View>
              {action.available && <Text className="text-gold">›</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
