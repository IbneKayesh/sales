import {
  View,
  Text,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";

//internal states
import {
  getAll,
  getById,
  getByHouseId,
  add,
  update,
  deleteById,
  updatePrice
} from "../db/flatDal";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";
import Button from "../components/Button";
import InputText from "../components/InputText";
import { generalRulesOptions } from "../db/vtable";
import Fab from "../components/Fab";

export default function FlatScreen({ route, navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const [formData, setFormData] = useState({
    house_id: "",
    name: "",
    contact: "",
    image: "",
    price: "",
    general_rules: "",
    features: [
      {
        feature_name: "",
        feature_type: "",
        quantity: 0,
      },
    ],
  });
  const [flatList, setFlatList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const { title, houseId } = route.params;

  const [selectedGeneralRules, setSelectedGeneralRules] = useState([]);
  const generalRulesMap = Object.fromEntries(
    generalRulesOptions.map((r) => [r.value, r.name])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${title} Flats`,
    });
  }, [navigation, title]);

  const fetchFlatsByHouseId = async () => {
    try {
      const flatsWithFeatures = await getByHouseId(houseId);
      //console.log(houseId);
      // Make sure it's an array
      if (!Array.isArray(flatsWithFeatures)) {
        console.error("Expected an array but got:", flatsWithFeatures);
        return;
      }

      //return;

      // flatsWithFeatures is an array of rows from SQL, each row might repeat flat info

      // We'll transform it into a map first to group by flat id
      const flatMap = {};

      flatsWithFeatures.forEach((row) => {
        const flatId = row.id;

        if (!flatMap[flatId]) {
          // Initialize the flat in the map
          flatMap[flatId] = {
            id: row.id,
            house_id: row.house_id,
            name: row.name,
            contact: row.contact,
            image: row.image,
            price: row.price,
            general_rules: row.general_rules,
            features: [],
          };
        }

        // If the row has a feature, push it into the features array
        if (row.feature_type) {
          flatMap[flatId].features.push({
            feature_name: row.feature_name,
            feature_type: row.feature_type,
            quantity: row.quantity,
          });
        }
      });

      // Convert the map to an array
      const flatListArray = Object.values(flatMap);

      //console.log(flatsWithFeatures);

      setFlatList(flatListArray);

      //update price
      await updatePrice();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFlatsByHouseId();
  }, []);

  const handleCloseModalPress = () => {
    setShowAddModal(false);
    setFormData({
      house_id: houseId,
      name: "",
      contact: "",
      image: "",
      price: "",
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

      const payload = {
        ...formData,
        house_id: houseId,
        general_rules: selectedGeneralRules.join(","), // "no_smoking,no_pets"
      };
      //console.log(payload);
      if (editId) {
        await update(payload);
        showToast("Flat updated successfully", "success");
      } else {
        await add(payload);
        showToast("Flat added successfully", "success");
      }
      handleCloseModalPress();

      fetchFlatsByHouseId();
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
    Alert.alert("Delete Flat", "Are you sure you want to delete this flat?", [
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
      showToast("Flat deleted successfully", "success");
      fetchFlatsByHouseId();
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Error deleting data", "error");
    }
  };

  const handleAddFeaturePress = (item) => {
    //navigate to (child) feature screen
    navigation.navigate("FeatureScreen", {
      title: item.name,
      flatId: item.id,
    });
  };

  const toggleRule = (value) => {
    setSelectedGeneralRules((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={flatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.card}
            onPress={() => handleAddFeaturePress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.title}>{item.name}</Text>
              <Text style={globalStyles.subtext}>{item.contact}</Text>
              <Text style={globalStyles.subtext}>{item.image}</Text>
              <Text style={globalStyles.subtext}>{item.price}</Text>
              <Text style={globalStyles.subtext}>
                Rules:{" "}
                {item.general_rules
                  ?.split(",")
                  .map((rule) => generalRulesMap[rule])
                  .filter(Boolean)
                  .join(", ")}
              </Text>
              {item.features.length > 0 && (
                <Text style={globalStyles.subtext}>
                  {item.features.map((feature) => (
                    <Text
                      key={feature.feature_type}
                      style={globalStyles.subtext}
                    >
                      {feature.feature_name.length > 5
                        ? feature.feature_name
                        : feature.feature_type}{" "}
                      ({feature.quantity}),{" "}
                    </Text>
                  ))}
                </Text>
              )}
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchFlatsByHouseId}
          />
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
                {editId ? "Edit Flat" : "Add Flat"} - {title}
              </Text>
            </View>

            <View style={globalStyles.modalBody}>
              <InputText
                label="Name"
                placeholder="Enter flat name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
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
      <Fab onPress={() => setShowAddModal(true)} style={{ bottom: 80 }} />
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
