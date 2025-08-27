import { View, Text, FlatList, TouchableOpacity, StatusBar, TextInput, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, setDoc, updateDoc, getDocs, query, deleteDoc } from "firebase/firestore";
import { Exercise } from "../types/workout";

type Props = NativeStackScreenProps<RootStackParamList, "Workout">;

export default function WorkoutScreen({ route }: Props) {
  const { workoutId, isNew } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [id, setId] = useState(workoutId || "");
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const userId = auth.currentUser?.uid;

  const loadExercises = async (workoutId: string) => {
    if (!userId || !workoutId) return;

    try {
      const exercisesQuery = query(collection(db, "users", userId, "workouts", workoutId, "exercises"));
      const exercisesSnap = await getDocs(exercisesQuery);
      const exercisesData = exercisesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Exercise[];
      setExercises(exercisesData);
    } catch (error) {
      console.error("Fehler beim Laden der Übungen:", error);
    }
  };

  useEffect(() => {
    const initializeWorkout = async () => {
      if (!userId || isInitialized) return;
      
      setLoading(true);
      
      try {
        if (isNew) {
          const newDocRef = doc(collection(db, "users", userId, "workouts"));
          const newId = newDocRef.id;
          setId(newId);
          await setDoc(newDocRef, { 
            name: "", 
            exerciseCount: 0,
            createdAt: new Date()
          });
        } else {
          const docRef = doc(db, "users", userId, "workouts", workoutId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            setName(data.name || "");
          }
          await loadExercises(workoutId);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Fehler beim Laden des Workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeWorkout();
  }, [userId, workoutId, isNew, isInitialized]);

  // Lade Übungen neu, wenn der Screen fokussiert wird
  useFocusEffect(
    useCallback(() => {
      if (isInitialized && id && !isNew && !loading) {
        loadExercises(id);
      }
    }, [id, isNew, isInitialized, loading])
  );

  const handleSaveWorkout = async () => {
    if (!userId || !id || !name.trim()) {
      Alert.alert("Fehler", "Bitte gib dem Workout einen Namen.");
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "workouts", id);
      await updateDoc(docRef, { 
        name: name.trim(),
        exerciseCount: exercises.length,
        updatedAt: new Date()
      });
      navigation.goBack();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      Alert.alert("Fehler", "Workout konnte nicht gespeichert werden.");
    }
  };

  const handleDeleteWorkout = () => {
    if (!workoutId) return;

    Alert.alert(
      "Workout löschen",
      "Möchtest du dieses Workout wirklich löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            try {
              const exerciseRef = doc(db, "users", userId, "workouts", workoutId);
              await deleteDoc(exerciseRef);
              navigation.goBack();
            } catch (error) {
              console.error("Fehler beim Löschen des Workouts:", error);
              Alert.alert("Fehler", "Workout konnte nicht gelöscht werden.");
            }
          }
        }
      ]
    );
  };

  const handleAddExercise = () => {
    navigation.navigate("Exercise", { workoutId: id });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Lade Workout...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View className="flex-1 bg-white">
        <View className="px-6 pt-16 pb-8">
          <TextInput
            className="text-3xl font-light text-slate-900 mb-2"
            placeholder="Name des Workouts"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
          />
          <Text className="text-base text-slate-500 font-light">
            {exercises.length} {exercises.length === 1 ? 'Übung' : 'Übungen'}
          </Text>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-slate-50 p-6 mb-4 rounded-2xl border border-slate-100"
              onPress={() =>
                navigation.navigate("Exercise", { workoutId: id, exerciseId: item.id })
              }
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-xl font-medium text-slate-900 mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-slate-500 font-light">
                    {item.weight} kg
                  </Text>
                </View>
                <View className="bg-slate-200 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-slate-600">
                    {item.sets} × {item.reps}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="py-12 px-6">
              <Text className="text-center text-slate-400 font-light">
                Noch keine Übungen hinzugefügt.
              </Text>
            </View>
          }
        />

        <View className="px-6 pb-6 space-y-4">
          <TouchableOpacity
            className="bg-slate-900 p-5 rounded-2xl mb-2"
            onPress={handleAddExercise}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              Übung hinzufügen
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-slate-200 p-5 rounded-2xl mb-2"
            onPress={handleSaveWorkout}
            activeOpacity={0.8}
          >
            <Text className="text-slate-900 text-center font-semibold text-base">
              Workout speichern
            </Text>
          </TouchableOpacity>

          {workoutId && (
              <TouchableOpacity
                className="w-full bg-red-100 p-5 rounded-2xl border border-red-200"
                onPress={handleDeleteWorkout}
                activeOpacity={0.8}
              >
                <Text className="text-red-600 text-center font-semibold text-base">
                  Workout löschen
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </>
  );
}