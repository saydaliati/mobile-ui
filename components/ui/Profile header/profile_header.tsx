import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";

export default function ProfileHeader() {

    const { user } = useAppSelector((state) => state.auth);
    return (
        <ThemedView className="my-3">
            <View className="flex-row justify-between">
                <View className="flex-row items-center">
                    <View className="flex-row justify-center items-center rounded-full w-[40px] h-[40px] bg-[#0EBE7F]">
                        <Ionicons name="person-outline" color="white" size={24} />
                    </View>
                    <View className="flex-col ml-2 ">
                        <ThemedText className="color-[#0EBE7F]">Hi, {user?.name || "Ahmed"}</ThemedText>
                    </View>
                </View>
                <View className="flex-row justify-center items-center w-[40px] h-[40px] bg-[#0EBE7F] rounded-full p-1 ">
                    <Ionicons name="notifications-outline" color="white" size={24} />
                    <View className="absolute top-[10px] right-[11px] w-[8px] h-[8px] bg-red-500 rounded-full"></View>
                </View>
            </View>
        </ThemedView>
    )
}