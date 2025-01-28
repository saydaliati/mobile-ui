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
// Import your register action
import { registerUser } from "@/store/actions/AuthActions";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const validateForm = () => {
    setValidationError("");
    
    if (!email || !password || !confirmPassword) {
      setValidationError("All fields are required");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    // Basic password validation
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Uncomment and update with your register action
      await dispatch(registerUser({ email, password }));
      Alert.alert("Registration Successful", "Please validate your email to login.");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
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
          Join us and get started!
        </ThemedText>
        
        <ThemedText className="dark:text-white font-poppins text-sm text-center">
          Find on-duty pharmacies near you with ease.
        </ThemedText>

        <ThemedText className="dark:text-white font-poppins text-sm text-center">
          #Saydaliati is here for your health!
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

        <TextInput
          className="w-full px-4 py-3 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg"
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setValidationError("");
          }}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          className="w-full px-4 py-3 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg"
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setValidationError("");
          }}
          secureTextEntry
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
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">Register</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Link href="./login" className="text-[#0EBE8F] font-poppins">
          Already have an account? Login
        </Link>
      </View>
    </ThemedView>
  );
}