import { useState, useEffect } from "react";
import { contactsAPI } from "@/api/contactsAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_contacts from "@/models/setup/t_contacts.json";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataContact, setFormDataContact] = useState({
    contact_name: "",
    contact_address: "",
    contact_type: "",
    current_balance: 0,
  });
  const contactTypeOptions = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
    { label: "Both", value: "Both" },
  ];
  const [contactsSupplier, setContactsSupplier] = useState([]); // Initialize with empty array

  const loadContacts = async (resetModified = false) => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data);

      const supplierList = data
        .filter(
          (contact) =>
            contact.contact_type === "Both" ||
            contact.contact_type === "Supplier"
        )
        .map((contact) => ({
          label: contact.contact_name,
          value: contact.contact_id,
        }));

      setContactsSupplier(supplierList);

      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load contacts from server",
      });
    }
  };

  // Load contacts from API on mount
  useEffect(() => {
    loadContacts();
  }, []);

  const handleChange = (field, value) => {
    setFormDataContact((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataContact, [field]: value },
      t_contacts.t_contacts
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataContact({
      contact_id: "",
      contact_name: "",
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
    setFormDataContact(contact);
    setCurrentView("form");
  };

  const handleDeleteContact = async (id) => {
    try {
      await contactsAPI.delete(id);
      const updatedContacts = contacts.filter((c) => c.contact_id !== id);
      setContacts(updatedContacts);

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

    const newErrors = validate(formDataContact, t_contacts.t_contacts);
    setErrors(newErrors);
    console.log("handleSaveContact: " + JSON.stringify(newErrors));
    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedContacts;
      if (formDataContact.contact_id) {
        // Edit existing
        const updatedContact = await contactsAPI.update(
          formDataContact.contact_id,
          formDataContact
        );
        updatedContact.ismodified = true;
        updatedContacts = contacts.map((c) =>
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

        const newContact = await contactsAPI.create(newContactData);
        newContact.ismodified = true;
        updatedContacts = [...contacts, newContact];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataContact.contact_name}" added successfully.`,
        });
      }
      setContacts(updatedContacts);

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
    contacts,
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
    contactTypeOptions,
    contactsSupplier,
  };
};
