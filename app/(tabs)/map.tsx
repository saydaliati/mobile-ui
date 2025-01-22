import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapView, { Marker } from 'react-native-maps';
import ProfileHeader from "@/components/ui/Profile header/profile_header";
import { Alert, View } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';

export default function FavoritesScreen() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Permission Denied',
          'Please enable location services to find nearby pharmacies.'
        );
        return;
      }

      try {
        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('Error getting location');
        Alert.alert('Error', 'Unable to get your current location');
      }
    })();
  }, []);

  const initialRegion = {
    latitude: location?.coords.latitude || 0,
    longitude: location?.coords.longitude || 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return (
    <ThemedView className="mt-7 px-4">
      <ProfileHeader />
      <View className="flex-row justify-center items-center h-[90%] my-1 w-full bg-[#80ecbf] rounded-lg" >
        <View className="flex-row justify-center items-center w-[95%] h-[95%] rounded-lg">
        <MapView 
        className="w-full h-full"
        initialRegion={initialRegion}
        region={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        )}
      </MapView>
        </View>

      </View>
    </ThemedView>
  );
}