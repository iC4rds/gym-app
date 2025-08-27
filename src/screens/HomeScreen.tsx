import { View, Text, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useWorkouts } from "../hooks/useWorkout";
import { RootStackParamList } from "../types/navigation";
import { auth, db } from "../firebase";
import { doc, collection } from "firebase/firestore";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { workouts, loading } = useWorkouts();

  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const workoutsColRef = collection(db, "users", userId, "workouts");
  const newWorkoutRef = doc(workoutsColRef);
  const newWorkoutId = newWorkoutRef.id;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Lade Workouts...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white">
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-light text-slate-900 mb-2">
            Deine Workouts
          </Text>
          <Text className="text-base text-slate-500 font-light">
            {workouts.length} {workouts.length === 1 ? 'Workout' : 'Workouts'}
          </Text>
        </View>

        {workouts.length > 0 ? (
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
                    {item.name || 'Unbenanntes Workout'}
                  </Text>
                  <View className="bg-slate-200 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-slate-600">
                      {item.exerciseCount || 0} {item.exerciseCount === 1 ? 'Übung' : 'Übungen'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-slate-400 font-light text-base">
              Du hast noch keine Workouts. Klicke unten, um ein neues Workout zu erstellen.
            </Text>
          </View>
        )}

        <View className="px-6 pb-6">
          <TouchableOpacity
            className="bg-slate-900 p-5 rounded-2xl"
            onPress={() => {
              navigation.navigate("Workout", { workoutId: newWorkoutId, isNew: true });
            }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              Neues Workout hinzufügen
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}