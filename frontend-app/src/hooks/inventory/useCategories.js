//as example useCategories.js
import { useState, useEffect } from "react";
import { categoriesAPI } from "@/api/inventory/categoriesAPI";
import validate from "@/models/validator";
import t_categories from "@/models/inventory/t_categories.json";
import { generateGuid } from "@/utils/guid";

const dataModel = {
  category_id: "",
  category_name: "",
  edit_stop: 0,
};

export const useCategories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      // response = { message, data }
      setCategoryList(response.data);
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formData, [field]: value },
      t_categories
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
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

  const handleEditCategory = (category) => {
    //console.log("category: " + JSON.stringify(category));

    setFormData(category);
    setCurrentView("form");
  };

  const handleDeleteCategory = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await categoriesAPI.delete(rowData);

      // Remove deleted unit from local state
      const updatedList = categoryList.filter(
        (c) => c.category_id !== rowData.category_id
      );
      setCategoryList(updatedList);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: response.message || "Deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete data",
      });
    }
  };

  const handleRefresh = () => {
    loadCategories();
  };

  
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, t_categories);
      setErrors(newErrors);
      console.log("handleSaveCategory:", JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure category_id exists (for create)
      const formDataNew = {
        ...formData,
        category_id: formData.category_id || generateGuid(),
      };

      // Call API and get { message, data }
      let response;
      if (formData.category_id) {
        response = await categoriesAPI.update(formDataNew);
      } else {
        response = await categoriesAPI.create(formDataNew);
      }

      // Update toast using API message
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message || "Operation successful",
      });

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadCategories(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error saving data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to save data",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    categoryList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditCategory,
    handleDeleteCategory,
    handleRefresh,
    handleSaveCategory,
  };
};
