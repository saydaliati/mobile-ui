import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

type Pharmacy = {
  id: string;
  image: string;
  name: string;
  address: string;
  comments: string;
  latitude: number;
  longLatitude: number;
};
const GuardPharmacies = () => {
  const [pharmacies, setPharmacy] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    lat1 = Number(lat1);
    lon1 = Number(lon1);
    lat2 = Number(lat2);
    lon2 = Number(lon2);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      console.log("Invalid coordinates:", { lat1, lon1, lat2, lon2 });
      return "N/A";
    }

    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        console.log("aaaaaa", currentLocation);
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg("Error getting location");
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.1.16:3000/pharmacy");
        const openPharmacies = response.data.filter(
          (pharmacy: any) => pharmacy.status === "open"
        );
        setPharmacy(openPharmacies);
        setFilteredPharmacies(openPharmacies);
      } catch (error) {
        console.log(`There was an error: ${error}`);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredPharmacies(pharmacies);
    } else {
      const filtered = pharmacies.filter((pharmacy) =>
        pharmacy.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPharmacies(filtered);
    }
  };

  return (
    <ScrollView className="p-4">
      <View className="w-full flex-1 flex-row items-center bg-[#0A311D] px-4 rounded-full mb-6">
        <FontAwesome
          name="search"
          size={20}
          color="#0EBE7F"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#A5D6A7"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      {errorMsg && <Text className="text-red-500 mb-2">{errorMsg}</Text>}

      {filteredPharmacies.map((pharmacy, index) => {
        return (
          <TouchableOpacity
            key={index}
            className="mb-3"
            onPress={() => router.push(`/(tabs)/pharmacy/${pharmacy.id}`)}
          >
            <ThemedView className="bg-[#B7ECD9] dark:bg-[#182020]  rounded-xl p-4 flex-row items-center">
              <Image
                source={{ uri: pharmacy.image }}
                className="w-16 h-16 rounded-full mt-[-15]"
              />
              <View className="flex-1">
                <View className="flex-1 ml-4 bg-white dark:bg-black rounded-xl p-3 w-100">
                  <Text className="text-[#0EBE7F] text-lg font-medium">
                    {pharmacy.name}
                  </Text>
                  <Text
                    className="text-gray-600 mt-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {pharmacy.address}
                  </Text>
                </View>
                <View className="flex-row mt-2 justify-between items-center ml-5">
                  <View className="bg-white dark:bg-black px-1.5 rounded-xl">
                    <Text className="text-gray-500 text-sm">
                      <FontAwesome
                        name="commenting-o"
                        size={15}
                        color="#0EBE7F"
                      />
                      {pharmacy.comments}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between w-100">
                    <View className="bg-white dark:bg-black px-1 rounded-xl mr-2">
                      <Text className="text-gray-500 text-sm p-[0.7]">
                        <SimpleLineIcons
                          name="location-pin"
                          size={15}
                          color="#0EBE7F"
                        />{" "}
                        <Text className="text-gray-500 text-sm ">
                          {location &&
                          pharmacy.latitude &&
                          pharmacy.longLatitude
                            ? calculateDistance(
                                location.coords.latitude,
                                location.coords.longitude,
                                pharmacy.latitude,
                                pharmacy.longLatitude
                              )
                            : "Loading..."}
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <MaterialCommunityIcons
                        name="cards-heart-outline"
                        size={18}
                        color="#0cbe7f"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ThemedView>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DFF6E4",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4CAF50",
  },
});

export default GuardPharmacies;
