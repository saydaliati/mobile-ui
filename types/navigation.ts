import { Pharmacy } from "./pharmacy";

export type RootStackParamList = {
  Main: undefined;
  PharmacyDetails: { pharmacy: Pharmacy };
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};
