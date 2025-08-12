import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: "Home", label: "Workouts", icon: "🏋️" },
    { name: "Profile", label: "Profil", icon: "👤" },
  ];

  return (
    <View className="bg-white border-t border-slate-100 px-6 py-4">
      <View className="flex-row justify-around">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            className="items-center py-2 px-4"
            onPress={() => navigation.navigate(tab.name as never)}
            activeOpacity={0.7}
          >
            <Text className="text-2xl mb-1">{tab.icon}</Text>
            <Text
              className={`text-xs font-medium ${
                route.name === tab.name ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}