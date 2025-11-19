import React, { useState, useRef, useEffect } from "react";
import { useItems } from "@/hooks/inventory/useItems";
import ItemsListComponent from "./ItemsListComponent";
import ItemsFormComponent from "./ItemsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
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
    selectedFilter,
    filterOptions,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditItem,
    handleDeleteItem,
    handleRefresh,
    handleFilterChange,
    handleSaveItem,
  } = useItems();

  useEffect(() => {
    if (toastBox && toast.current) {
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
        <h3 className="m-0">
          {isList
            ? "Items List"
            : formDataItem.item_id
            ? "Edit Item"
            : "Add New Item"}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Dropdown
              value={selectedFilter}
              options={filterOptions}
              onChange={(e) => handleFilterChange(e.value)}
              placeholder="Select Filter"
              optionLabel="label"
              optionValue="value"
              className="w-full md:w-auto"
            />
            <Button
              label="New Item"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Items List"
            icon="pi pi-arrow-left"
            size="small"
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
          />
        )}
      </Card>
    </>
  );
};

export default ItemsPage;
