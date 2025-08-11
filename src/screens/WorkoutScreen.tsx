import { View, Text, TextInput, TouchableOpacity } from "react-native";
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
    console.log("Übung gespeichert:", { exerciseName, sets, reps });
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">
        {workoutId ? "Workout bearbeiten" : "Neues Workout"}
      </Text>

      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        placeholder="Übungsname (z.B. Bankdrücken)"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        placeholder="Gewicht (z.B. 80kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TextInput
        className="bg-white p-3 rounded-lg mb-4"
        placeholder="Sätze (z.B. 3)"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />

      <TextInput
        className="bg-white p-3 rounded-lg mb-6"
        placeholder="Wiederholungen (z.B. 12)"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg"
        onPress={handleSaveExercise}
      >
        <Text className="text-white text-center font-bold">Übung speichern</Text>
      </TouchableOpacity>
    </View>
  );
}