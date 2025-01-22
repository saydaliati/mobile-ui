// app/(tabs)/homeScreen/Pharmacies.tsx
import { View,StyleSheet } from 'react-native';
import React from 'react';
import CustomTabNavigation from '@/components/CustomTabNavigation';
import { ThemedView } from '@/components/ThemedView';
import AllPharmacies from '../+homeScreen/Pharmacies';
import GuardPharmacies from '../+homeScreen/GuardPharmacies';

const Pharmacies = () => {
  const tabs = [
    {
      id: 'Pharmacies',
      label: 'All Pharmacies',
      content: <AllPharmacies />,
    },
    {
      id: 'GuardPharmacies',
      label: 'Pharmacy Gard',
      content: <GuardPharmacies />,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <CustomTabNavigation
        tabs={tabs}
        activeColor="#4CAF50"
        inactiveColor="#e0e0e0"
        textActiveColor="#fff"
        textInactiveColor="#666"
        tabContainerStyle={styles.tabContainer}
        tabTextStyle={styles.tabText}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:100
  },
  tabContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  tabText: {
    fontWeight: 'bold',
  },
});

export default Pharmacies;