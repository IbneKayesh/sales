import React, { createContext, useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = useCallback(
    (message, type = "success") => {
      setToast({ visible: true, message, type });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        });
      }, 2000);
    },
    [fadeAnim]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            { opacity: fadeAnim },
            toast.type === "error" ? styles.errorToast : styles.successToast,
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successToast: {
    backgroundColor: "#28a745",
  },
  errorToast: {
    backgroundColor: "#dc3545",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
