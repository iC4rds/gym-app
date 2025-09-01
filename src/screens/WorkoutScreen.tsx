import { View, Text, TouchableOpacity, StatusBar, TextInput, Alert, ScrollView } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { useEffect, useState, useCallback } from "react"
import { db, auth } from "../firebase"
import { doc, getDoc, collection, setDoc, updateDoc, getDocs, query, deleteDoc } from "firebase/firestore"
import type { Exercise } from "../types/workout"
import { useTheme } from "../context/ThemeContext"

type Props = NativeStackScreenProps<RootStackParamList, "Workout">

export default function WorkoutScreen({ route }: Props) {
  const { workoutId, isNew } = route.params
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { theme } = useTheme()

  const [id, setId] = useState(workoutId || "")
  const [name, setName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const userId = auth.currentUser?.uid

  const loadExercises = async (workoutId: string) => {
    if (!userId || !workoutId) return

    try {
      const exercisesQuery = query(collection(db, "users", userId, "workouts", workoutId, "exercises"))
      const exercisesSnap = await getDocs(exercisesQuery)
      const exercisesData = exercisesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Exercise[]
      setExercises(exercisesData)
    } catch (error) {
      console.error("Fehler beim Laden der Übungen:", error)
    }
  }

  useEffect(() => {
    const initializeWorkout = async () => {
      if (!userId || isInitialized) return

      setLoading(true)

      try {
        if (isNew) {
          const newDocRef = doc(collection(db, "users", userId, "workouts"))
          const newId = newDocRef.id
          setId(newId)
          await setDoc(newDocRef, {
            name: "",
            exerciseCount: 0,
            createdAt: new Date(),
          })
        } else {
          const docRef = doc(db, "users", userId, "workouts", workoutId)
          const snap = await getDoc(docRef)
          if (snap.exists()) {
            const data = snap.data()
            setName(data.name || "")
          }
          await loadExercises(workoutId)
        }
        setIsInitialized(true)
      } catch (error) {
        console.error("Fehler beim Laden des Workouts:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeWorkout()
  }, [userId, workoutId, isNew, isInitialized])

  useFocusEffect(
    useCallback(() => {
      if (isInitialized && id && !isNew && !loading) {
        loadExercises(id)
      }
    }, [id, isNew, isInitialized, loading]),
  )

  const handleSaveWorkout = async () => {
    if (!userId || !id || !name.trim()) {
      Alert.alert("Fehler", "Bitte gib dem Workout einen Namen.")
      return
    }

    try {
      const docRef = doc(db, "users", userId, "workouts", id)
      await updateDoc(docRef, {
        name: name.trim(),
        exerciseCount: exercises.length,
        updatedAt: new Date(),
      })
      navigation.goBack()
    } catch (error) {
      console.error("Fehler beim Speichern:", error)
      Alert.alert("Fehler", "Workout konnte nicht gespeichert werden.")
    }
  }

  const handleDeleteWorkout = () => {
    if (!workoutId) return

    Alert.alert("Workout löschen", "Möchtest du dieses Workout wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          const userId = auth.currentUser?.uid
          if (!userId) return

          try {
            const exerciseRef = doc(db, "users", userId, "workouts", workoutId)
            await deleteDoc(exerciseRef)
            navigation.goBack()
          } catch (error) {
            console.error("Fehler beim Löschen des Workouts:", error)
            Alert.alert("Fehler", "Workout konnte nicht gelöscht werden.")
          }
        },
      },
    ])
  }

  const handleAddExercise = () => {
    navigation.navigate("Exercise", { workoutId: id })
  }

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <Text className={theme === "dark" ? "text-white" : "text-slate-900"}>Lade Workout...</Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#0f172a" : "#ffffff"}
      />
      <View className={`flex-1 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 pt-16 pb-8">
            <TextInput
              className={`text-3xl font-light mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              placeholder="Name des Workouts"
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme === "dark" ? "#64748b" : "#94a3b8"}
            />
            <Text className={`text-base font-light ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              {exercises.length} {exercises.length === 1 ? "Übung" : "Übungen"}
            </Text>
          </View>

          <View className="px-6">
            {exercises.length === 0 ? (
              <View className="py-12">
                <Text className={`text-center font-light ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                  Noch keine Übungen hinzugefügt.
                </Text>
              </View>
            ) : (
              exercises.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className={`p-6 mb-4 rounded-2xl border ${
                    theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"
                  }`}
                  onPress={() => navigation.navigate("Exercise", { workoutId: id, exerciseId: item.id })}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text
                        className={`text-xl font-medium mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                      >
                        {item.name}
                      </Text>
                      <Text className={`font-light ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                        {item.weight} kg
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`}>
                      <Text className={`text-xs font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                        {item.sets} × {item.reps}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          className={`absolute bottom-24 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg ${
            theme === "dark" ? "bg-white" : "bg-slate-900"
          }`}
          onPress={handleAddExercise}
          activeOpacity={0.8}
        >
          <Text className={`text-2xl font-light ${theme === "dark" ? "text-slate-900" : "text-white"}`}>+</Text>
        </TouchableOpacity>

        <View
          className="absolute bottom-0 left-0 right-0 mb-2 px-6 py-4"
        >
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 p-4 rounded-xl ${theme === "dark" ? "bg-white" : "bg-slate-900"}`}
              onPress={handleSaveWorkout}
              activeOpacity={0.8}
            >
              <Text className={`text-center font-semibold ${theme === "dark" ? "text-slate-900" : "text-white"}`}>
                Workout Speichern
              </Text>
            </TouchableOpacity>

            {workoutId && (
              <TouchableOpacity
                className={`p-4 rounded-xl border ${
                  theme === "dark" ? "bg-red-900/20 border-red-800 ml-2" : "bg-red-50 border-red-200 ml-2"
                }`}
                onPress={handleDeleteWorkout}
                activeOpacity={0.8}
              >
                <Text className="text-red-600 text-center font-semibold">Löschen</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  )
}
