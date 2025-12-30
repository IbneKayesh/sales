import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);

  return (
    <View style={globalStyles.centerContainer}>
      <Text style={globalStyles.title}>Profile Screen</Text>
      <Text style={globalStyles.subtext}>Manage your personal information</Text>
    </View>
  );
}
