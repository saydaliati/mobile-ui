import { IconSymbol } from "@/components/ui/IconSymbol";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";


export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: "Register",
          tabBarIcon: ({ color }) => <Ionicons name="person-add-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
