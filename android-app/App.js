import * as React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// tab screens
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import TenantScreen from "./screens/TenantScreen";
import TodoScreen from "./screens/TodoScreen";

// hidden screens
import FlatScreen from "./screens/FlatScreen";
import FeatureScreen from "./screens/FeatureScreen";

// Header right user icon with dropdown (simple example using Alert)
import HeaderRight from "./components/HeaderRight";

// Bottom Tabs
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: route.name, // Left title
        headerRight: () => <HeaderRight />, // Right user icon
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Tenant") iconName = "person-outline";
          else if (route.name === "Settings") iconName = "settings-outline";
          else if (route.name === "Todo") iconName = "list-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray", 
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tenant" component={TenantScreen} />
      <Tab.Screen name="Todo" component={TodoScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Bottom Tabs */}
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />

            {/* Hidden screens */}
            <Stack.Screen
              name="FlatScreen"
              component={FlatScreen}
              options={({ route }) => ({
                title: route.params?.title ?? "Flats",
              })}
            />
            <Stack.Screen
              name="FeatureScreen"
              component={FeatureScreen}
              options={({ route }) => ({
                title: route.params?.title ?? "Features",
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </ThemeProvider>
  );
}
