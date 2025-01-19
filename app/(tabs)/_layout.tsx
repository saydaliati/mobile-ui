import { IconSymbol } from '@/components/ui/IconSymbol';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false }} > 
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <IconSymbol name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <IconSymbol name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Get in',
          tabBarIcon: ({ color }) => <IconSymbol name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}