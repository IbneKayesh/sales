import { useState, useEffect } from "react";
import { contactAPI } from "@/api/setup/contactAPI";
import validate from "@/models/validator";
import t_contacts from "@/models/setup/t_contacts";
import { generateGuid } from "@/utils/guid";

const fromDataModel = {
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
};

export const useContacts = () => {
  const [contactList, setContactList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataContact, setFormDataContact] = useState(fromDataModel);

  const contactTypeOptions = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
    { label: "Both", value: "Both" },
  ];

  const [contactPaymentList, setContactPaymentList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [contactCustomerList, setContactCustomerList] = useState([]);
  const [contactsLedger, setContactsLedger] = useState([]);

  const loadContacts = async (resetModified = false) => {
    try {
      const data = await contactAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setContactList(data);

      const paymentData = data.filter((c) => c.contact_type !== "Both");

      setContactPaymentList(paymentData);

      const supplierData = data.filter(
        (c) => c.contact_type === "Supplier" || c.contact_type === "Both"
      );
      setSupplierList(supplierData);

      const customerData = data
        .filter(
          (c) => c.contact_type === "Customer" || c.contact_type === "Both"
        )
        .map((c) => ({
          label:
            c.contact_mobile +
            " - " +
            c.contact_name +
            " - " +
            c.contact_address,
          value: c.contact_id,
        }));

      setContactCustomerList(customerData);

      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    if (supplierList.length === 0) {
      loadContacts(); // Load contacts only if the list is empty
    }
  }, [supplierList]);

  const fetchSupplierList = async () => {
    const data = await contactAPI.getAll();
    const supplierData = data.filter(
      (c) => c.contact_type === "Supplier" || c.contact_type === "Both"
    );
    setSupplierList(supplierData);
  };

  const handleChange = (field, value) => {
    setFormDataContact((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataContact, [field]: value },
      t_contacts
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataContact(fromDataModel);
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

  const handleEditContact = (contact) => {
    //console.log("contact: " + JSON.stringify(contact));

    setFormDataContact(contact);
    setCurrentView("form");
  };

  const handleDeleteContact = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await contactAPI.delete(rowData);
      const updatedContacts = contactList.filter(
        (c) => c.contact_id !== rowData.contact_id
      );
      setContactList(updatedContacts);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete contact",
      });
    }
  };

  const handleRefresh = () => {
    loadContacts(true);
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      const newErrors = validate(formDataContact, t_contacts);
      setErrors(newErrors);
      console.log("handleSaveContact: " + JSON.stringify(formDataContact));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...formDataContact,
        contact_id: formDataContact.contact_id
          ? formDataContact.contact_id
          : generateGuid(),
      };

      if (formDataContact.contact_id) {
        const data = await contactAPI.update(formDataNew);
      } else {
        const data = await contactAPI.create(formDataNew);
      }
      const message = formDataContact.contact_id
        ? `"${formDataContact.contact_name}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      handleClear();
      setCurrentView("list");
      loadContacts();
    } catch (error) {
      console.error("Error saving contact:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save contact",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleLedger = async (contact) => {
    try {
      const data = await contactAPI.getContactLedger(contact.contact_id);
      setContactsLedger(data);
    } catch (error) {
      console.error("Error fetching ledger:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch ledger",
      });
    }
  };

  return {
    contactList,
    contactPaymentList,
    fetchSupplierList,
    supplierList,
    contactCustomerList,
    contactTypeOptions,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataContact,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditContact,
    handleDeleteContact,
    handleRefresh,
    handleSaveContact,
    handleLedger,
    contactsLedger,
  };
};
