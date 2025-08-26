import { View, Text, TouchableOpacity, StatusBar, Alert } from "react-native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function ProfileScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("Fehler", "Abmeldung fehlgeschlagen");
    }
  };

  const user = auth.currentUser;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-light text-slate-900 mb-2">
            Profil
          </Text>
          <Text className="text-base text-slate-500 font-light">
            Deine Kontoinformationen
          </Text>
        </View>

        {/* Profile Info */}
        <View className="px-6">
          <View className="bg-slate-50 p-6 rounded-2xl mb-8">
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-2xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-xl font-medium text-slate-900 mb-1">
                {user?.displayName || "Gym Tracker User"}
              </Text>
              <Text className="text-slate-500 font-light">
                {user?.email}
              </Text>
            </View>
          </View>

          <View className="space-y-4 mb-8">
            <TouchableOpacity className="bg-slate-50 p-5 rounded-2xl flex-row justify-between items-center">
              <Text className="text-slate-900 font-medium text-base">
                Trainingsstatistiken
              </Text>
              <Text className="text-slate-500">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-slate-50 p-5 rounded-2xl flex-row justify-between items-center">
              <Text className="text-slate-900 font-medium text-base">
                Einstellungen
              </Text>
              <Text className="text-slate-500">→</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-red-50 p-5 rounded-2xl border border-red-100"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-red-600 text-center font-semibold text-base">
              Abmelden
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}