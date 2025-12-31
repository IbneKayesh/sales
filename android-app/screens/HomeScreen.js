import {
  View,
  Text,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

//internal states
import { getAll, getById, add, update, deleteById } from "../db/houseDal";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";
import Button from "../components/Button";
import Fab from "../components/Fab";
import InputText from "../components/InputText";
import { generalRulesOptions } from "../db/vtable";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    image: "",
    map_link: "",
    general_rules: "",
  });
  const [houseList, setHouseList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [selectedGeneralRules, setSelectedGeneralRules] = useState([]);
  const generalRulesMap = Object.fromEntries(
    generalRulesOptions.map((r) => [r.value, r.name])
  );

  const fetchHouses = async () => {
    // start refresh
    setRefreshing(true);

    try {
      const houses = await getAll();
      setHouseList(houses);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // stop refresh
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleCloseModalPress = () => {
    setShowAddModal(false);
    setFormData({
      name: "",
      address: "",
      contact: "",
      image: "",
      map_link: "",
      general_rules: "",
    });
    setEditId(null);
    setSelectedGeneralRules([]);
  };

  const handleSavePress = async () => {
    try {
      if (!formData.name.trim()) {
        showToast("Name is required", "error");
        return;
      }
      if (!formData.address.trim()) {
        showToast("Address is required", "error");
        return;
      }
      if (!formData.contact.trim()) {
        showToast("Contact is required", "error");
        return;
      }
      // if (!formData.image.trim()) {
      //   showToast("Image is required", "error");
      //   return;
      // }
      // if (!formData.map_link.trim()) {
      //   showToast("Map Link is required", "error");
      //   return;
      // }

      const payload = {
        ...formData,
        general_rules: selectedGeneralRules.join(","), // "no_smoking,no_pets"
      };

      if (editId) {
        await update(payload);
        showToast("House updated successfully", "success");
      } else {
        await add(payload);
        showToast("House added successfully", "success");
      }
      handleCloseModalPress();

      fetchHouses();
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("Error saving data", "error");
    } finally {
    }
  };

  const handleEditPress = (item) => {
    setEditId(item.id);
    setFormData(item);
    setSelectedGeneralRules(item.general_rules.split(","));
    setShowAddModal(true);
  };

  const handleDeletePressAlert = async (id) => {
    Alert.alert("Delete House", "Are you sure you want to delete this house?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDeleteById(id),
      },
    ]);
  };

  const handleDeleteById = async (id) => {
    try {
      await deleteById(id);
      showToast("House deleted successfully", "success");
      fetchHouses();
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Error deleting data", "error");
    }
  };

  const handleAddFlatPress = (item) => {
    //navigate to (child) flat screen
    navigation.navigate("FlatScreen", {
      title: item.name,
      houseId: item.id,
    });
  };

  const toggleRule = (value) => {
    setSelectedGeneralRules((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

    // keep formData in sync (optional)
    // setFormData((prev) => ({
    //   ...prev,
    //   general_rules: prev.general_rules?.includes(value)
    //     ? prev.general_rules?.filter((v) => v !== value)
    //     : [...(prev.general_rules || []), value],
    // }));
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={houseList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.card}
            onPress={() => handleAddFlatPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.title}>{item.name}</Text>
              <Text style={globalStyles.subtext}>{item.address}</Text>
              <Text style={globalStyles.subtext}>{item.contact}</Text>
              <Text style={globalStyles.subtext}>{item.image}</Text>
              <Text style={globalStyles.subtext}>{item.map_link}</Text>
              <Text style={globalStyles.subtext}>
                Rules:{" "}
                {item.general_rules
                  ?.split(",")
                  .map((rule) => generalRulesMap[rule])
                  .filter(Boolean)
                  .join(", ")}
              </Text>
              <Text style={globalStyles.subtext}>Flats: {item.flat_count}, Rent: {item.rent_count}, To-Let: {item.flat_count - item.rent_count}</Text>
            </View>
            <View style={styles.actions}>
              <Button
                iconName="pencil"
                onPress={() => handleEditPress(item)}
                type="primary"
                style={styles.actionButton}
              />
              <Button
                iconName="trash"
                onPress={() => handleDeletePressAlert(item.id)}
                type="danger"
                style={styles.actionButton}
              />
            </View>
          </TouchableOpacity>
        )}
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchHouses} />
        }
      />

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModalPress}
      >
        <View style={globalStyles.modalBackdrop}>
          <View style={globalStyles.modalCard}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalHeaderTitle}>
                {editId ? "Edit House" : "Add House"}
              </Text>
            </View>

            <View style={globalStyles.modalBody}>
              <InputText
                label="Name"
                placeholder="Enter house name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              <InputText
                label="Address"
                placeholder="Enter house address"
                value={formData.address}
                onChangeText={(text) =>
                  setFormData({ ...formData, address: text })
                }
              />
              <InputText
                label="Contact"
                placeholder="Enter house contact"
                value={formData.contact}
                onChangeText={(text) =>
                  setFormData({ ...formData, contact: text })
                }
              />
              {/* <InputText
                label="Image"
                placeholder="Enter house image"
                value={formData.image}
                onChangeText={(text) =>
                  setFormData({ ...formData, image: text })
                }
              /> */}
              <InputText
                label="Map Link"
                placeholder="Enter house map link"
                value={formData.map_link}
                onChangeText={(text) =>
                  setFormData({ ...formData, map_link: text })
                }
              />
              {/* //multiple select */}
              <View style={styles.tagRow}>
                {generalRulesOptions.map((p) => {
                  const isSelected = selectedGeneralRules.includes(p.value);

                  return (
                    <Button
                      key={p.value}
                      title={p.name}
                      onPress={() => toggleRule(p.value)}
                      type={isSelected ? "primary" : "secondary"}
                      style={[
                        styles.tagButton,
                        isSelected && { backgroundColor: colors.primary },
                      ]}
                      textStyle={{ fontSize: 12 }}
                    />
                  );
                })}
              </View>
            </View>

            <View style={globalStyles.modalFooter}>
              <Button
                iconName="close"
                onPress={handleCloseModalPress}
                type="danger"
                style={globalStyles.footerButton}
              />
              <Button
                title={editId ? "Update" : "Save"}
                iconName={editId ? "save" : "add"}
                onPress={handleSavePress}
                type="success"
                style={globalStyles.footerButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Fab onPress={() => setShowAddModal(true)} />
    </View>
  );
}

const styles = {
  actions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
};
