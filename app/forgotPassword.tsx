import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ForgotPassword } from "@/store/actions/AuthActions";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validateForm = () => {
    setValidationError("");


    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(ForgotPassword(email));
      Alert.alert('Success', 'Password reset link sent to your email');
      router.replace("/(tabs)");
    } catch (error:any) {
      Alert.alert(
        "An error occurred during forgot password:",
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <ThemedView className="flex-1 h-full dark:bg-black p-6 justify-center items-center">
      <Image
        className="w-full h-28"
        source={require("@/assets/images/saydaliyati-logo.png")}
        resizeMode="contain"
      />

      <View className="space-y-4 w-full m-4">
        <ThemedText className="text-2xl dark:text-[#0EBE8F] font-poppins font-bold uppercase text-center">
          Forgot your password ?
        </ThemedText>
        
        <ThemedText className="dark:text-white font-poppins text-sm text-center">
          Please enter your email to receive a recovery link !
        </ThemedText>

        <TextInput
          className="w-full px-4 dark:text-white py-3 border border-gray-300 dark:border-gray-700 rounded-lg"
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setValidationError("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />


        {(validationError || error) && (
          <Text className="text-red-500 text-center">
            {validationError || error}
          </Text>
        )}

        <TouchableOpacity
          className={`w-full rounded-full py-3 ${
            loading ? "bg-[#0EBE8F]/70" : "bg-[#0EBE8F]"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}