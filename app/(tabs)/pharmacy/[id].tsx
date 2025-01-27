import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
type SinglePharmacy = {
  id: string;
  image: string;
  name: string;
  address: string;
  comments: string;
  phone: string;
  openingHours: string;
  isOpen: boolean;
  rating: number;
  openHours: string;
  closeHours: string;
  reviews: Array<{
    name: string;
    comment: string;
    avatar: string;
  }>;
};

const PharmacyDetails = () => {
  const { id } = useLocalSearchParams();
  const [singlePharmacy, setSinglePharmacy] = useState<SinglePharmacy | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.16:3000/pharmacy/${id}`);
        setSinglePharmacy(response.data);
      } catch (err) {
        console.error("Error fetching pharmacy details:", err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!singlePharmacy) return <Text>Loading...</Text>;


  const handlephone = async(phoneNumber: string)  =>{
    console.log('press', phoneNumber);
    await Linking.openURL(`tel:${phoneNumber}`)
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="mx-5">
        <ProfileHeader />
      </View>

      <View className="w-[93%] m-auto z-1"> 
        <Image
          source={{ uri: singlePharmacy.image }}
          className="w-100 h-48 rounded-3xl"
        />
      </View>

      <View className="mx-4 -mt-8  bg-[#b8ecd9] rounded-xl p-4 z-[-1] pt-12">
        <View className="items-center border border-[#0EBE7F] rounded-lg bg-white p-3">
          <Text className="text-xl font-bold text-center">{singlePharmacy.name}</Text>
          <Text className="text-gray-500 text-center mt-1">{singlePharmacy.address}</Text>
          
          <TouchableOpacity className="flex-row items-center mt-2">
            <FontAwesome name="phone" size={16} color="#0EBE7F" />
            <Text className="text-[#0EBE7F] ml-2" onPress={()=>handlephone(singlePharmacy.phone)}>{singlePharmacy.phone}</Text>
          </TouchableOpacity>

         
          <View className="flex-row items-center justify-between w-full mt-3">
            <View className="flex-row items-center">
              <FontAwesome name="clock-o" size={16} color="#0EBE7F" />
              <Text className="ml-2 text-gray-600">Mon-Sat / {singlePharmacy.openHours}AM, {singlePharmacy.closeHours}PM</Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="comment-o" size={16} color="#0EBE7F" />
              <Text className="ml-2 text-gray-600">40</Text>
            </View>
          </View>

          <View className="mt-3">
            {singlePharmacy.isOpen ? 
            
            <Text className="bg-[#0EBE7F] text-white px-4 py-1 rounded-full">opened</Text>
            :
            <Text className="bg-red-500 text-white px-4 py-1 rounded-full">closed</Text>

            }
          </View>
        </View>
      </View>

      <View className="mt-6 mx-4">
        <Text className="text-lg font-bold mb-4 flex-row items-center">
          <Ionicons name="star" size={20} color="#0EBE7F" /> Reviews
        </Text>

        {singlePharmacy.reviews?.map((review, index) => (
          <View key={index} className="bg-[#E8F8F2] rounded-xl p-4 mb-3">
            <View className="flex-row items-center">
              <Image
                source={{ uri: review.avatar }}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-3">
                <Text className="font-bold">{review.name}</Text>
                <Text className="text-gray-600 mt-1">{review.comment}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="flex-row items-center mt-4 mb-20">
          <TextInput
            className="flex-1 bg-[#E8F8F2] rounded-full px-4 py-2 mr-2"
            placeholder="Enter Your Comment Here..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity 
            className="bg-[#0EBE7F] rounded-full px-6 py-2"
            onPress={() => {/* Handle adding review */}}
          >
            <Text className="text-white">Add Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PharmacyDetails;