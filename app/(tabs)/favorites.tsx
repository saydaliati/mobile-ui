import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FavParmacies from "@/components/ui/Favorites/FavParmacies";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, TextInput, View, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from "react-native";

export default function FavoritesScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="mt-7 px-4">
        <ProfileHeader />
        <View className="flex-row items-center my-3 px-4 bg-[#80ecbf]  rounded-full" >
          <Ionicons name="search-outline" size={24} color="white" />
          <TextInput placeholder="Search..." style={{ fontSize: 20 , width: '90%'}} />
        </View>
        <View className="flex-row justify-between h-16 mb-5">
          <TouchableOpacity className="flex-row justify-center items-center w-[170px] my-3 px-4 bg-[#0EBE7F] rounded-full">
            <View>
              <Text style={{ color: 'white', fontSize: 20 }}>All Pharmacies</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row justify-center items-center w-[170px] my-3 bg-[#82e0bf] rounded-full">
            <View>
              <Text style={{ color: '#0EBE7F', fontSize: 20 }}>Phamacy Gard</Text>
            </View>
          </TouchableOpacity>
        </View>
        <FavParmacies 
          image={require('@/assets/images/Logo.png')} 
          name="Pharmacy Gard" 
          address="123 Main St, Anytown, USA" 
        />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}