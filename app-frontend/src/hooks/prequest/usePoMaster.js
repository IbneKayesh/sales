import { useState, useEffect } from "react";
import { poMasterAPI } from "@/utils/api";

import validate from "@/models/validator";
import t_po_master from "@/models/prequest/t_po_master.json";

export const usePoMaster = () => {
  const [poMasters, setPoMasters] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataPoMaster, setFormDataPoMaster] = useState({
    transaction_date: "",
    contacts_id: "",
    transaction_note: "",
    total_amount: 0,
    paid_amount: 0,
    is_paid: false,
  });

  // Load poMasters from API on mount
  useEffect(() => {
    const loadPoMasters = async () => {
      try {
        const data = await poMasterAPI.getAll();
        setPoMasters(data);
      } catch (error) {
        console.error('Error loading purchase orders:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load purchase orders from server",
        });
      }
    };
    loadPoMasters();
  }, []);

  const handleChange = (field, value) => {
    setFormDataPoMaster((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataPoMaster, [field]: value },
      t_po_master.t_po_master
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataPoMaster({
      po_master_id: "",
      transaction_date: "",
      contacts_id: "",
      transaction_note: "",
      total_amount: 0,
      paid_amount: 0,
      is_paid: false,
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

  const handleEditPoMaster = (poMaster) => {
    setFormDataPoMaster(poMaster);
    setCurrentView("form");
  };

  const handleDeletePoMaster = async (id) => {
    try {
      await poMasterAPI.delete(id);
      const updatedPoMasters = poMasters.filter((p) => p.po_master_id !== id);
      setPoMasters(updatedPoMasters);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete purchase order",
      });
    }
  };

  const handleSavePoMaster = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataPoMaster, t_po_master.t_po_master);
    setErrors(newErrors);

    console.log("handleSavePoMaster: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedPoMasters;
        if (formDataPoMaster.po_master_id) {
          // Edit existing
          const updatedPoMaster = await poMasterAPI.update(formDataPoMaster.po_master_id, formDataPoMaster);
          updatedPoMasters = poMasters.map((p) =>
            p.po_master_id === formDataPoMaster.po_master_id ? updatedPoMaster : p
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"Purchase Order #${formDataPoMaster.po_master_id}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newPoMaster = await poMasterAPI.create(formDataPoMaster);
          updatedPoMasters = [...poMasters, newPoMaster];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `New purchase order added successfully.`,
          };
          setToastBox(toastBox);
        }
        setPoMasters(updatedPoMasters);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving purchase order:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save purchase order",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    poMasters,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPoMaster,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPoMaster,
    handleDeletePoMaster,
    handleSavePoMaster,
  };
};
