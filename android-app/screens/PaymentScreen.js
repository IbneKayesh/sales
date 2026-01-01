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
  getByTenantId,
  add,
  update,
  deleteById,
} from "../db/paymentDal";
import { getPayableByFlatId } from "../db/featuresDal";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { getGlobalStyles } from "../styles/css";
import Button from "../components/Button";
import InputText from "../components/InputText";
import Dropdown from "../components/Dropdown";
import Fab from "../components/Fab";
import InputCalendar from "../components/InputCalendar";

export default function PaymentScreen({ route, navigation }) {
  const { title, itemObj } = route.params;

  const { showToast } = useToast();
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const [formData, setFormData] = useState({
    id: "",
    tenant_id: itemObj.id,
    flat_id: itemObj.flat_id,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    payment_type: "",
  });
  const [paymentList, setPaymentList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [payableList, setPayableList] = useState([]);

  const tenantId = itemObj.id;
  const flatId = itemObj.flat_id;
  const rent = itemObj.rent;
  const deposit = itemObj.deposit;
  const security = itemObj.security;

  const paymentTypeOptions = [
    { value: "Rent", name: "Rent" },
    { value: "Deposit", name: "Deposit" },
    { value: "Security", name: "Security" },
    { value: "Penalty", name: "Penalty" },
    { value: "Other", name: "Other" },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${title} Payment`,
    });
    //console.log("itemObj", formData);
  }, [navigation, title]);

  const fetchPaymentsByTenantId = async () => {
    try {
      const payments = await getByTenantId(tenantId);
      setPaymentList(payments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPaymentsByTenantId();
  }, []);

  const handleCloseModalPress = () => {
    setShowAddModal(false);
    setFormData({
      tenant_id: tenantId,
      flat_id: flatId,
      amount: "",
      date: new Date().toISOString().split("T")[0],
      payment_type: "",
    });
    setEditId(null);
  };

  const handleSavePress = async () => {
    try {
      if (!formData.payment_type.trim()) {
        showToast("Payment Type is required", "error");
        return;
      }
      if (!formData.amount || formData.amount < 1) {
        showToast("Amount is required", "error");
        return;
      }
      if (!formData.date.trim()) {
        showToast("Date is required", "error");
        return;
      }

      const payload = {
        ...formData,
        tenant_id: tenantId,
        flat_id: flatId,
      };

      if (editId) {
        await update(payload);
        showToast("Payment updated successfully", "success");
      } else {
        await add(payload);
        showToast("Payment added successfully", "success");
      }
      handleCloseModalPress();

      fetchPaymentsByTenantId();
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
      "Delete Payment",
      "Are you sure you want to delete this payment?",
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
      showToast("Payment deleted successfully", "success");
      fetchPaymentsByTenantId();
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

  const fetchPayableByFlatId = async () => {
    try {
      const payables = await getPayableByFlatId(flatId);
      console.log("payables", payables);
      setPayableList(payables);

      const totalRent = payables.reduce((total, payable) => total + payable.price, 0);
      console.log("totalRent", totalRent);

      const notes = payables.map((payable) => payable.feature_type + " - " + payable.price).join(", ");
      console.log("notes", notes);


      setFormData({ ...formData, amount: String(totalRent), payment_type: "Rent", note: notes });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleChangeValuePaymentType = (value) => {
    console.log(value);
    if (value === "Rent") {
      fetchPayableByFlatId();
    } else if (value === "Deposit") {
      setFormData({ ...formData, amount: deposit, payment_type: value, note: "" });
    } else if (value === "Security") {
      setFormData({ ...formData, amount: security, payment_type: value, note: "" });
    } else {
      setFormData({ ...formData, amount: "", payment_type: value, note: "" });
    }
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={paymentList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.card}
            onPress={() => handleEditPress(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.title}>{item.amount}</Text>
              <Text style={globalStyles.subtext}>{item.date}</Text>
              <Text style={globalStyles.subtext}>{item.payment_type}</Text>
              <Text style={globalStyles.subtext}>{item.note}</Text>
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
                {editId ? "Edit Payment" : "Add Payment"} - {title}
              </Text>
            </View>

            <View style={globalStyles.modalBody}>
              <Dropdown
                label={<Text>Payment Type <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Select payment type"
                value={formData.payment_type}
                // onChangeText={(text) =>
                //   setFormData({ ...formData, payment_type: text })
                // }
                data={paymentTypeOptions}
                onChangeText={handleChangeValuePaymentType}
              />
              <InputText
                label={<Text>Amount <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Enter amount"
                value={formData.amount}
                onChangeText={(text) =>
                  setFormData({ ...formData, amount: text })
                }
              />
              <InputCalendar
                label={<Text>Date <Text style={{ color: "red" }}>*</Text></Text>}
                placeholder="Select date"
                value={formData.date}
                onDateChange={(date) =>
                  setFormData({ ...formData, date: date })
                }
              />
              <InputText
                label="Note"
                placeholder="Enter note"
                value={formData.note}
                onChangeText={(text) =>
                  setFormData({ ...formData, note: text })
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
