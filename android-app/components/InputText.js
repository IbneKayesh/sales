import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const InputText = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: disabled ? colors.subtext : colors.text },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: disabled ? colors.border : colors.card,
            color: disabled ? colors.subtext : colors.text,
            borderColor: disabled
              ? colors.border
              : isFocused
              ? colors.primary
              : colors.border,
          },
          isFocused && !disabled && styles.inputFocused,
        ]}
        value={value}
        onChangeText={disabled ? undefined : onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={!disabled}
        selectTextOnFocus={!disabled}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={colors.subtext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
});

export default InputText;
