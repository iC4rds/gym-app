import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Fehler", "Die Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Erfolg", "Konto erfolgreich erstellt");

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        theme: "light",
        createdAt: new Date(),
      });

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert("Registrierung fehlgeschlagen", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white justify-center px-6">
        <View className="items-center mb-12">
          <Text className="text-4xl font-light text-slate-900 mb-3">
            Konto erstellen
          </Text>
          <Text className="text-lg text-slate-500 font-light">
            Willkommen bei Gym Tracker
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-6">
          <View className="p-1">
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
              Name
            </Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent"
              placeholder="Ihr Name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
              autoComplete="name"
            />
          </View>

          <View className="p-1">
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
              E-Mail
            </Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent"
              placeholder="ihre@email.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="p-1">
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
              Passwort
            </Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent"
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <View className="p-1">
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
              Passwort bestätigen
            </Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent"
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className={`w-full p-5 rounded-2xl mt-8 ${
              isLoading ? "bg-slate-400" : "bg-slate-900"
            }`}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              {isLoading ? "Wird erstellt..." : "Registrieren"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
