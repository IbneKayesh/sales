import { useState, useEffect } from "react";
import { categoriesAPI } from "@/api/categoriesAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_category from "@/models/inventory/t_category.json";

export const useCategory = () => {
  const [categories, setCategories] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataCategory, setFormDataCategory] = useState({
    category_name: "",
  });

  const loadCategories = async (resetModified = false) => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load categories from server",
      });
    }
  };

  // Load categories from API on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormDataCategory((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataCategory, [field]: value },
      t_category.t_category
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataCategory({
      category_id: "",
      category_name: "",
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

  const handleEditCategory = (category) => {
    setFormDataCategory(category);
    setCurrentView("form");
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoriesAPI.delete(id);
      const updatedCategories = categories.filter((c) => c.category_id !== id);
      setCategories(updatedCategories);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete category",
      });
    }
  };
  const handleRefresh = () => {
    loadCategories(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataCategory, t_category.t_category);
    setErrors(newErrors);
    console.log("handleSaveCategory: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedCategories;
      if (formDataCategory.category_id) {
        // Edit existing
        const updatedCategory = await categoriesAPI.update(
          formDataCategory.category_id,
          formDataCategory
        );
        updatedCategory.ismodified = true;
        updatedCategories = categories.map((c) =>
          c.category_id === formDataCategory.category_id ? updatedCategory : c
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataCategory.category_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newCategoryData = {
          ...formDataCategory,
          category_id: generateGuid(),
        };

        const newCategory = await categoriesAPI.create(newCategoryData);
        newCategory.ismodified = true;
        updatedCategories = [...categories, newCategory];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataCategory.category_name}" added successfully.`,
        });
      }
      setCategories(updatedCategories);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving category:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save category",
      });
    }

    setIsBusy(false);
  };

  return {
    categories,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataCategory,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditCategory,
    handleDeleteCategory,
    handleRefresh,
    handleSaveCategory,
  };
};
