import { useState, useEffect } from "react";
import { contactsAPI } from "@/utils/api";

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
  });

  // Load contacts from API on mount
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await contactsAPI.getAll();
        setContacts(data);
      } catch (error) {
        console.error('Error loading contacts:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load contacts from server",
        });
      }
    };
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

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting contact:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete contact",
      });
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataContact, t_contacts.t_contacts);
    setErrors(newErrors);

    console.log("handleSaveContact: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedContacts;
        if (formDataContact.contact_id) {
          // Edit existing
          const updatedContact = await contactsAPI.update(formDataContact.contact_id, formDataContact);
          updatedContacts = contacts.map((c) =>
            c.contact_id === formDataContact.contact_id ? updatedContact : c
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataContact.contact_name}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newContact = await contactsAPI.create(formDataContact);
          updatedContacts = [...contacts, newContact];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataContact.contact_name}" added successfully.`,
          };
          setToastBox(toastBox);
        }
        setContacts(updatedContacts);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving contact:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save contact",
        });
      }
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
    handleSaveContact,
  };
};
