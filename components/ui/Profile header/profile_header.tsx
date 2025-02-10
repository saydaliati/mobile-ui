import { ThemedView } from "@/components/ThemedView";
import { Image, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";

export default function ProfileHeader() {
  const user = useAppSelector((state) => state.auth.user);
//   console.log(user);
  
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <ThemedView className="my-3">
      <View className="flex-row justify-between">
        <View >
          {isAuth ? (
            <View className="flex-row items-center">
              <View className="flex-row justify-center items-center rounded-full w-[40px] h-[40px] bg-[#0EBE7F]">
                <Ionicons name="person-outline" color="white" size={24} />
              </View>
              <View className="flex-col ml-2 ">
                <ThemedText className="color-[#0EBE7F]">
                  Hi, {user?.name}
                </ThemedText>
              </View>
            </View>
            
          ) : (
            <View className="flex-row items-center">
              <Image
                      className="w-full h-16"
                      source={require("@/assets/images/saydaliyati-logo.png")}
                      resizeMode="contain"
                    />
            </View>
          )}
        </View>
      </View>
    </ThemedView>
  );
}
