//as example useCategories.js 
import { useState, useEffect } from "react";
import { categoriesAPI } from "@/api/inventory/categoriesAPI";
import validate from "@/models/validator";
import t_categories from "@/models/inventory/t_categories.json";
import { generateGuid } from "@/utils/guid";

export const useCategories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataCategory, setFormDataCategory] = useState({
    category_id: generateGuid(),
    category_name: "",
  });

  const loadCategories = async (resetModified = false) => {
    try {
      const data = await categoriesAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setCategoryList(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormDataCategory((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataCategory, [field]: value },
      t_categories
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
    //console.log("category: " + JSON.stringify(category));

    setFormDataCategory(category);
    setCurrentView("form");
  };

  const handleDeleteCategory = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await categoriesAPI.delete(rowData);
      const updatedCategories = categoryList.filter(
        (c) => c.category_id !== rowData.category_id
      );
      setCategoryList(updatedCategories);

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

    const newErrors = validate(formDataCategory, t_categories);
    setErrors(newErrors);
    console.log("handleSaveCategory: " + JSON.stringify(formDataCategory));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedCategories;
      if (formDataCategory.category_id) {
        // Edit existing
        const updatedCategory = await categoriesAPI.update(formDataCategory);
        updatedCategory.ismodified = true;
        updatedCategories = categoryList.map((c) =>
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
        //console.log("newCategoryData: " + JSON.stringify(newCategoryData));

        const newCategory = await categoriesAPI.create(newCategoryData);
        newCategory.ismodified = true;
        updatedCategories = [...categoryList, newCategory];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataCategory.category_name}" added successfully.`,
        });
      }
      setCategoryList(updatedCategories);

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
    categoryList,
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
