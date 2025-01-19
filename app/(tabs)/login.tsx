import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "../../store/slices/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      // You might want to add local form validation here
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      // Error handling is managed by Redux
    }
  };

  return (
    <SafeAreaView className="flex-1 h-full bg-gray-300 dark:bg-black p-6 justify-between items-center">
      <Image
        className="w-full h-28 "
        source={require("@/assets/images/saydaliyati-logo.png")}
      />

      <View className="space-y-4 w-full m-4">
        <Text className="text-2xl dark:text-[#0EBE8F] font-poppins font-bold uppercase text-center">
          Welcome back !
        </Text>
        <Text className="dark:text-white font-poppins text-sm text-center">
          Find pharmacies and access care with Saydaliati!
        </Text>
        <TextInput
          className="w-full px-4 dark:text-white py-3 border border-gray-300 rounded-lg"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="w-full px-4 py-3 dark:text-white border border-gray-300 rounded-lg"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="flex-row self-end justify-between mt-4">
          <Link href="/register" className="text-[#0EBE8F] font-poppins  ">
            Forgot Password ?
          </Link>
          {/* <Link href="/forgot-password" className="text-blue-500">
            Forgot password?
          </Link> */}
        </View>

        {error && <Text className="text-red-500 text-center">{error}</Text>}

        <TouchableOpacity
          className="w-full  rounded-full bg-[#0EBE8F] py-3 "
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mb-4 ">
        <Link href="/register" className="text-[#0EBE8F]">
          Don't have an account yet ? Join us
        </Link>
      </View>
    </SafeAreaView>
  );
}
