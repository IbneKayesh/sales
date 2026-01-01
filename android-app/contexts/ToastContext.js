import React, { createContext, useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Modal } from "react-native";

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
      <Modal
        visible={toast.visible}
        transparent={true}
        animationType="fade"
        pointerEvents="none"
      >
        <View style={styles.modalOverlay} pointerEvents="none">
          <Animated.View
            style={[
              styles.toastContainer,
              { opacity: fadeAnim },
              toast.type === "error" ? styles.errorToast : styles.successToast,
            ]}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
          </Animated.View>
        </View>
      </Modal>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
  },
  toastContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: "90%",
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
