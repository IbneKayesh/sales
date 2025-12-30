import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const Button = ({
  title,
  onPress,
  type = "primary",
  style,
  textStyle,
  iconName,
  iconSize = 20,
  iconColor,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    switch (type) {
      case "success":
        return { backgroundColor: colors.success };
      case "danger":
        return { backgroundColor: colors.danger };
      case "secondary":
        return { backgroundColor: colors.secondary };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        !title && styles.iconOnly,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={iconSize}
          color={iconColor || "#fff"}
          style={title ? { marginRight: 8 } : {}}
        />
      )}
      {title && <Text style={[styles.text, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconOnly: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 50,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
