import {
  View,
  Text,
  FlatList,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";

//internal states
import {
  getAll,
  getById,
  getByFlatId,
  add,
  update,
  deleteById,
} from "../db/featuresDal";
import { getTenantByFlatId } from "../db/tenantDal";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";
import Button from "../components/Button";
import InputText from "../components/InputText";
import Dropdown from "../components/Dropdown";
import Fab from "../components/Fab";
import CheckBox from "../components/CheckBox";

export default function FeatureScreen({ route, navigation }) {
  const { showToast } = useToast();
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const [formData, setFormData] = useState({
    flat_id: "",
    name: "",
    feature_type: "",
    include_price: 1,
    price: "0",
    quantity: "1",
  });
  const [featureList, setFeatureList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const { title, flatId } = route.params;

  const featureTypeOptions = [
    { value: "master_bedroom", name: "Master Bedroom" },
    { value: "single_bedroom", name: "Single Bedroom" },
    { value: "attached_bathroom", name: "Attached Bathroom" },
    { value: "common_bathroom", name: "Common Bathroom" },
    { value: "kitchen", name: "Kitchen" },
    { value: "living_room", name: "Living Room" },
    { value: "balcony", name: "Balcony" },
    { value: "parking", name: "Parking" },
    { value: "security", name: "Security" },
    { value: "lift", name: "Lift" },
    { value: "gas", name: "Gas" },
    { value: "electricity", name: "Electricity" },
    { value: "water", name: "Water" },
    { value: "garbage_collection", name: "Garbage Collection" },
    { value: "wifi", name: "WiFi" },
    { value: "dish_cable", name: "Dish Cable" },
    { value: "elevator", name: "Elevator" },
    { value: "air_conditioning", name: "Air Conditioning" },
    { value: "terrace", name: "Terrace" },
    { value: "garden", name: "Garden" },
    { value: "swimming_pool", name: "Swimming Pool" },
    { value: "gym", name: "Gym" },
    { value: "club", name: "Club" },
    { value: "room_heating", name: "Room Heating" },
    { value: "monthly_charge", name: "Monthly Charge" },
    { value: "service_charge", name: "Service Charge" },
    { value: "maintanance_charge", name: "Maintanance Charge" },
    { value: "yearly_charge", name: "Yearly Charge" },
  ];

  const [tenantList, setTenantList] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${title} Features`,
    });
  }, [navigation, title]);

  const fetchFeaturesByFlatId = async () => {
    try {
      const features = await getByFlatId(flatId);
      setFeatureList(features);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTenantsByFlatId = async () => {
    try {
      const tenants = await getTenantByFlatId(flatId);
      setTenantList(tenants);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFeaturesByFlatId();
    fetchTenantsByFlatId();
  }, []);

  const handleCloseModalPress = () => {
    setShowAddModal(false);
    setFormData({
      flat_id: flatId,
      name: "",
      feature_type: "",
      include_price: 1,
      price: "0",
      quantity: "1",
    });
    setEditId(null);
  };

  const handleSavePress = async () => {
    try {
      // if (!formData.flat_id) {
      //   showToast("Flat is required", "error");
      //   return;
      // }
      // if (!formData.name.trim()) {
      //   showToast("Name is required", "error");
      //   return;
      // }
      if (!formData.feature_type.trim()) {
        showToast("Feature Type is required", "error");
        return;
      }
      if (!formData.price) {
        showToast("Price is required", "error");
        return;
      }
      if (!formData.quantity) {
        showToast("Quantity is required", "error");
        return;
      }

      const payload = {
        ...formData,
        flat_id: flatId,
      };

      if (editId) {
        await update(payload);
        showToast("Feature updated successfully", "success");
      } else {
        await add(payload);
        showToast("Feature added successfully", "success");
      }
      handleCloseModalPress();

      fetchFeaturesByFlatId();
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("Error saving data", "error");
    } finally {
    }
  };

  const handleEditPress = (item) => {
    //console.log(item);
    setEditId(item.id);
    setFormData(item);
    setShowAddModal(true);
  };

  const handleDeletePressAlert = async (id) => {
    Alert.alert(
      "Delete Feature",
      "Are you sure you want to delete this feature?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteById(id),
        },
      ]
    );
  };

  const handleDeleteById = async (id) => {
    try {
      await deleteById(id);
      showToast("Feature deleted successfully", "success");
      fetchFeaturesByFlatId();
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("Error deleting data", "error");
    }
  };

  // const handleAddFeaturePress = (item) => {
  //   //navigate to (child) feature screen
  //   navigation.navigate("FeatureScreen", {
  //     title: item.name,
  //     houseId: item.id,
  //   });
  // };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={featureList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.card}
            onPress={() => handleEditPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.title}>{item.name}</Text>
              <Text style={globalStyles.subtext}>
                {item.feature_type} ({item.quantity})
              </Text>
              {item.include_price === 1 ? (
                <Text style={{ color: "green" }}>Include Price</Text>
              ) : (
                <Text style={{ color: "red" }}>Exclude Price</Text>
              )}
              {item.price && item.price > 0 ? (
                <Text style={globalStyles.tagSuccess}>{item.price}</Text>
              ) : (
                <Text style={globalStyles.tagDisabled}>No extra charge</Text>
              )}
            </View>
            <View style={styles.actions}>
              {/* <Button
                iconName="add-circle"
                onPress={() => handleAddFeaturePress(item)}
                type="primary"
                style={styles.actionButton}
              /> */}
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
      />

      <FlatList
        data={tenantList}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.title}>{item.name}</Text>
            <Text style={globalStyles.subtext}>
              {item.contract_start_date} to{" "}
              {item.contract_end_date ? item.contract_end_date : "Present"}
            </Text>
            <Text style={globalStyles.subtext}>Price: {item.rent}</Text>
            {item.contract_closed === 1 || item.contract_closed === "1" ? (
              <Text style={globalStyles.tagDanger}>Closed</Text>
            ) : (
              <Text style={globalStyles.tagSuccess}>Booked</Text>
            )}
          </View>
        )}
        style={{ width: "100%" }}
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
                {editId ? "Edit Feature" : "Add Feature"} - {title}
              </Text>
            </View>

            <View style={globalStyles.modalBody}>
              <InputText
                label="Name"
                placeholder="Enter feautre name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              <Dropdown
                label={<Text>Type <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Select feature type"
                value={formData.feature_type}
                onChangeText={(text) =>
                  setFormData({ ...formData, feature_type: text })
                }
                data={featureTypeOptions}
              />
              <CheckBox
                label="Include Price"
                value={formData.include_price}
                onValueChange={(val) =>
                  setFormData({ ...formData, include_price: val })
                }
              />
              <InputText
                label={<Text>Price <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Enter price"
                value={formData.price?.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: String(text) })
                }
              />
              <InputText
                label={<Text>Quantity <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Enter quantity"
                value={formData.quantity?.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, quantity: String(text) })
                }
              />
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
};
