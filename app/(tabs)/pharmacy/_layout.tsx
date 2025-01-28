import { Stack } from "expo-router";

export default function PharmacyLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]"
        options={{
          headerShown: true,
          title: "Pharmacy Details",
          headerBackTitle: "Back",
          presentation: "card"
        }}
        
      />
    </Stack>
  );
}