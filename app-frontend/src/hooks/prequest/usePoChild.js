import { useState, useEffect } from "react";
import { poChildAPI } from "@/utils/api";

import validate from "@/models/validator";
import t_po_child from "@/models/prequest/t_po_child.json";

export const usePoChild = () => {
  const [poChildren, setPoChildren] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataPoChild, setFormDataPoChild] = useState({
    po_master_id: "",
    item_id: "",
    item_rate: 0,
    item_qty: 0,
    discount_amount: 0,
    item_amount: 0,
    item_note: "",
  });

  // Load poChildren from API on mount
  useEffect(() => {
    const loadPoChildren = async () => {
      try {
        const data = await poChildAPI.getAll();
        setPoChildren(data);
      } catch (error) {
        console.error('Error loading purchase order items:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load purchase order items from server",
        });
      }
    };
    loadPoChildren();
  }, []);

  const handleChange = (field, value) => {
    setFormDataPoChild((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataPoChild, [field]: value },
      t_po_child.t_po_child
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataPoChild({
      id: "",
      po_master_id: "",
      item_id: "",
      item_rate: 0,
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

  const handleEditPoChild = (poChild) => {
    setFormDataPoChild(poChild);
    setCurrentView("form");
  };

  const handleDeletePoChild = async (id) => {
    try {
      await poChildAPI.delete(id);
      const updatedPoChildren = poChildren.filter((p) => p.id !== id);
      setPoChildren(updatedPoChildren);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting purchase order item:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete purchase order item",
      });
    }
  };

  const handleSavePoChild = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataPoChild, t_po_child.t_po_child);
    setErrors(newErrors);

    console.log("handleSavePoChild: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedPoChildren;
        if (formDataPoChild.id) {
          // Edit existing
          const updatedPoChild = await poChildAPI.update(formDataPoChild.id, formDataPoChild);
          updatedPoChildren = poChildren.map((p) =>
            p.id === formDataPoChild.id ? updatedPoChild : p
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `Purchase order item updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newPoChild = await poChildAPI.create(formDataPoChild);
          updatedPoChildren = [...poChildren, newPoChild];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `New purchase order item added successfully.`,
          };
          setToastBox(toastBox);
        }
        setPoChildren(updatedPoChildren);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving purchase order item:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save purchase order item",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    poChildren,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPoChild,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPoChild,
    handleDeletePoChild,
    handleSavePoChild,
  };
};
