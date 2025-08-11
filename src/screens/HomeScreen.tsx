import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { auth } from "../firebase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../types/navigation";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const workouts = [
    { id: "1", name: "Push Day", date: "2023-10-01" },
    { id: "2", name: "Pull Day", date: "2023-10-02" },
  ];

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Deine Workouts</Text>
      
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white p-4 mb-2 rounded-lg"
            onPress={() => navigation.navigate("Workout", { workoutId: item.id })}
          >
            <Text className="font-bold">{item.name}</Text>
            <Text className="text-gray-500">{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        className="bg-green-500 p-3 rounded-lg mt-4"
        onPress={() => navigation.navigate("Workout", {})}
      >
        <Text className="text-white text-center font-bold">Neues Workout</Text>
      </TouchableOpacity>
    </View>
  );
}