import { View, Text, FlatList, TouchableOpacity, StatusBar } from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
import { useWorkouts } from "../hooks/useWorkout"
import type { RootStackParamList } from "../types/navigation"
import { auth, db } from "../firebase"
import { doc, collection } from "firebase/firestore"
import { useTheme } from "../context/ThemeContext"

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { workouts, loading } = useWorkouts()
  const { theme } = useTheme() // Added theme context

  const userId = auth.currentUser?.uid
  if (!userId) return null

  const workoutsColRef = collection(db, "users", userId, "workouts")
  const newWorkoutRef = doc(workoutsColRef)
  const newWorkoutId = newWorkoutRef.id

  const isDark = theme === "dark"
  const bgColor = isDark ? "bg-slate-900" : "bg-white"
  const textPrimary = isDark ? "text-white" : "text-slate-900"
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500"
  const cardBg = isDark ? "bg-slate-800" : "bg-slate-50"
  const cardBorder = isDark ? "border-slate-700" : "border-slate-100"
  const badgeBg = isDark ? "bg-slate-700" : "bg-slate-200"
  const badgeText = isDark ? "text-slate-300" : "text-slate-600"
  const buttonBg = isDark ? "bg-white" : "bg-slate-900"
  const buttonText = isDark ? "text-slate-900" : "text-white"

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${bgColor}`}>
        <Text className={textPrimary}>Lade Workouts...</Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0f172a" : "#ffffff"}
      />
      <View className={`flex-1 ${bgColor}`}>
        <View className="px-6 pt-16 pb-8">
          <Text className={`text-3xl font-light ${textPrimary} mb-2`}>Deine Workouts</Text>
          <Text className={`text-base ${textSecondary} font-light`}>
            {workouts.length} {workouts.length === 1 ? "Workout" : "Workouts"}
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
                className={`${cardBg} p-6 mb-4 rounded-2xl border ${cardBorder}`}
                onPress={() => navigation.navigate("Workout", { workoutId: item.id })}
                activeOpacity={0.7}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className={`text-xl font-medium ${textPrimary}`}>{item.name || "Unbenanntes Workout"}</Text>
                  <View className={`${badgeBg} px-3 py-1 rounded-full`}>
                    <Text className={`text-xs font-medium ${badgeText}`}>
                      {item.exerciseCount || 0} {item.exerciseCount === 1 ? "Übung" : "Übungen"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className={`text-center ${textSecondary} font-light text-base`}>
              Du hast noch keine Workouts. Klicke unten, um ein neues Workout zu erstellen.
            </Text>
          </View>
        )}

        <View className="px-6 pb-6">
          <TouchableOpacity
            className={`${buttonBg} p-5 rounded-2xl`}
            onPress={() => {
              navigation.navigate("Workout", { workoutId: newWorkoutId, isNew: true })
            }}
            activeOpacity={0.8}
          >
            <Text className={`${buttonText} text-center font-semibold text-base`}>Neues Workout hinzufügen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}
