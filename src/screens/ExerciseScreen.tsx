import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { workouts } from "../data";

type Props = NativeStackScreenProps<RootStackParamList, "Exercise">;

export default function ExerciseScreen({ route }: Props) {
  const { exerciseId } = route.params || {};

  const existingExercise = exerciseId
    ? workouts
        .flatMap((w) => w.exercises)
        .find((e) => e.id === exerciseId)
    : undefined;

  const [exerciseName, setExerciseName] = useState(existingExercise?.name || "");
  const [weight, setWeight] = useState(existingExercise?.weight || "");
  const [sets, setSets] = useState(existingExercise?.sets || "");
  const [reps, setReps] = useState(existingExercise?.reps || "");

  const handleSaveExercise = () => {
    if (exerciseId) {
      console.log("Übung aktualisiert:", { exerciseId, exerciseName, weight, sets, reps });
      // TODO: Update-Logik einbauen
    } else {
      console.log("Neue Übung erstellt:", { exerciseName, weight, sets, reps });
      // TODO: Create-Logik einbauen
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-light text-slate-900 mb-2">
            {exerciseId ? "Übung bearbeiten" : "Neue Übung"}
          </Text>
          <Text className="text-base text-slate-500 font-light">
            {exerciseId ? "Passe die Werte an" : "Füge eine neue Übung hinzu"}
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-6">
          <View>
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Übungsname</Text>
            <TextInput
              className="w-full bg-slate-50 p-5 rounded-2xl text-slate-900 text-base font-medium border border-transparent focus:border-slate-900"
              placeholder="z.B. Bankdrücken"
              placeholderTextColor="#94a3b8"
              value={exerciseName}
              onChangeText={setExerciseName}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Gewicht</Text>
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
              <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Sätze</Text>
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
              <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Wiederholungen</Text>
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
              {exerciseId ? "Änderungen speichern" : "Übung speichern"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
