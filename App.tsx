import "./app.css"
import { View, Text, TouchableOpacity } from "react-native";
import { auth } from "./src/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function App() {
  const handleTest = async () => {
    try {
      await signInWithEmailAndPassword(auth, "test@test.com", "123456");
      console.log("Eingeloggt!");
    } catch (error) {
      console.error("Fehler:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg"
        onPress={handleTest}
      >
        <Text className="text-white text-lg font-semibold">
          Test: Firebase Auth
        </Text>
      </TouchableOpacity>
    </View>
  );
}
