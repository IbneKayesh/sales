import React, { createContext, useState, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const colors = useMemo(
    () => ({
      background: isDarkMode ? "#121212" : "#f8f9fa",
      card: isDarkMode ? "#1e1e1e" : "#ffffff",
      text: isDarkMode ? "#ffffff" : "#1a1a1a",
      subtext: isDarkMode ? "#aaaaaa" : "#666666",
      border: isDarkMode ? "#333333" : "#f0f0f0",
      primary: "#007AFF",
      success: "#28a745",
      danger: "#dc3545",
      secondary: "#6c757d",
      modalOverlay: "rgba(0,0,0,0.6)",
    }),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
