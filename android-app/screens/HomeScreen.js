import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";

export default function HomeScreen() {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);

  return (
    <View style={globalStyles.centerContainer}>
      <Text style={globalStyles.title}>Home Screen</Text>
      <Text style={globalStyles.subtext}>Welcome back to your app!</Text>
    </View>
  );
}
