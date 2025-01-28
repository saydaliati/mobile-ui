import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface CustomTabNavigationProps {
  tabs: Tab[];
  activeColor?: string;
  inactiveColor?: string;
  textActiveColor?: string;
  textInactiveColor?: string;
  containerStyle?: ViewStyle;
  tabContainerStyle?: ViewStyle;
  tabButtonStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
}

const CustomTabNavigation: React.FC<CustomTabNavigationProps> = ({
  tabs,
  activeColor = '#4CAF50',
  inactiveColor = '#e0e0e0',
  textActiveColor = '#fff',
  textInactiveColor = '#666',
  containerStyle,
  tabContainerStyle,
  tabButtonStyle,
  tabTextStyle,
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '');

  const renderContent = (): React.ReactNode => {
    const activeContent = tabs.find(tab => tab.id === activeTab)?.content;
    return (
      <View style={styles.contentContainer}>
        {activeContent}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.tabContainer, tabContainerStyle]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              {
                backgroundColor: 
                  activeTab === tab.id ? activeColor : inactiveColor,
              },
              tabButtonStyle,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: 
                    activeTab === tab.id ? textActiveColor : textInactiveColor,
                },
                tabTextStyle,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
});

export default CustomTabNavigation;