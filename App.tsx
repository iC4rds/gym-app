import "./app.css"
import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import type { RootStackParamList, RootTabParamList } from "./src/types/navigation"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "./src/firebase"
import { ThemeProvider, useTheme } from "./src/context/ThemeContext"

import HomeScreen from "./src/screens/HomeScreen"
import WorkoutScreen from "./src/screens/WorkoutScreen"
import ExerciseScreen from "./src/screens/ExerciseScreen"
import LoginScreen from "./src/screens/LoginScreen"
import SignupScreen from "./src/screens/SignupScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import BottomNavigator from "./src/components/BottomNav"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootTabParamList>()

function MainTabs() {
  return (
    <Tab.Navigator tabBar={() => <BottomNavigator />}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return null

  return (
    <ThemeProvider>
      <AppWithProviders user={user} />
    </ThemeProvider>
  )
}

function AppWithProviders({ user }: { user: User | null }) {
  const { theme } = useTheme()

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "MainTabs" : "Login"}
        screenOptions={{
          headerStyle: { backgroundColor: theme === "dark" ? "#0f172a" : "#fff" },
          headerTintColor: theme === "dark" ? "#fff" : "#0f172a",
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerTitle: "Registrieren" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Workout" component={WorkoutScreen} options={{ headerTitle: "Workout" }} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ headerTitle: "Übung" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
