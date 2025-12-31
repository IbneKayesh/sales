import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const InputCalendar = ({ label, value, onDateChange, placeholder, style }) => {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State for the calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDayPress = (day) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onDateChange?.(formatDate(selectedDate));
    setVisible(false);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty slots for the first week
    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayBox} />);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      const isSelected = value === formatDate(new Date(year, month, i));
      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.dayBox,
            isSelected && { backgroundColor: colors.primary, borderRadius: 8 },
          ]}
          onPress={() => handleDayPress(i)}
        >
          <Text
            style={[
              styles.dayText,
              { color: isSelected ? "#fff" : colors.text },
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: visible ? colors.primary : colors.border,
          },
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.valueText,
            { color: value ? colors.text : colors.subtext },
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.subtext} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View
            style={[
              styles.modalOverlay,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
          >
            <TouchableWithoutFeedback>
              <View
                style={[styles.modalContent, { backgroundColor: colors.card }]}
              >
                <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={() => changeMonth(-1)}>
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.monthTitle, { color: colors.text }]}>
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </Text>
                  <TouchableOpacity onPress={() => changeMonth(1)}>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.weekRows}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <Text
                      key={index}
                      style={[styles.weekDayText, { color: colors.subtext }]}
                    >
                      {day}
                    </Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>{renderCalendar()}</View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[
                      styles.footerButton,
                      { backgroundColor: colors.secondary },
                    ]}
                    onPress={() => {
                      const today = new Date();
                      onDateChange?.(formatDate(today));
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.footerButtonText}>Today</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.footerButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setVisible(false)}
                  >
                    <Text style={styles.footerButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  valueText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weekRows: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    width: 40,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayBox: {
    width: "14.28%", // 100/7
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  dayText: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default InputCalendar;
