import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Login fehlgeschlagen", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-6">Gym Tracker Login</Text>
      
      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="bg-white p-3 rounded-lg mb-6"
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>
    </View>
  );
}