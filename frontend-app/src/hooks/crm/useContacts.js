import { useState, useEffect } from "react";
import { contactAPI } from "@/api/crm/contactAPI";
import tmcb_cntcs from "@/models/crm/tmcb_cntcs.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmcb_cntcs, { edit_stop: 0 });

export const useContacts = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const cntct_ctypeOptions = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
    { label: "Both", value: "Both" },
  ];
  const cntct_sorceOptions = [{ label: "Local", value: "Local" }];
  const cntct_cntryOptions = [{ label: "Bangladesh", value: "Bangladesh" }];

  // const [ledgerContactList, setLedgerContactList] = useState([]);
  // const [contactPaymentList, setContactPaymentList] = useState([]);
  // const [supplierList, setSupplierList] = useState([]);
  // const [contactCustomerList, setContactCustomerList] = useState([]);
  // const [contactsLedger, setContactsLedger] = useState([]);

  const loadContacts = async () => {
    try {
      const response = await contactAPI.getAll({
        cntct_users: user.users_users,
      });
      // response = { message, data }
      setDataList(response.data);

      // const paymentData = response.data.filter(
      //   (c) => c.contact_type !== "Both"
      // );
      // setContactPaymentList(paymentData);

      // const supplierData = response.data.filter((c) =>
      //   ["Supplier", "Both"].includes(c.contact_type)
      // );
      // setSupplierList(supplierData);

      // const customerData = response.data.filter((c) =>
      //   ["Customer", "Both"].includes(c.contact_type)
      // );
      // setContactCustomerList(customerData);

      showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    //console.log("useEffect", dataModel);
    loadContacts();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_cntcs);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await contactAPI.delete(rowData);

      const updatedList = dataList.filter((c) => c.id !== rowData.id);
      setDataList(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadContacts();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmcb_cntcs);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        cntct_users: user.users_users,
        cntct_bsins: user.users_bsins,
        cntct_cntad: "0",
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await contactAPI.update(formDataNew);
      } else {
        response = await contactAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      handleClear();
      setCurrentView("list");
      loadContacts();
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  const fetchSupplierList = async () => {
    const response = await contactAPI.getAll();
    const supplierData = response.data.filter(
      (c) => c.contact_type === "Supplier" || c.contact_type === "Both"
    );
    setSupplierList(supplierData);
  };

  const handleLedger = async (contact) => {
    try {
      const response = await contactAPI.getContactLedger(contact.contact_id);
      // response = { message, data }
      setContactsLedger(response.data);
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
      });
    }
  };

  const fetchLedgerContactList = async (id) => {
    const response = await contactAPI.getByType(id);
    // response = { message, data }
    setLedgerContactList(response.data);
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    cntct_ctypeOptions,
    cntct_sorceOptions,
    cntct_cntryOptions,
  };
};
