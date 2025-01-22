import { ThemedView } from "@/components/ThemedView";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
import { View, TouchableOpacity, Text, Alert, Platform } from "react-native";
import MapView, { UrlTile, Marker, Polyline } from "react-native-maps";
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

type LocationType = { latitude: number; longitude: number } | null;
type Pharmacy = { id: string; name: string; latitude: number; longitude: number; };

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [route, setRoute] = useState(null);
  const [currentLocation, setCurrentLocation] = useState<LocationType>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access needed');
        return;
      }

      // Get current location with the highest accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      console.log('Current location:', location);

      // Reverse geocode to get the address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
      );
      const locationData = await response.json();

      if (locationData) {
        const newLocation = {
          latitude: parseFloat(locationData.lat),
          longitude: parseFloat(locationData.lon),
        };

        // Update location state and region for map
        setCurrentLocation(newLocation);
        setRegion({
          ...newLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Location fetch failed');
      console.error(error);
    }
  };

  const fetchNearbyPharmacies = async (location: { latitude: number; longitude: number }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=pharmacy&` +
        `lat=${location.latitude}&` +
        `lon=${location.longitude}&` +
        `limit=5`
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const nearbyPharmacies: Pharmacy[] = data.map((place: any) => ({
        id: place.place_id.toString(),
        name: place.display_name.split(',')[0],
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon)
      }));
      
      setPharmacies(nearbyPharmacies);
    } catch (error) {
      Alert.alert('Error', 'Pharmacy search failed: ' + error.message);
      console.error(error);
    }
  };

  const zoomIn = () => {
    setRegion((prev: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta / 2,
      longitudeDelta: prev.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prev: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 2,
      longitudeDelta: prev.longitudeDelta * 2,
    }));
  };

  const findRoute = async () => {
    if (!currentLocation || pharmacies.length === 0) return;

    const nearest = pharmacies.reduce((nearest, pharmacy) => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        pharmacy.latitude,
        pharmacy.longitude
      );
      return distance < nearest.distance ? { pharmacy, distance } : nearest;
    }, { pharmacy: pharmacies[0], distance: Infinity });

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/` +
        `${currentLocation.longitude},${currentLocation.latitude};` +
        `${nearest.pharmacy.longitude},${nearest.pharmacy.latitude}` +
        `?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      if (data.routes?.[0]) {
        setRoute(data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
          latitude: coord[1],
          longitude: coord[0]
        })));
        
        mapRef.current?.animateToRegion({
          latitude: (currentLocation.latitude + nearest.pharmacy.latitude) / 2,
          longitude: (currentLocation.longitude + nearest.pharmacy.longitude) / 2,
          latitudeDelta: Math.abs(currentLocation.latitude - nearest.pharmacy.latitude) * 1.5,
          longitudeDelta: Math.abs(currentLocation.longitude - nearest.pharmacy.longitude) * 1.5
        }, 1000);

        Alert.alert('Route Found', `Distance: ${nearest.distance.toFixed(2)}km`);
      }
    } catch (error) {
      Alert.alert('Error', 'Route calculation failed');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <ThemedView className="mt-7 px-4">
      <ProfileHeader />
      {Platform.OS === 'web' ? (
        <Text>This feature is not available on the web.</Text>
      ) : (
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
      )}
      <View className="flex-row justify-center items-center h-16 mb-5">
        <TouchableOpacity 
          className="bg-teal-500 p-2 rounded flex-1 mx-1" 
          onPress={zoomIn}
        >
          <Text className="text-white text-center font-bold">Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-teal-500 p-2 rounded flex-1 mx-1" 
          onPress={zoomOut}
        >
          <Text className="text-white text-center font-bold">Zoom Out</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-teal-500 p-2 rounded flex-1 mx-1" 
          onPress={findRoute}
        >
          <Text className="text-white text-center font-bold">Find Route</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}