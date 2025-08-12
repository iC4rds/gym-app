import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

export default function WorkoutScreen({ route }: Props) {
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  
  const { workoutId } = route.params;

  const handleSaveExercise = () => {
    // Hier später Firestore-Integration einfügen
    console.log("Übung gespeichert:", { exerciseName, weight, sets, reps });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-light text-slate-900 mb-2">
            {workoutId ? "Workout bearbeiten" : "Neues Workout"}
          </Text>
          <Text className="text-base text-slate-500 font-light">
            Füge deine Übungen hinzu
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-6">
          <View>
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
              Übungsname
            </Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
              placeholder="z.B. Bankdrücken"
              placeholderTextColor="#94a3b8"
              value={exerciseName}
              onChangeText={setExerciseName}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
              Gewicht
            </Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
              placeholder="z.B. 80"
              placeholderTextColor="#94a3b8"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
                Sätze
              </Text>
              <TextInput
                className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
                placeholder="3"
                placeholderTextColor="#94a3b8"
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">
                Wiederholungen
              </Text>
              <TextInput
                className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
                placeholder="12"
                placeholderTextColor="#94a3b8"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            className="w-full bg-slate-900 p-5 rounded-2xl mt-8"
            onPress={handleSaveExercise}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              Übung speichern
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}