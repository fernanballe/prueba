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
import { signUpWithEmail } from '@/services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor rellena todos los campos');
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, username.trim().toLowerCase());
      Alert.alert(
        '¡Cuenta creada!',
        'Revisa tu email para confirmar la cuenta antes de entrar.',
        [{ text: 'Entendido', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        'Error al registrarse',
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
          <View className="flex-row items-center px-5 pt-4 mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
              <Text className="text-ink text-xl">←</Text>
            </TouchableOpacity>
            <Text className="font-display text-ink text-2xl">Crear cuenta</Text>
          </View>

          <View className="items-center mb-8">
            <Text className="text-5xl mb-2">🌍</Text>
            <Text className="font-body text-stamp text-sm text-center">
              Empieza tu aventura como explorador
            </Text>
          </View>

          {/* Formulario */}
          <View className="mx-6 gap-4">
            <View>
              <Text className="font-body-medium text-ink text-sm mb-2">
                Nombre de explorador
              </Text>
              <TextInput
                className="bg-white border border-paper-dark rounded-xl px-4 py-4 font-body text-ink text-base"
                placeholder="explora_el_mundo"
                placeholderTextColor="#7a7060"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
                returnKeyType="next"
              />
              <Text className="font-body text-stamp text-xs mt-1 ml-1">
                Solo letras, números y guiones bajos. Mín. 3 caracteres.
              </Text>
            </View>

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
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#7a7060"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="font-body-medium text-ink text-sm mb-2">
                Confirmar contraseña
              </Text>
              <TextInput
                className="bg-white border border-paper-dark rounded-xl px-4 py-4 font-body text-ink text-base"
                placeholder="Repite la contraseña"
                placeholderTextColor="#7a7060"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={`rounded-xl py-4 items-center mt-2 ${
                isLoading ? 'bg-gold/60' : 'bg-gold'
              }`}
            >
              <Text className="font-body-bold text-white text-base">
                {isLoading ? 'Creando cuenta...' : '¡Empezar a explorar!'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center py-3"
            >
              <Text className="font-body text-stamp text-sm">
                ¿Ya tienes cuenta?{' '}
                <Text className="font-body-bold text-gold">Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
