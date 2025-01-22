import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Platform } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from "axios";
import * as Location from 'expo-location';

const Pharmacies = () => {
  const [pharmacies, setPharmacy] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        console.log('aaaaaa',currentLocation);
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pharmacy');
        setPharmacy(response.data);
      } catch (error) {
        console.log(`There was an error: ${error}`);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView className="p-4">
      {errorMsg && <Text className="text-red-500 mb-2">{errorMsg}</Text>}
      {pharmacies.map((pharmacy, index) => (
        <TouchableOpacity key={index} className="mb-3">
          <ThemedView className="bg-[#cbf1e3] rounded-xl p-4 flex-row items-center">
            <Image
              source={{ uri: pharmacy.image }}
              className="w-16 h-16 rounded-lg"
            />
            <View className="flex-1">
              <View className="flex-1 ml-4 bg-white rounded-xl p-3 w-100">
                <Text className="text-green-500 text-lg font-medium">
                  {pharmacy.name}
                </Text>
                <Text className="text-gray-600 mt-1">{pharmacy.address}</Text>
              </View>
              <View className="flex-row mt-2 justify-between items-center ml-5">
                <View className="bg-white px-1 rounded-xl">
                  <Text className="text-gray-500 text-sm">
                    <FontAwesome name="commenting-o" size={15} color="#0cbe7f" /> {pharmacy.comments}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between w-100">
                  <View className="bg-white px-1 rounded-xl mr-2">
                    <Text className="text-gray-500 text-sm">
                      <SimpleLineIcons name="location-pin" size={15} color="#0cbe7f" />
                      {' '}
                      <Text className="text-gray-500 text-sm">
                          {location && pharmacy.latitude && pharmacy.longLatitude  
                            ? calculateDistance(
                              location.coords.latitude,
                              location.coords.longitude,
                              pharmacy.latitude,
                              pharmacy.longLatitude  
                            )
                            : 'Loading...'}
                        </Text>
                      </Text>
                  </View>
                  <TouchableOpacity>
                    <MaterialCommunityIcons name="cards-heart-outline" size={18} color="#0cbe7f" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ThemedView>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Pharmacies;