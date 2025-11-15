import { useState, useEffect } from "react";
import { itemsAPI } from "@/utils/api";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_items from "@/models/inventory/t_items.json";

export const useItems = () => {
  const [items, setItems] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataItem, setFormDataItem] = useState({
    item_name: "",
    item_description: "",
    category_id: "",
    small_unit_id: "",
    unit_difference_qty: 1,
    big_unit_id: "",
    stock_qty: 0,
    purchase_rate: 0,
    sales_rate: 0,
    discount_percent: 0,
    approx_profit: 0,
  });

  // Load items from API on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await itemsAPI.getAll();
        setItems(data);
      } catch (error) {
        console.error('Error loading items:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load items from server",
        });
      }
    };
    loadItems();
  }, []);

  const handleChange = (field, value) => {
    setFormDataItem((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataItem, [field]: value },
      t_items.t_items
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataItem({
      item_id: "",
      item_name: "",
      item_description: "",
      category_id: "",
      small_unit_id: "",
      unit_difference_qty: 0,
      big_unit_id: "",
      stock_qty: 0,
      purchase_rate: 0,
      sales_rate: 0,
      discount_percent: 0,
      approx_profit: 0,
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

  const handleEditItem = (item) => {
    setFormDataItem(item);
    setCurrentView("form");
  };

  const handleDeleteItem = async (id) => {
    try {
      await itemsAPI.delete(id);
      const updatedItems = items.filter((i) => i.item_id !== id);
      setItems(updatedItems);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting item:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete item",
      });
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataItem, t_items.t_items);
    setErrors(newErrors);

    console.log("handleSaveItem: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedItems;
        if (formDataItem.item_id) {
          // Edit existing
          const updatedItem = await itemsAPI.update(formDataItem.item_id, formDataItem);
          updatedItems = items.map((i) =>
            i.item_id === formDataItem.item_id ? updatedItem : i
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataItem.item_name}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newItemData = { ...formDataItem, item_id: generateGuid() };
          const newItem = await itemsAPI.create(newItemData);
          updatedItems = [...items, newItem];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataItem.item_name}" added successfully.`,
          };
          setToastBox(toastBox);
        }
        setItems(updatedItems);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving item:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save item",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    items,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataItem,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,
  };
};
