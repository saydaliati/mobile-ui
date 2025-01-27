import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
type SinglePharmacy = {
  id: string;
  image: string;
  name: string;
  address: string;
  comments: string;
  telephone: string;
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
  const [singlePharmacy, setSinglePharmacy] = useState<SinglePharmacy | null>(
    null
  );
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.16:3000/pharmacy/${id}`
        );
        setSinglePharmacy(response.data);
      } catch (err) {
        console.error("Error fetching pharmacy details:", err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!singlePharmacy) return <Text>Loading...</Text>;

  const handlephone = async (phoneNumber: string) => {
    console.log("press", phoneNumber);
    await Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#111111]">
      <View className="mx-5">
        <ProfileHeader />
      </View>

      <View className="w-[90%] m-auto z-1">
        <Image
          source={{ uri: singlePharmacy.image }}
          className="w-100 h-48 rounded-3xl"
        />
      </View>

      <View className=" m-auto -top-10 w-[90%]  bg-[#b8ecd9] dark:bg-[#242323] rounded-3xl p-4 z-[-1] pt-12">
        <View className="items-center mt-2 rounded-lg bg-white dark:bg-black p-3">
          <Text className="text-xl text-[#0EBE7F] tracking-widest font-bold text-center">
            {singlePharmacy.name}
          </Text>
          <Text className="text-gray-500 dark:text-gray-300 text-center mt-1">
            {singlePharmacy.address}
          </Text>

          <View className="flex-row items-center justify-center mt-3">
            <TouchableOpacity className="flex-row rounded-full bg-[#0EBE7F] items-center px-1 py-0.5">
              <FontAwesome name="phone" size={16} color="#fff" />
            </TouchableOpacity>
            <Text
              className="text-[#0EBE7F] ml-2"
              onPress={() => handlephone(singlePharmacy.telephone)}
            >
              {singlePharmacy.telephone}
            </Text>
          </View>
        </View>
        <View>
          <View className="flex-row items-center justify-between w-full mt-3">
            <View className="flex-row items-center rounded-full bg-white dark:bg-black px-1.5">
              <FontAwesome name="comment-o" size={16} color="#0EBE7F" />
              <Text className="ml-2 text-[#0EBE7F]">40</Text>
            </View>
            <View className="flex-row items-center rounded-full bg-white dark:bg-black px-1.5">
              <FontAwesome name="clock-o" size={16} color="#0EBE7F" />
              <Text className="ml-2 text-black dark:text-white">Mon-Sat /</Text>
              <Text className="ml-2 text-[#0EBE7F]">
                {singlePharmacy.openHours}AM, {singlePharmacy.closeHours}PM
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between w-full mt-3">
            {singlePharmacy.isOpen ? (
              <View className="mt-3 flex-row items-center bg-black space-x-2 px-2 py-1 rounded-full ">
                <FontAwesome6 name="door-open" size={12} color="yellow" />
                <Text className="text-yellow-400">open</Text>
              </View>
            ) : (
              <View className="mt-3 flex-row items-center bg-black space-x-2 rounded-full py-1 px-2">
                <FontAwesome6 name="door-closed" size={12} color="red" />
                <Text className="text-red-500">closed</Text>
              </View>
            )}
            <View className="flex-row gap-2">
              <View className="flex-row items-center rounded-full bg-white dark:bg-black px-1.5 py-1">
                <FontAwesome6 name="share-nodes" size={16} color="#0EBE7F" />
              </View>
              <View className="flex-row items-center rounded-full bg-white dark:bg-black px-1.5 py-1">
                <FontAwesome6 name="heart" size={16} color="red" />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-6 mx-4">
        <View className="self-center bg-[#0EBE7F] font-bold mb-4 space-x-2 flex-row items-center rounded-full px-2 py-1">
          <Ionicons name="star-outline" size={20} color="#fff" />
          <Text className="w-fit uppercase text-white tracking-widest font-poppins font-bold" >Reviews</Text>
        </View>

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
            className="flex-1 bg-[#0A311D] rounded-full text-white  px-4 py-2 mr-2"
            placeholder="Enter Your Comment Here..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            className="bg-[#0EBE7F] rounded-full px-6 py-2"
            onPress={() => {
              /* Handle adding review */
            }}
          >
            <Text className="text-white">Add Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PharmacyDetails;
