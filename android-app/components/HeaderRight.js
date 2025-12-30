import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";

export default function HeaderRight() {
  return (
    <TouchableOpacity onPress={() => Alert.alert("Menu", "User menu options")}>
      <Ionicons name="person-circle-outline" size={30} color="black" />
    </TouchableOpacity>
  );
}