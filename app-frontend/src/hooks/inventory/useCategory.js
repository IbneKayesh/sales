import { useState, useEffect } from "react";
import { categoriesAPI } from "@/utils/api";
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
    category_description: "",
  });

  // Load categories from API on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load categories from server",
        });
      }
    };
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
      category_description: "",
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

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error("Error deleting category:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete category",
      });
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataCategory, t_category.t_category);
    setErrors(newErrors);

    console.log("handleSaveCategory: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedCategories;
        if (formDataCategory.category_id) {
          // Edit existing
          const updatedCategory = await categoriesAPI.update(
            formDataCategory.category_id,
            formDataCategory
          );
          updatedCategories = categories.map((c) =>
            c.category_id === formDataCategory.category_id ? updatedCategory : c
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataCategory.category_name}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newCategoryData = {
            ...formDataCategory,
            category_id: generateGuid(),
          };

          const newCategory = await categoriesAPI.create(newCategoryData);
          updatedCategories = [...categories, newCategory];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataCategory.category_name}" added successfully.`,
          };
          setToastBox(toastBox);
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
    handleSaveCategory,
  };
};
