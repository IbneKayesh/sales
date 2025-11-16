import { useState, useEffect } from "react";
import { itemsAPI } from "@/api/itemsAPI";
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
    order_qty: 0,
    stock_qty: 0,
    purchase_rate: 0,
    sales_rate: 0,
    discount_percent: 0,
    approx_profit: 0,
  });

  const loadItems = async (resetModified = false) => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load items from server",
      });
    }
  };

  // Load items from API on mount
  useEffect(() => {
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
      unit_difference_qty: 1,
      big_unit_id: "",
      order_qty: 0,
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

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete item",
      });
    }
  };

  const handleRefresh = () => {
    loadItems(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataItem, t_items.t_items);
    setErrors(newErrors);
    console.log("handleSaveItem: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedItems;
      // ---- Calculate profit before save ----
      const approxProfit = calculateApproxProfit(formDataItem);

      // Build data object with profit included
      const itemData = {
        ...formDataItem,
        approx_profit: approxProfit,
      };

      if (formDataItem.item_id) {
        // Edit existing
        const updatedItem = await itemsAPI.update(
          formDataItem.item_id,
          itemData
        );
        updatedItem.ismodified = true;
        updatedItems = items.map((i) =>
          i.item_id === formDataItem.item_id ? updatedItem : i
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataItem.item_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newItemData = { ...itemData, item_id: generateGuid() };
        const newItem = await itemsAPI.create(newItemData);
        newItem.ismodified = true;
        updatedItems = [...items, newItem];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataItem.item_name}" added successfully.`,
        });
      }
      setItems(updatedItems);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving item:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save item",
      });
    }

    setIsBusy(false);
  };

  const calculateApproxProfit = (item) => {
    const purchase = Number(item.purchase_rate || 0);
    const sales = Number(item.sales_rate || 0);
    const discountPercent = Number(item.discount_percent || 0);

    // Discount is applied on SALES price
    const discountAmount = sales * (discountPercent / 100);

    // Final selling price after discount
    const finalSellingPrice = sales - discountAmount;

    // Profit = final selling price - purchase price
    const approxProfit = finalSellingPrice - purchase;

    return approxProfit;
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
    handleRefresh,
    handleSaveItem,
  };
};
