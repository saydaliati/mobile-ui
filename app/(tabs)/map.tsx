import { ThemedView } from "@/components/ThemedView";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { UrlTile, Marker, Polyline } from "react-native-maps";
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import axios from "axios";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

type Pharmacy = { id: string; name: string; latitude: Double; longLatitude: Double; };

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [route, setRoute] = useState<any[]>([]); 
  const [nearestPharmacy, setNearestPharmacy] = useState<Pharmacy | null>(null); 


  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
      const fetchPharmacies = async () => {
        try {
          const response = await axios.get("http://172.16.10.240:3000/pharmacy");
          
          console.log("Pharmacy API Response:", response.data);
          setPharmacies(response.data);
        } catch (error) {
          console.log(`Error fetching pharmacies: ${error}`);
        }
      };
      fetchPharmacies();   
    
  }, []);


  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // setCurrentLocation(newLocation);
      mapRef.current?.animateToRegion({
        ...newLocation,
        latitudeDelta: 0.002,
        longitudeDelta: 0.001,
      });

      // fetchNearbyPharmacies(newLocation);
    } catch (error) {
      Alert.alert("Location Error", "Unable to fetch location.");
    }
  };

  // const fetchNearbyPharmacies = async (location: { latitude: number; longitude: number }) => {
  //   try {
  //     // Use the already fetched pharmacies from state
  //     // findNearestPharmacy(location, pharmacies); // Use the pharmacies state directly
  //   } catch (error) {
  //     Alert.alert("Error", "Unable to fetch pharmacies.");
  //   }
  // };

  // const findNearestPharmacy = (location: { latitude: number; longitude: number }, pharmacies: Pharmacy[]) => {
  //   if (pharmacies.length === 0) return;

  //   const nearestPharmacy = pharmacies.reduce((nearest, pharmacy) => {
  //     const distance = calculateDistance(location.latitude, location.longitude, pharmacy.latitude, pharmacy.longLatitude);
  //     return distance < nearest.distance ? { pharmacy, distance } : nearest;
  //   }, { pharmacy: pharmacies[0], distance: Infinity }).pharmacy;

  //   setNearestPharmacy(nearestPharmacy); // Set the nearest pharmacy in state

  //   Alert.alert("Nearest Pharmacy", `The nearest pharmacy is ${nearestPharmacy.name}.`, [
  //     {
  //       text: "Show Route",
  //       onPress: () => fetchRoute(location, nearestPharmacy),
  //     },
  //     { text: "Cancel", style: "cancel" },
  //   ]);
  // };

  // const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  //   const R = 6371; // Radius of the Earth in km
  //   const dLat = (lat2 - lat1) * Math.PI / 180;
  //   const dLon = (lon2 - lon1) * Math.PI / 180;
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(lat1 * Math.PI / 180) *
  //     Math.cos(lat2 * Math.PI / 180) *
  //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c; // Distance in km
  // };

  // const fetchRoute = async (start: { latitude: number; longitude: number }, destination: Pharmacy) => {
  //   const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${destination.longLatitude},${destination.latitude}?overview=full&geometries=geojson`;

  //   try {
  //     const response = await fetch(osrmUrl);
  //     const data = await response.json();

  //     if (data.routes && data.routes[0]) {
  //       const routeCoords = data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
  //         latitude: coord[1],
  //         longitude: coord[0],
  //       }));

  //       setRoute(routeCoords);
  //       // Alert.alert("Route Found", `Route to ${destination.name} found.`);
  //     } else {
  //       Alert.alert("OSRM Error", "No route found.");
  //     }
  //   } catch (error) {
  //     console.error("Route fetch error:", error);
  //     Alert.alert("Network Error", "Unable to fetch route. Check your connection.");
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation
      >
        
        {/* {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longLatitude,
            }}
            title={pharmacy.name}
          />
        ))}  */}
        {/* Nearest pharmacy marker */}
        {/* {nearestPharmacy && (
          <Marker
            coordinate={{
              latitude: nearestPharmacy.latitude,
              longitude: nearestPharmacy.longLatitude,
            }}
            title={nearestPharmacy.name}
            pinColor="blue" // Change color to differentiate
          />
        )} */}
        {/* Polyline for the route */}
        {/* {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="red"
            strokeWidth={6}
            lineDashPattern={[1, 1]}
          />
        )} */}
      </MapView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: 'teal', padding: 10, borderRadius: 5, margin: 5 }}
          // onPress={getCurrentLocation}
        >
          <Text style={{ color: 'white' }}>Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'teal', padding: 10, borderRadius: 5, margin: 5 }}
          
        >
          <Text style={{ color: 'white' }}>Find Nearest Pharmacy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
