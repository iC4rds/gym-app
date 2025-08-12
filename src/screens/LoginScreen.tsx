import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Login fehlgeschlagen", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white">
        <View className="flex-1 justify-center px-8">
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-slate-900 rounded-2xl items-center justify-center mb-8">
              <Text className="text-white text-2xl font-bold">GT</Text>
            </View>
            
            <Text className="text-4xl font-light text-slate-900 mb-3">
              Gym Tracker
            </Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
                E-Mail
              </Text>
              <TextInput
                className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
                placeholder="ihre@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
                Passwort
              </Text>
              <TextInput
                className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              className={`w-full p-5 rounded-2xl mt-8 ${
                isLoading ? 'bg-slate-400' : 'bg-slate-900'
              }`}
              onPress={navigateToHome}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="pb-12 px-6">
          <TouchableOpacity className="items-center py-4">
            <Text className="text-slate-600 text-base font-medium">
              Passwort vergessen?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}