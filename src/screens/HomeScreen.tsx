import { View, Text, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { auth } from "../firebase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const workouts = [
    { id: "1", name: "Push Day", date: "01. Okt 2023", exercises: 8 },
    { id: "2", name: "Pull Day", date: "02. Okt 2023", exercises: 6 },
    { id: "3", name: "Leg Day", date: "03. Okt 2023", exercises: 7 },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-light text-slate-900 mb-2">
            Deine Workouts
          </Text>
          <Text className="text-base text-slate-500 font-light">
            {workouts.length} Trainingseinheiten
          </Text>
        </View>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-slate-50 p-6 mb-4 rounded-2xl border border-slate-100"
              onPress={() => navigation.navigate("Workout", { workoutId: item.id })}
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-xl font-medium text-slate-900">
                  {item.name}
                </Text>
                <View className="bg-slate-200 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-slate-600">
                    {item.exercises} Übungen
                  </Text>
                </View>
              </View>
              <Text className="text-slate-500 font-light">
                {item.date}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View className="px-6 pb-6">
          <TouchableOpacity
            className="bg-slate-900 p-5 rounded-2xl"
            onPress={() => navigation.navigate("Workout", {})}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              Neues Workout starten
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}