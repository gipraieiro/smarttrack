
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AlertsScreen from "../screens/AlertsScreen";
import VegetationDetailsScreen from "../screens/VegetationDetailsScreen";
import NewOccurrenceScreen from "../screens/NewOccurrenceScreen";

export type NewOccurrence = {
  id: number;
  placeName?: string;
  location: string;
  km?: string;
  height: number; // Altura em centímetros
  temperature: number;
  humidity: number;
  description: string;
  risk: "Alto" | "Médio" | "Baixo";
  createdAt: string;
};

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Alerts: undefined;

  Details: {
    alertId: number;
    occurrence?: NewOccurrence;
  };

  NewOccurrence: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />

        <Stack.Screen
          name="Alerts"
          component={AlertsScreen}
        />

        <Stack.Screen
          name="Details"
          component={VegetationDetailsScreen}
        />

        <Stack.Screen
          name="NewOccurrence"
          component={NewOccurrenceScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}