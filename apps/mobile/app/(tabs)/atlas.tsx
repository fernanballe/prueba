import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const FEATURED_COUNTRIES = [
  { iso: 'ES', flag: '🇪🇸', name: 'España', continent: 'Europa', progress: 0 },
  { iso: 'JP', flag: '🇯🇵', name: 'Japón', continent: 'Asia', progress: 0 },
  { iso: 'BR', flag: '🇧🇷', name: 'Brasil', continent: 'América', progress: 0 },
  { iso: 'GH', flag: '🇬🇭', name: 'Ghana', continent: 'África', progress: 0 },
  { iso: 'MN', flag: '🇲🇳', name: 'Mongolia', continent: 'Asia', progress: 0 },
  { iso: 'MX', flag: '🇲🇽', name: 'México', continent: 'América', progress: 0 },
];

const CONTINENTS = ['Europa', 'Asia', 'América', 'África', 'Oceanía'];

export default function AtlasScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-paper">
      {/* Cabecera */}
      <View className="px-5 pt-4 pb-3 border-b border-paper-dark">
        <Text className="font-display text-3xl text-ink">Atlas Mundial</Text>
        <Text className="font-body text-stamp text-sm mt-1">
          195 países por descubrir
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mapa placeholder */}
        <View className="mx-5 mt-4 h-48 bg-paper-dark rounded-xl border border-gold/30 items-center justify-center">
          <Text className="text-5xl mb-2">🌍</Text>
          <Text className="font-body-medium text-ink text-base">Mapa Interactivo</Text>
          <Text className="font-body text-stamp text-xs mt-1">
            Próximamente con react-native-maps
          </Text>
        </View>

        {/* Filtro por continente */}
        <View className="mt-5 px-5">
          <Text className="font-body-bold text-ink text-sm mb-3 uppercase tracking-widest">
            Por continente
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5 mb-5"
          contentContainerStyle={{ gap: 8 }}
        >
          {CONTINENTS.map((continent) => (
            <TouchableOpacity
              key={continent}
              className="bg-paper-dark border border-gold/30 rounded-full px-4 py-2"
            >
              <Text className="font-body-medium text-ink text-sm">{continent}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Países destacados */}
        <View className="px-5">
          <Text className="font-body-bold text-ink text-sm mb-3 uppercase tracking-widest">
            Países para explorar
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {FEATURED_COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.iso}
                onPress={() => router.push(`/country/${country.iso}`)}
                className="bg-white border border-paper-dark rounded-xl p-4 items-center"
                style={{ width: '46%' }}
              >
                <Text className="text-4xl mb-2">{country.flag}</Text>
                <Text className="font-body-bold text-ink text-sm">{country.name}</Text>
                <Text className="font-body text-stamp text-xs">{country.continent}</Text>
                {/* Barra de progreso */}
                <View className="mt-2 w-full h-1.5 bg-paper-dark rounded-full overflow-hidden">
                  <View
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${country.progress}%` }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
