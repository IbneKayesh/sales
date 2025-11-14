import { useState, useEffect } from "react";
import { soMasterAPI } from "@/utils/api";

import validate from "@/models/validator";
import t_so_master from "@/models/srequest/t_so_master.json";

export const useSoMaster = () => {
  const [soMasters, setSoMasters] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataSoMaster, setFormDataSoMaster] = useState({
    transaction_date: "",
    contacts_id: "",
    transaction_note: "",
    total_amount: 0,
    paid_amount: 0,
    is_paid: false,
  });

  // Load soMasters from API on mount
  useEffect(() => {
    const loadSoMasters = async () => {
      try {
        const data = await soMasterAPI.getAll();
        setSoMasters(data);
      } catch (error) {
        console.error('Error loading sales orders:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load sales orders from server",
        });
      }
    };
    loadSoMasters();
  }, []);

  const handleChange = (field, value) => {
    setFormDataSoMaster((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataSoMaster, [field]: value },
      t_so_master.t_so_master
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataSoMaster({
      so_master_id: "",
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

  const handleEditSoMaster = (soMaster) => {
    setFormDataSoMaster(soMaster);
    setCurrentView("form");
  };

  const handleDeleteSoMaster = async (id) => {
    try {
      await soMasterAPI.delete(id);
      const updatedSoMasters = soMasters.filter((s) => s.so_master_id !== id);
      setSoMasters(updatedSoMasters);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting sales order:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete sales order",
      });
    }
  };

  const handleSaveSoMaster = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataSoMaster, t_so_master.t_so_master);
    setErrors(newErrors);

    console.log("handleSaveSoMaster: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedSoMasters;
        if (formDataSoMaster.so_master_id) {
          // Edit existing
          const updatedSoMaster = await soMasterAPI.update(formDataSoMaster.so_master_id, formDataSoMaster);
          updatedSoMasters = soMasters.map((s) =>
            s.so_master_id === formDataSoMaster.so_master_id ? updatedSoMaster : s
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"Sales Order #${formDataSoMaster.so_master_id}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newSoMaster = await soMasterAPI.create(formDataSoMaster);
          updatedSoMasters = [...soMasters, newSoMaster];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `New sales order added successfully.`,
          };
          setToastBox(toastBox);
        }
        setSoMasters(updatedSoMasters);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving sales order:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save sales order",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    soMasters,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataSoMaster,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditSoMaster,
    handleDeleteSoMaster,
    handleSaveSoMaster,
  };
};
