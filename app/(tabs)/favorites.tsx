import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FavParmacies from "@/components/ui/Favorites/FavParmacies";
import ProfileHeader from "@/components/ui/Profile header/profile_header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, TextInput, View, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

interface Favorite {
  image: string;
  name: string;
  address: string;
  id: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [pharmacyId, setPharmacyId] = useState<string[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavorite = (id: string) => {
    console.log(`Favorite clicked for pharmacy with id: ${id}`);
    fetch('http://172.16.10.240:3000/favorit/remove', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3ZW11SlZHZExDVnJYY2ZRRjdXYUNPZHU5V0wyIiwiZW1haWwiOiJiYWhpeWU1NjMyQGRvd25sb3IuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzc1NDQ5NTh9.qmHzigL78sF0XSsH33IjjWBEUYDFmp-EMmHZyzq9Tac',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        favorites: id
      })
    })
    .then((response: any) => {
      if (response.ok) {
        Alert.alert("Favorite removed successfully");
        fetchFavorites();
      } else {
        return response.json().then((data: { message?: string }) => {
          throw new Error(data.message || "Error removing favorite");
        });
      }
    })
    .catch(error => {
      Alert.alert('Error removing favorite:', error.message);
    });
  };

  const fetchFavorites = () => {
    fetch('http://172.16.10.240:3000/favorit/get', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3ZW11SlZHZExDVnJYY2ZRRjdXYUNPZHU5V0wyIiwiZW1haWwiOiJiYWhpeWU1NjMyQGRvd25sb3IuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzc1NDQ5NTh9.qmHzigL78sF0XSsH33IjjWBEUYDFmp-EMmHZyzq9Tac'
      }
    })
    .then(response => response.json())
    .then(data => {
      setFavorites(data.favoritesData);
      setPharmacyId(data.pharmacyId);
      console.log(data);
    })
    .catch(error => console.error('Error fetching favorites:', error));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="mt-7 px-4">
        <ProfileHeader />
        <View className="flex-row items-center my-3 px-4 bg-[#80ecbf] rounded-full">
          <Ionicons name="search-outline" size={24} color="white" />
          <TextInput placeholder="Search..." style={{ fontSize: 20, width: '90%' }} />
        </View>
        {
          favorites.length > 0 ?
          favorites.map((favorite: Favorite, index: number) => {
            const id = pharmacyId[index];
            console.log(id);
            return (
              <FavParmacies
                key={`${favorite.id}-${index}`}
                image={{ uri: `${favorite.image}` }}
                name={favorite.name}
                address={favorite.address}
                handleFavorite={() => handleFavorite(id)}
              />
            );
          }) : <Text className="text-center text-2xl">No favorites found</Text>
        }
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}
