import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signInWithEmail } from '@/services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor rellena todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      // El AuthGuard en _layout.tsx redirige automáticamente
    } catch (error) {
      Alert.alert(
        'Error al iniciar sesión',
        error instanceof Error ? error.message : 'Inténtalo de nuevo'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabecera */}
          <View className="items-center pt-16 pb-10 px-8">
            <Text className="text-7xl mb-4">🌍</Text>
            <Text className="font-display text-ink text-4xl">WorldDex</Text>
            <Text className="font-display-italic text-gold text-2xl mt-1">
              Tu pasaporte al mundo
            </Text>
            <Text className="font-body text-stamp text-sm text-center mt-3">
              Colecciona los 195 países a través de trivia,{'\n'}
              idiomas, juegos y viajes reales.
            </Text>
          </View>

          {/* Formulario */}
          <View className="mx-6 gap-4">
            <View>
              <Text className="font-body-medium text-ink text-sm mb-2">Email</Text>
              <TextInput
                className="bg-white border border-paper-dark rounded-xl px-4 py-4 font-body text-ink text-base"
                placeholder="tu@email.com"
                placeholderTextColor="#7a7060"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="font-body-medium text-ink text-sm mb-2">Contraseña</Text>
              <TextInput
                className="bg-white border border-paper-dark rounded-xl px-4 py-4 font-body text-ink text-base"
                placeholder="••••••••"
                placeholderTextColor="#7a7060"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`rounded-xl py-4 items-center mt-2 ${
                isLoading ? 'bg-gold/60' : 'bg-gold'
              }`}
            >
              <Text className="font-body-bold text-white text-base">
                {isLoading ? 'Entrando...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              className="items-center py-3"
            >
              <Text className="font-body text-stamp text-sm">
                ¿No tienes cuenta?{' '}
                <Text className="font-body-bold text-gold">Regístrate gratis</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
