import { Text, View, Pressable, Switch, Alert } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/actions/AuthActions";

export default function SettingsScreen() {
  const isAuthenticated = useAppSelector((state:any) => state.auth.isAuthenticated);
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
    const dispatch = useAppDispatch();
  

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // Implement theme change logic here
  };

  const handleLogout = async () => {
    try {
          await dispatch(logoutUser());
          router.replace("/(tabs)");
        } catch (error:any) {
          Alert.alert(
            "Logout Failed",
            error.message || "An unexpected error occurred. Please try again."
          );
        }
  };

  return (
    <ThemedView className="flex-1 h-screen px-4">
      <ThemedView className="space-y-6 flex-1 justify-between w-full py-6">
        <ThemedView className="space-y-6">
          <ThemedText className="text-3xl w-full font-poppins text-center font-bold mb-8">
            Settings
          </ThemedText>
           <ThemedView className="space-y-3">
             <ThemedText>
                Appearance
             </ThemedText>
            <ThemedView className="w-full shadow-sm border border-gray-100/10 rounded-xl">
              <View className="w-full justify-between flex-row items-center p-4">
                <View className="flex-row gap-4 items-center">
                  <View className="rounded-full p-3 bg-[#0EBE7F]/10">
                    <MaterialCommunityIcons
                      name="theme-light-dark"
                      size={24}
                      color="#0EBE7F"
                    />
                  </View>
                  <ThemedText className="text-lg font-medium">
                    Dark Mode
                  </ThemedText>
                </View>
                <Switch
                  value={isDarkTheme}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#767577", true: "#0EBE7F" }}
                  thumbColor={isDarkTheme ? "#fff" : "#f4f3f4"}
                />
              </View>
            </ThemedView>
           </ThemedView>
          {isAuthenticated ? (
            // Authenticated User Settings
            <ThemedView className="space-y-3">
              <Pressable className="active:opacity-80" onPress={handleLogout}>
                <ThemedView className="w-full shadow-sm border border-gray-100/10 rounded-xl">
                  <View className="w-full justify-between flex-row items-center p-4">
                    <View className="flex-row gap-4 items-center">
                      <View className="rounded-full p-3 bg-[#0EBE7F]/10">
                        <MaterialCommunityIcons
                          name="logout"
                          size={24}
                          color="#0EBE7F"
                        />
                      </View>
                      <ThemedText className="text-lg font-medium">
                        Logout
                      </ThemedText>
                    </View>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color="#0EBE7F"
                      style={{ opacity: 0.8 }}
                    />
                  </View>
                </ThemedView>
              </Pressable>
            </ThemedView>
          ) : (
            // Unauthenticated User Settings
            <ThemedView className="space-y-3">
              <ThemedText >
                Account
              </ThemedText>
              <Link href={"/settings/login"} asChild>
                <Pressable className="active:opacity-80">
                  <ThemedView className="w-full shadow-sm border border-gray-100/10 rounded-xl">
                    <View className="w-full justify-between flex-row items-center p-4">
                      <View className="flex-row gap-4 items-center">
                        <View className="rounded-full p-3 bg-[#0EBE7F]/10">
                          <MaterialCommunityIcons
                            name="login"
                            size={24}
                            color="#0EBE7F"
                          />
                        </View>
                        <ThemedText className="text-lg font-medium">
                          Login
                        </ThemedText>
                      </View>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color="#0EBE7F"
                        style={{ opacity: 0.8 }}
                      />
                    </View>
                  </ThemedView>
                </Pressable>
              </Link>

              <Link href={"/settings/register"} asChild>
                <Pressable className="active:opacity-80 active:text-black">
                  <ThemedView className="w-full shadow-sm border border-gray-100/10 rounded-xl">
                    <View className="w-full justify-between flex-row items-center p-4">
                      <View className="flex-row gap-4 items-center">
                        <View className="rounded-full p-3 bg-[#0EBE7F]/10">
                          <MaterialCommunityIcons
                            name="account-plus"
                            size={24}
                            color="#0EBE7F"
                          />
                        </View>
                        <ThemedText className="text-lg font-medium">
                          Register
                        </ThemedText>
                      </View>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color="#0EBE7F"
                        style={{ opacity: 0.8 }}
                      />
                    </View>
                  </ThemedView>
                </Pressable>
              </Link>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView className="w-full bg-white/5 rounded-xl border border-gray-100/10 p-6">
          <ThemedText className="text-center text-sm opacity-60">
            Version 1.0.0
          </ThemedText>
          <ThemedText className="text-center text-sm opacity-60 mt-1">
            © 2024 Saydaliyati
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
