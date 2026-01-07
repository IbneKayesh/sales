import { useState, useEffect } from "react";
import { contactAPI } from "@/api/setup/contactAPI";
import { businessAPI } from "@/api/auth/businessAPI";
import validate from "@/models/validator";
import t_contacts from "@/models/setup/t_contacts";
import { generateGuid } from "@/utils/guid";

const dataModel = {
  contact_id: "",
  contact_name: "",
  contact_mobile: "",
  contact_email: "",
  contact_address: "",
  contact_type: "",
  credit_limit: 0,
  payable_balance: 0,
  advance_balance: 0,
  current_balance: 0,
  shop_id: "",
};

export const useContacts = () => {
  const [contactList, setContactList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const contactTypeOptions = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
    { label: "Both", value: "Both" },
  ];
  const [shopOptions, setShopOptions] = useState([]);

  const [ledgerContactList, setLedgerContactList] = useState([]);
  const [contactPaymentList, setContactPaymentList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [contactCustomerList, setContactCustomerList] = useState([]);
  const [contactsLedger, setContactsLedger] = useState([]);

  const loadContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      // response = { message, data }
      setContactList(response.data);

      const paymentData = response.data.filter(
        (c) => c.contact_type !== "Both"
      );
      setContactPaymentList(paymentData);

      const supplierData = response.data.filter((c) =>
        ["Supplier", "Both"].includes(c.contact_type)
      );
      setSupplierList(supplierData);

      const customerData = response.data.filter((c) =>
        ["Customer", "Both"].includes(c.contact_type)
      );
      setContactCustomerList(customerData);

      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
      });
    }
  };

  const loadShops = async () => {
    if (shopOptions.length > 0) {
      return;
    }
    try {
      const response = await shopsAPI.getAll();
      // response = { message, data }

      setShopOptions(
        response.data.map((shop) => ({
          value: shop.shop_id,
          label: shop.shop_name,
        }))
      );
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const fetchSupplierList = async () => {
    const response = await contactAPI.getAll();
    const supplierData = response.data.filter(
      (c) => c.contact_type === "Supplier" || c.contact_type === "Both"
    );
    setSupplierList(supplierData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, t_contacts);
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
    loadShops();
  };

  const handleEditContact = (contact) => {
    //console.log("contact: " + JSON.stringify(contact));

    setFormData(contact);
    setCurrentView("form");
    loadShops();
  };

  const handleDeleteContact = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await contactAPI.delete(rowData);

      const updatedList = contactList.filter(
        (c) => c.contact_id !== rowData.contact_id
      );
      setContactList(updatedList);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: response.message || "Deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete data",
      });
    }
  };

  const handleRefresh = () => {
    loadContacts();
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, t_contacts);
      setErrors(newErrors);
      console.log("handleSaveContact: " + JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure contact_id exists (for create)
      const formDataNew = {
        ...formData,
        contact_id: formData.contact_id || generateGuid(),
      };

      // Call API and get { message, data }
      let response;
      if (formData.contact_id) {
        response = await contactAPI.update(formDataNew);
      } else {
        response = await contactAPI.create(formDataNew);
      }

      // Update toast using API message
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message || "Operation successful",
      });

      handleClear();
      setCurrentView("list");
      loadContacts();
    } catch (error) {
      console.error("Error saving data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to save data",
      });
    } finally {
      setIsBusy(false);
    }
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
    contactList,
    contactPaymentList,
    fetchSupplierList,
    supplierList,
    contactCustomerList,
    contactTypeOptions,
    shopOptions,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditContact,
    handleDeleteContact,
    handleRefresh,
    handleSaveContact,
    handleLedger,
    contactsLedger,
    ledgerContactList,
    fetchLedgerContactList,
  };
};
