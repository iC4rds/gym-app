import { View, TouchableOpacity, Text } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { useTheme } from "../context/ThemeContext"

export default function BottomNavigator() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const { theme } = useTheme() // Added theme context

  const tabs = [
    { name: "Home", label: "Workouts", icon: "🏋️" },
    { name: "Profile", label: "Profil", icon: "👤" },
  ]

  const isDark = theme === "dark"
  const bgColor = isDark ? "bg-slate-900" : "bg-white"
  const borderColor = isDark ? "border-slate-700" : "border-slate-100"
  const activeText = isDark ? "text-white" : "text-slate-900"
  const inactiveText = isDark ? "text-slate-500" : "text-slate-400"

  return (
    <View className={`${bgColor} border-t ${borderColor} px-6 py-4`}>
      <View className="flex-row justify-around">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            className="items-center py-2 px-4"
            onPress={() => navigation.navigate("MainTabs", { screen: tab.name as never })}
            activeOpacity={0.7}
          >
            <Text className="text-2xl mb-1">{tab.icon}</Text>
            <Text className={`text-xs font-medium ${route.name === tab.name ? activeText : inactiveText}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
