import { useState, useEffect } from "react";
import { soChildAPI } from "@/utils/api";

import validate from "@/models/validator";
import t_so_child from "@/models/srequest/t_so_child.json";

export const useSoChild = () => {
  const [soChildren, setSoChildren] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataSoChild, setFormDataSoChild] = useState({
    so_master_id: "",
    item_id: "",
    item_rate: 0,
    order_item_qty: 0,
    return_item_qty: 0,
    item_qty: 0,
    discount_amount: 0,
    item_amount: 0,
    item_note: "",
  });

  // Load soChildren from API on mount
  useEffect(() => {
    const loadSoChildren = async () => {
      try {
        const data = await soChildAPI.getAll();
        setSoChildren(data);
      } catch (error) {
        console.error('Error loading sales order items:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load sales order items from server",
        });
      }
    };
    loadSoChildren();
  }, []);

  const handleChange = (field, value) => {
    setFormDataSoChild((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataSoChild, [field]: value },
      t_so_child.t_so_child
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataSoChild({
      id: "",
      so_master_id: "",
      item_id: "",
      item_rate: 0,
      order_item_qty: 0,
      return_item_qty: 0,
      item_qty: 0,
      discount_amount: 0,
      item_amount: 0,
      item_note: "",
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

  const handleEditSoChild = (soChild) => {
    setFormDataSoChild(soChild);
    setCurrentView("form");
  };

  const handleDeleteSoChild = async (id) => {
    try {
      await soChildAPI.delete(id);
      const updatedSoChildren = soChildren.filter((s) => s.id !== id);
      setSoChildren(updatedSoChildren);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting sales order item:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete sales order item",
      });
    }
  };

  const handleSaveSoChild = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataSoChild, t_so_child.t_so_child);
    setErrors(newErrors);

    console.log("handleSaveSoChild: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedSoChildren;
        if (formDataSoChild.id) {
          // Edit existing
          const updatedSoChild = await soChildAPI.update(formDataSoChild.id, formDataSoChild);
          updatedSoChildren = soChildren.map((s) =>
            s.id === formDataSoChild.id ? updatedSoChild : s
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `Sales order item updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newSoChild = await soChildAPI.create(formDataSoChild);
          updatedSoChildren = [...soChildren, newSoChild];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `New sales order item added successfully.`,
          };
          setToastBox(toastBox);
        }
        setSoChildren(updatedSoChildren);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving sales order item:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save sales order item",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    soChildren,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataSoChild,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditSoChild,
    handleDeleteSoChild,
    handleSaveSoChild,
  };
};
