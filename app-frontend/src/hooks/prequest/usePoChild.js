import { useState, useEffect } from "react";
import { poChildAPI } from "@/api/poChildAPI";

import validate from "@/models/validator";
import t_po_child from "@/models/prequest/t_po_child.json";

export const usePoChild = (selectedMasterId) => {
  const [poChildrenCache, setPoChildrenCache] = useState({}); // Cache for poChildren by masterId
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
    order_qty: 0,
    ismodified: 0,
  });

  // Get poChildren for the selected masterId from cache
  const poChildren = poChildrenCache[selectedMasterId] || [];

  // Load poChildren for selectedMasterId if not cached
  useEffect(() => {
    if (selectedMasterId && !poChildrenCache[selectedMasterId]) {
      const loadPoChildren = async () => {
        try {
          const data = await poChildAPI.getByMasterId(selectedMasterId);
          setPoChildrenCache((prev) => ({ ...prev, [selectedMasterId]: data }));
        } catch (error) {
          console.error("Error loading purchase order items:", error);
          setToastBox({
            severity: "error",
            summary: "Error",
            detail: "Failed to load purchase order items from server",
          });
        }
      };
      loadPoChildren();
    }
  }, [selectedMasterId, poChildrenCache]);

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
      order_qty: 0,
      ismodified: 0,
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
      setPoChildrenCache((prev) => ({ ...prev, [selectedMasterId]: prev[selectedMasterId].filter((p) => p.id !== id) }));

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error("Error deleting purchase order item:", error);
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
        if (formDataPoChild.id) {
          // Edit existing
          const updatedPoChild = await poChildAPI.update(
            formDataPoChild.id,
            formDataPoChild
          );
          setPoChildrenCache((prev) => ({ ...prev, [selectedMasterId]: prev[selectedMasterId].map((p) =>
            p.id === formDataPoChild.id ? updatedPoChild : p
          ) }));

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `Purchase order item updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newPoChild = await poChildAPI.create(formDataPoChild);
          setPoChildrenCache((prev) => ({ ...prev, [selectedMasterId]: [...prev[selectedMasterId], newPoChild] }));

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `New purchase order item added successfully.`,
          };
          setToastBox(toastBox);
        }

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error("Error saving purchase order item:", error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save purchase order item",
        });
      }
    }

    setIsBusy(false);
  };

  const handleSaveAll = async (localItems) => {
    setIsBusy(true);
    try {
      // Get existing items for the selected master
      const existingItems = poChildren;

      // Determine items to create, update, delete
      const toCreate = localItems.filter((item) => item.ismodified);
      const toUpdate = localItems.filter(
        (item) =>
          !item.ismodified &&
          existingItems.some((existing) => existing.id === item.id)
      );
      const toDelete = existingItems.filter(
        (existing) => !localItems.some((item) => item.id === existing.id)
      );

      // Perform operations
      const createPromises = toCreate.map((item) => {
        const { ismodified, ...data } = item;
        return poChildAPI.create(data);
      });
      const updatePromises = toUpdate.map((item) =>
        poChildAPI.update(item.id, item)
      );
      const deletePromises = toDelete.map((item) => poChildAPI.delete(item.id));

      await Promise.all([
        ...createPromises,
        ...updatePromises,
        ...deletePromises,
      ]);

      // Reload data for the selected master
      const data = await poChildAPI.getByMasterId(selectedMasterId);
      setPoChildrenCache((prev) => ({ ...prev, [selectedMasterId]: data }));

      setToastBox({
        severity: "success",
        summary: "Success",
        detail: "All changes saved successfully.",
      });
    } catch (error) {
      console.error("Error saving all items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save changes.",
      });
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
    handleSaveAll,
  };
};
