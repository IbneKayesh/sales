import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <Text style={globalStyles.subtext}>
        Customize your application experience
      </Text>

      <View style={[globalStyles.card, { width: "100%" }]}>
        <View>
          <Text style={[globalStyles.text, { fontWeight: "bold" }]}>
            Dark Mode
          </Text>
          <Text style={[globalStyles.subtext, { marginBottom: 0 }]}>
            {isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
          </Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: colors.primary }}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
        />
      </View>
    </View>
  );
}
