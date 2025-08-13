import { View, Text, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { workouts } from "../data";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

export default function WorkoutScreen({ route }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { workoutId } = route.params;

  const workout = workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Workout nicht gefunden</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-light text-slate-900 mb-2">{workout.name}</Text>
          {workout.exercises.length > 1
            ? <Text className="text-base text-slate-500 font-light">
              {workout.exercises.length} Übungen
            </Text>
            : <Text className="text-base text-slate-500 font-light">
              {workout.exercises.length} Übung
            </Text>
          }
        </View>

        <FlatList
          data={workout.exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-slate-50 p-6 mb-4 rounded-2xl border border-slate-100"
              onPress={() =>
                navigation.navigate("Exercise", { exerciseId: item.id })
              }
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-xl font-medium text-slate-900">{item.name}</Text>
                <Text className="text-xl font-medium text-slate-600">
                  {item.weight} kg
                </Text>
                <View className="bg-slate-200 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-slate-600">
                    {item.sets} × {item.reps}
                  </Text>
                </View>
              </View>
              <Text className="text-slate-500 font-light">{item.weight} kg</Text>
            </TouchableOpacity>
          )}
        />

        <View className="px-6 pb-6">
          <TouchableOpacity
            className="bg-slate-900 p-5 rounded-2xl"
            onPress={() => navigation.navigate("Exercise", {})}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              Übung hinzufügen
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
