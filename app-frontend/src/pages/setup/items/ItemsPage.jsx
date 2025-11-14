import React, { useState, useRef, useEffect } from "react";
import { useItems } from "@/hooks/setup/useItems";
import { useUnits } from "@/hooks/setup/useUnits";
import ItemsListComponent from "./ItemsListComponent";
import ItemsFormComponent from "./ItemsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ItemsPage = () => {
  const toast = useRef(null);
  const {
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
  } = useItems();
  const { units } = useUnits();

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
        {isList ? "Items List" : formDataItem.item_id ? "Edit Item" : "Add New Item"}
      </h2>

      {isList ? (
        <Button
          label="New Item"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={handleAddNew}
        />
      ) : (
        <Button
          type="button"
          label="Items List"
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
          <ItemsListComponent
            dataList={items}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ) : (
          <ItemsFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataItem}
            onChange={handleChange}
            onSave={handleSaveItem}
            units={units}
          />
        )}
      </Card>
    </>
  );
};

export default ItemsPage;
