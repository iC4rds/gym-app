import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { auth, db } from "../firebase"
import { doc, setDoc, updateDoc, getDoc, deleteDoc, collection } from "firebase/firestore"
import { useTheme } from "../context/ThemeContext"

type Props = NativeStackScreenProps<RootStackParamList, "Exercise">

export default function ExerciseScreen({ route }: Props) {
  const { workoutId, exerciseId } = route.params
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { theme } = useTheme()

  const [exerciseName, setExerciseName] = useState("")
  const [weight, setWeight] = useState("")
  const [sets, setSets] = useState("")
  const [reps, setReps] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadExercise = async () => {
      if (!exerciseId) return
      const userId = auth.currentUser?.uid
      if (!userId) return

      try {
        const exerciseRef = doc(db, "users", userId, "workouts", workoutId, "exercises", exerciseId)
        const snap = await getDoc(exerciseRef)
        if (snap.exists()) {
          const data = snap.data()
          setExerciseName(data.name || "")
          setWeight(String(data.weight || ""))
          setSets(String(data.sets || ""))
          setReps(String(data.reps || ""))
        }
      } catch (error) {
        console.error("Fehler beim Laden der Übung:", error)
      }
    }

    loadExercise()
  }, [exerciseId, workoutId])

  const validateInputs = () => {
    if (!exerciseName.trim()) {
      Alert.alert("Fehler", "Bitte gib der Übung einen Namen.")
      return false
    }

    const weightNum = Number.parseFloat(weight)
    const setsNum = Number.parseInt(sets)
    const repsNum = Number.parseInt(reps)

    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert("Fehler", "Bitte gib ein gültiges Gewicht ein.")
      return false
    }

    if (isNaN(setsNum) || setsNum <= 0) {
      Alert.alert("Fehler", "Bitte gib eine gültige Anzahl Sätze ein.")
      return false
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      Alert.alert("Fehler", "Bitte gib eine gültige Anzahl Wiederholungen ein.")
      return false
    }

    return true
  }

  const handleSaveExercise = async () => {
    if (!validateInputs()) return

    const userId = auth.currentUser?.uid
    if (!userId) return

    setLoading(true)

    try {
      const exerciseData = {
        name: exerciseName.trim(),
        weight: Number.parseFloat(weight),
        sets: Number.parseInt(sets),
        reps: Number.parseInt(reps),
        updatedAt: new Date(),
      }

      if (exerciseId) {
        const exerciseRef = doc(db, "users", userId, "workouts", workoutId, "exercises", exerciseId)
        await updateDoc(exerciseRef, exerciseData)
      } else {
        const exercisesCollectionRef = collection(db, "users", userId, "workouts", workoutId, "exercises")
        const newExerciseRef = doc(exercisesCollectionRef)
        await setDoc(newExerciseRef, {
          ...exerciseData,
          createdAt: new Date(),
        })
      }

      navigation.goBack()
    } catch (error) {
      console.error("Fehler beim Speichern der Übung:", error)
      Alert.alert("Fehler", "Übung konnte nicht gespeichert werden.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExercise = () => {
    if (!exerciseId) return

    Alert.alert("Übung löschen", "Möchtest du diese Übung wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          const userId = auth.currentUser?.uid
          if (!userId) return

          try {
            const exerciseRef = doc(db, "users", userId, "workouts", workoutId, "exercises", exerciseId)
            await deleteDoc(exerciseRef)
            navigation.goBack()
          } catch (error) {
            console.error("Fehler beim Löschen der Übung:", error)
            Alert.alert("Fehler", "Übung konnte nicht gelöscht werden.")
          }
        },
      },
    ])
  }

  const isDark = theme === "dark"
  const bgColor = isDark ? "bg-slate-900" : "bg-white"
  const textColor = isDark ? "text-white" : "text-slate-900"
  const secondaryTextColor = isDark ? "text-slate-400" : "text-slate-700"
  const inputBg = isDark ? "bg-slate-800" : "bg-slate-50"
  const inputTextColor = isDark ? "text-white" : "text-slate-900"
  const placeholderColor = isDark ? "#64748b" : "#94a3b8"

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0f172a" : "#ffffff"}
      />
      <ScrollView className={`flex-1 ${bgColor}`}>
        <View className="px-6 pt-16 pb-8">
          <Text className={`text-3xl font-light ${textColor} mb-2`}>
            {exerciseId ? "Übung bearbeiten" : "Neue Übung"}
          </Text>
        </View>

        <View className="px-6 space-y-6">
          <View>
            <Text className={`text-sm font-medium ${secondaryTextColor} mb-2 ml-1`}>Übungsname</Text>
            <TextInput
              className={`w-full ${inputBg} p-5 rounded-2xl ${inputTextColor} text-base font-medium border border-transparent focus:border-slate-900`}
              placeholder="z.B. Bankdrücken"
              placeholderTextColor={placeholderColor}
              value={exerciseName}
              onChangeText={setExerciseName}
            />
          </View>

          <View>
            <Text className={`text-sm font-medium ${secondaryTextColor} mb-2 ml-1`}>Gewicht (kg)</Text>
            <TextInput
              className={`w-full ${inputBg} p-5 rounded-2xl ${inputTextColor} text-base font-medium border border-transparent focus:border-slate-900`}
              placeholder="z.B. 80"
              placeholderTextColor={placeholderColor}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className={`text-sm font-medium ${secondaryTextColor} mb-2 ml-1`}>Sätze</Text>
              <TextInput
                className={`w-full ${inputBg} p-5 rounded-2xl ${inputTextColor} text-base font-medium border border-transparent focus:border-slate-900`}
                placeholder="3"
                placeholderTextColor={placeholderColor}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1">
              <Text className={`text-sm font-medium ${secondaryTextColor} mb-2 ml-1`}>Wiederholungen</Text>
              <TextInput
                className={`w-full ${inputBg} p-5 rounded-2xl ${inputTextColor} text-base font-medium border border-transparent focus:border-slate-900`}
                placeholder="12"
                placeholderTextColor={placeholderColor}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className="space-y-4 mt-8">
            <TouchableOpacity
              className={`w-full ${isDark ? "bg-white" : "bg-slate-900"} p-5 rounded-2xl mb-2`}
              onPress={handleSaveExercise}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text className={`${isDark ? "text-slate-900" : "text-white"} text-center font-semibold text-base`}>
                {loading ? "Speichere..." : exerciseId ? "Änderungen speichern" : "Übung speichern"}
              </Text>
            </TouchableOpacity>

            {exerciseId && (
              <TouchableOpacity
                className={`w-full p-5 rounded-2xl  border ${
                  theme === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
                }`}
                onPress={handleDeleteExercise}
                activeOpacity={0.8}
              >
                <Text className="text-red-600 text-center font-semibold text-base">Übung löschen</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  )
}
