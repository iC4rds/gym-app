import { View, Text, TouchableOpacity, StatusBar, Alert, TextInput, Switch, ScrollView } from "react-native"
import { auth, db } from "../firebase"
import { signOut } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"

export default function ProfileScreen() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()
  const [isEditingName, setIsEditingName] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [tempName, setTempName] = useState("")

  const user = auth.currentUser

  useEffect(() => {
    setDisplayName(user?.displayName || "Gym Tracker User")
  }, [])

  const handleToggleTheme = async () => {
    try {
      await toggleTheme()
    } catch (error) {
      Alert.alert("Fehler", "Theme konnte nicht gespeichert werden")
    }
  }

  const handleSaveName = async () => {
    if (!tempName.trim()) {
      Alert.alert("Fehler", "Name darf nicht leer sein")
      return
    }

    try {
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          name: tempName.trim(),
        })
      }

      setDisplayName(tempName.trim())
      setIsEditingName(false)
      Alert.alert("Erfolg", "Name wurde aktualisiert")
    } catch (error) {
      Alert.alert("Fehler", "Name konnte nicht gespeichert werden")
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      Alert.alert("Fehler", "Abmeldung fehlgeschlagen")
    }
  }

  const isDark = theme === "dark"
  const bgColor = isDark ? "bg-slate-900" : "bg-white"
  const textColor = isDark ? "text-white" : "text-slate-900"
  const secondaryTextColor = isDark ? "text-slate-400" : "text-slate-500"
  const cardBg = isDark ? "bg-slate-800" : "bg-slate-50"
  const inputBg = isDark ? "bg-slate-700" : "bg-white"

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0f172a" : "#ffffff"}
      />
      <ScrollView className={`flex-1 ${bgColor}`}>
        <View className="px-6 pt-16 pb-8">
          <Text className={`text-3xl font-light ${textColor} mb-2`}>Profil</Text>
        </View>

        <View className="px-6">
          <View className={`${cardBg} p-6 rounded-2xl mb-8`}>
            <View className="items-center mb-6">
              <View
                className={`w-20 h-20 ${isDark ? "bg-white" : "bg-slate-900"} rounded-full items-center justify-center mb-4`}
              >
                <Text className={`${isDark ? "text-slate-900" : "text-white"} text-2xl font-bold`}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>

              {isEditingName ? (
                <View className="w-full items-center">
                  <TextInput
                    className={`${inputBg} ${textColor} p-3 rounded-xl border border-slate-300 text-center text-lg font-medium mb-3 w-48`}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Name eingeben"
                    placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <View className="flex-row space-x-3">
                    <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg" onPress={handleSaveName}>
                      <Text className="text-white font-medium">Speichern</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`${isDark ? "bg-slate-600" : "bg-slate-300"} px-4 py-2 rounded-lg`}
                      onPress={() => setIsEditingName(false)}
                    >
                      <Text className={textColor}>Abbrechen</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setTempName(displayName)
                    setIsEditingName(true)
                  }}
                  className="items-center"
                >
                  <Text className={`text-xl font-medium ${textColor} mb-1`}>{displayName}</Text>
                  <Text className={`${secondaryTextColor} font-light text-sm`}>Tippen zum Bearbeiten</Text>
                </TouchableOpacity>
              )}

              <Text className={`${secondaryTextColor} font-light mt-2`}>{user?.email}</Text>
            </View>
          </View>

          <View className={`${cardBg} mt-2 p-5 rounded-2xl space-y-4`}>
            <View className="flex-row justify-between items-center">
              <Text className={`${textColor} font-medium`}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={handleToggleTheme}
                trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
                thumbColor={isDark ? "#ffffff" : "#f1f5f9"}
              />
            </View>

            <TouchableOpacity className="py-2 mt-2">
              <Text className={`${textColor} font-medium`}>App-Version: 1.0.0</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`mt-6 p-5 rounded-2xl border ${
              theme === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
            }`}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-red-600 text-center font-semibold text-base">Abmelden</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}
