//as example useUnits.js

import { useState, useEffect } from "react";
import { contactAPI } from "@/api/setup/contactAPI";
import validate from "@/models/validator";
import t_contacts from "@/models/setup/t_contacts";
import { generateGuid } from "@/utils/guid";

export const useContacts = () => {
  const [contactList, setContactList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataContact, setFormDataContact] = useState({
    contact_id: generateGuid(),
    contact_name: "",
    contact_mobile: "",
    contact_email: "",
    contact_address: "",
    contact_type: "",
    current_balance: 0,
  });

  const contactTypeOptions = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
    { label: "Both", value: "Both" },
  ];

  const [contactSupplierList, setContactSupplierList] = useState([]);

  const loadContacts = async (resetModified = false) => {
    try {
      const data = await contactAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setContactList(data);

      const supplierData = data
        .filter(
          (c) => c.contact_type === "Supplier" || c.contact_type === "Both"
        )
        .map((c) => ({ label: c.contact_name, value: c.contact_id }));

      setContactSupplierList(supplierData);

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
    loadContacts();
  }, []);

  const handleChange = (field, value) => {
    setFormDataContact((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataContact, [field]: value },
      t_contacts
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataContact({
      contact_id: "",
      contact_name: "",
      contact_mobile: "",
      contact_email: "",
      contact_address: "",
      contact_type: "",
      current_balance: 0,
    });
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
    setIsBusy(true);

    const newErrors = validate(formDataContact, t_contacts);
    setErrors(newErrors);
    console.log("handleSaveContact: " + JSON.stringify(formDataContact));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedContacts;
      if (formDataContact.contact_id) {
        // Edit existing
        const updatedContact = await contactAPI.update(formDataContact);
        updatedContact.ismodified = true;
        updatedContacts = contactList.map((c) =>
          c.contact_id === formDataContact.contact_id ? updatedContact : c
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataContact.contact_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newContactData = {
          ...formDataContact,
          contact_id: generateGuid(),
        };
        //console.log("newContactData: " + JSON.stringify(newContactData));

        const newContact = await contactAPI.create(newContactData);
        newContact.ismodified = true;
        updatedContacts = [...contactList, newContact];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataContact.contact_name}" added successfully.`,
        });
      }
      setContactList(updatedContacts);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving contact:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save contact",
      });
    }

    setIsBusy(false);
  };

  return {
    contactList,
    contactSupplierList,
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
  };
};
