import { ThemedView } from "@/components/ThemedView";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { UrlTile, Marker, Polyline } from "react-native-maps";
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

type LocationType = { latitude: number; longitude: number } | null;
type Pharmacy = { id: string; name: string; latitude: number; longitude: number; };

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [route, setRoute] = useState(null);
  const [currentLocation, setCurrentLocation] = useState<LocationType>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPharmacies();
    }
  }, [currentLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Permission", "Permission to access location was denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(newLocation);
      setRegion({
        ...newLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      mapRef.current?.animateToRegion({
        ...newLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch location. Please try again.");
    }
  };

  const fetchNearbyPharmacies = async () => {
    if (!currentLocation) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=pharmacy&` +
        `lat=${currentLocation.latitude}&` +
        `lon=${currentLocation.longitude}&` +
        `limit=5`
      );
      
      const data = await response.json();
      const nearbyPharmacies: Pharmacy[] = data.map((place: any, index: number) => ({
        id: place.place_id.toString(),
        name: place.display_name.split(',')[0],
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon)
      }));
      
      setPharmacies(nearbyPharmacies);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch nearby pharmacies.");
    }
  };

  const findRouteToNearestPharmacy = async () => {
    if (!currentLocation || pharmacies.length === 0) {
      Alert.alert("Error", "Location or pharmacies not available");
      return;
    }

    let nearestPharmacy = pharmacies[0];
    let shortestDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      pharmacies[0].latitude,
      pharmacies[0].longitude
    );

    pharmacies.forEach((pharmacy) => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        pharmacy.latitude,
        pharmacy.longitude
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestPharmacy = pharmacy;
      }
    });

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/` +
        `${currentLocation.longitude},${currentLocation.latitude};` +
        `${nearestPharmacy.longitude},${nearestPharmacy.latitude}` +
        `?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        setRoute(data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
          latitude: coord[1],
          longitude: coord[0]
        })));

        const bounds = {
          latitude: (currentLocation.latitude + nearestPharmacy.latitude) / 2,
          longitude: (currentLocation.longitude + nearestPharmacy.longitude) / 2,
          latitudeDelta: Math.abs(currentLocation.latitude - nearestPharmacy.latitude) * 1.5,
          longitudeDelta: Math.abs(currentLocation.longitude - nearestPharmacy.longitude) * 1.5
        };

        mapRef.current?.animateToRegion(bounds, 1000);
        Alert.alert("Route Found", `Route to ${nearestPharmacy.name} (${shortestDistance.toFixed(2)}km away)`);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to find route. Please try again.");
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <ThemedView className="mt-7 px-4">
      <ProfileHeader />
      <View className="flex-row justify-center items-center h-[70%] my-1 w-full bg-[#80ecbf] rounded-lg">
        <View className="flex-row justify-center items-center w-[95%] h-[95%] rounded-lg">
          <MapView
            ref={mapRef}
            style={{ flex: 1, width: "100%", height: "100%" }}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="You are here"
                description="Current location"
              />
            )}
            {pharmacies.map((pharmacy) => (
              <Marker
                key={pharmacy.id}
                coordinate={{
                  latitude: pharmacy.latitude,
                  longitude: pharmacy.longitude,
                }}
                title={pharmacy.name}
              />
            ))}
            {route && (
              <Polyline
                coordinates={route}
                strokeColor="#000"
                strokeWidth={3}
              />
            )}
          </MapView>
        </View>
      </View>
      <View className="flex-row justify-center items-center h-16 mb-5">
        <TouchableOpacity 
          className="bg-teal-500 p-2 rounded flex-1 mx-1" 
          onPress={getCurrentLocation}
        >
          <Text className="text-white text-center font-bold">Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-teal-500 p-2 rounded flex-1 mx-1" 
          onPress={findRouteToNearestPharmacy}
        >
          <Text className="text-white text-center font-bold">Find Route</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}