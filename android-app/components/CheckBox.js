import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const CheckBox = ({ label, value, onValueChange, style }) => {
  const { colors } = useTheme();
  // Support string "0"/"1", number 0/1, or boolean
  const isChecked = value === 1 || value === "1" || value === true;

  const handlePress = () => {
    // Return numeric status as requested (0 or 1)
    onValueChange?.(isChecked ? 0 : 1);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: isChecked ? colors.primary : colors.border,
            backgroundColor: isChecked ? colors.primary : "transparent",
          },
        ]}
      >
        {isChecked && <Ionicons name="checkmark" size={18} color="#fff" />}
      </View>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CheckBox;
