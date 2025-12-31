import {
  View,
  Text,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

//internal states
import {
  getAll,
  getById,
  getUnClosed,
  add,
  update,
  deleteById,
} from "../db/tenantDal";
import { getToLet } from "../db/flatDal";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";
import Button from "../components/Button";
import Fab from "../components/Fab";
import InputText from "../components/InputText";
import Dropdown from "../components/Dropdown";
import CheckBox from "../components/CheckBox";
import InputCalendar from "../components/InputCalendar";

export default function TenantScreen() {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const [formData, setFormData] = useState({
    flat_id: "",
    name: "",
    contact: "",
    image: "",
    contract_start_date: "",
    contract_end_date: "",
    rent: "0",
    deposit: "0",
    security: "0",
    contract_closed: "0",
  });

  const [tenantList, setTenantList] = useState([]);
  const [flatList, setFlatList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchTenants = async () => {
    // start refresh
    setRefreshing(true);

    try {
      const tenants = await getUnClosed();
      setTenantList(tenants);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // stop refresh
      setRefreshing(false);
    }
  };

  const fetchFlats = async () => {
    try {
      const flats = await getToLet();
      setFlatList(flats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    fetchTenants();
    fetchFlats();
  };

  const handleCloseModalPress = () => {
    setShowAddModal(false);
    setFormData({
      flat_id: "",
      name: "",
      contact: "",
      image: "",
      contract_start_date: new Date().toISOString().split("T")[0],
      contract_end_date: "",
      rent: "0",
      deposit: "0",
      security: "0",
      contract_closed: "0",
    });
    setEditId(null);
  };

  const handleSavePress = async () => {
    try {
      if (!formData.name.trim()) {
        showToast("Name is required", "error");
        return;
      }
      if (!formData.contact.trim()) {
        showToast("Contact is required", "error");
        return;
      }
      if (!formData.contract_start_date.trim()) {
        showToast("Contract Start Date is required", "error");
        return;
      }

      const payload = {
        ...formData,
        contract_end_date: formData.contract_end_date
          ? formData.contract_end_date
          : formData.contract_closed === "1"
          ? new Date().toISOString().split("T")[0]
          : "",
      };

      if (editId) {
        await update(payload);
        showToast("Tenant updated successfully", "success");
      } else {
        await add(payload);
        showToast("Tenant added successfully", "success");
      }
      handleCloseModalPress();

      fetchTenants();
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("Error saving data", "error");
    } finally {
    }
  };

  const handleEditPress = (item) => {
    setEditId(item.id);
    setFormData(item);
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
      fetchTenants();
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

  const handleChangeValueFlat = (value) => {
    //console.log(value);
    const selectedFlat = flatList.find(
      (flat) => String(flat.id) === String(value)
    );

    //console.log("Selected flat:", selectedFlat);

    if (!selectedFlat) return;

    setFormData((prev) => ({
      ...prev,
      flat_id: value,
      rent: String(selectedFlat.price || "0"),
      deposit: String(selectedFlat.price || "0"),
      security: String(selectedFlat.price || "0"),
    }));
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={tenantList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.card}
            onPress={() => handleAddFlatPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.title}>{item.name}</Text>
              <Text style={globalStyles.subtext}>{item.contact}</Text>
              <Text style={globalStyles.tagSecondary}>
                {item.flat_name}, from {item.contract_start_date} to{" "}
                {item.contract_end_date ? item.contract_end_date : "Present"}
              </Text>
              <Text style={globalStyles.tagSuccess}>Rent: {item.rent}</Text>
              <Text style={globalStyles.tagDisabled}>
                Deposit: {item.deposit}, Security: {item.security}
              </Text>
              {item.contract_closed === 1 || item.contract_closed === "1" ? (
                <Text style={globalStyles.tagDanger}>Closed</Text>
              ) : (
                <Text style={globalStyles.tagSuccess}>Rent</Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
      />

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModalPress}
      >
        <View style={globalStyles.modalBackdrop}>
          <ScrollView style={globalStyles.modalCard}>
            <View style={globalStyles.modalHeader}>
              <Text style={globalStyles.modalHeaderTitle}>
                {editId ? "Edit Tenant" : "Add Tenant"}
              </Text>
            </View>

            <View
              style={globalStyles.modalBody}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Dropdown
                label="Flat"
                placeholder="Select flat"
                data={flatList}
                value={
                  flatList.find((f) => f.id === formData.flat_id)?.name || ""
                }
                onChangeValue={handleChangeValueFlat}
              />
              <InputText
                label="Name"
                placeholder="Enter tenant name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              <InputText
                label="Contact"
                placeholder="Enter tenant contact"
                value={formData.contact}
                onChangeText={(text) =>
                  setFormData({ ...formData, contact: text })
                }
              />
              <InputCalendar
                label="Contract Start Date"
                placeholder="Select start date"
                value={formData.contract_start_date}
                onDateChange={(date) =>
                  setFormData({ ...formData, contract_start_date: date })
                }
              />
              <InputCalendar
                label="Contract End Date"
                placeholder="Select end date (optional)"
                value={formData.contract_end_date}
                onDateChange={(date) =>
                  setFormData({ ...formData, contract_end_date: date })
                }
              />
              <InputText
                label="Rent"
                placeholder="Enter tenant rent"
                value={formData.rent}
                onChangeText={(text) =>
                  setFormData({ ...formData, rent: text })
                }
                disabled={true}
              />
              <InputText
                label="Deposit"
                placeholder="Enter tenant deposit"
                value={formData.deposit}
                onChangeText={(text) =>
                  setFormData({ ...formData, deposit: text })
                }
              />
              <InputText
                label="Security"
                placeholder="Enter tenant security"
                value={formData.security}
                onChangeText={(text) =>
                  setFormData({ ...formData, security: text })
                }
              />
              <CheckBox
                label="Contract Closed"
                value={formData.contract_closed}
                onValueChange={(val) =>
                  setFormData({ ...formData, contract_closed: val })
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
          </ScrollView>
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
