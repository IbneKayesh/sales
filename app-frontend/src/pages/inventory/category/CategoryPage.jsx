import React, { useState, useRef, useEffect } from "react";
import { useCategory } from "@/hooks/inventory/useCategory";
import CategoryListComponent from "./CategoryListComponent";
import CategoryFormComponent from "./CategoryFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const CategoryPage = () => {
  const toast = useRef(null);
  const {
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
  } = useCategory();

  useEffect(() => {
    if (toastBox) {
      toast.current.show({
        severity: toastBox.severity,
        summary: toastBox.summary,
        detail: toastBox.detail,
        life: 3000,
      });
    }
  }, [toastBox]);

 const getHeader = () => {
  const isList = currentView === "list";

  return (
    <div className="flex align-items-center justify-content-between">
      <h2 className="m-0">
        {isList ? "Category List" : formDataCategory.category_id ? "Edit Category" : "Add New Category"}
      </h2>

      {isList ? (
        <Button
          label="New Category"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={handleAddNew}
        />
      ) : (
        <Button
          type="button"
          label="Category List"
          icon="pi pi-arrow-left"
          onClick={handleCancel}
        />
      )}
    </div>
  );
};


  return (
    <>
      <Toast ref={toast} />
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        {currentView === "list" ? (
          <CategoryListComponent
            dataList={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ) : (
          <CategoryFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataCategory}
            onChange={handleChange}
            onSave={handleSaveCategory}
          />
        )}
      </Card>
    </>
  );
};

export default CategoryPage;
