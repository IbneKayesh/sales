import React, { useState, useRef, useEffect } from "react";
import { useUnits } from "@/hooks/inventory/useUnits";
import UnitsListComponent from "./UnitsListComponent";
import UnitsFormComponent from "./UnitsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const UnitsPage = () => {
  const toast = useRef(null);
  const {
    unitList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataUnit,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUnit,
    handleDeleteUnit,
    handleRefresh,
    handleSaveUnit,
  } = useUnits();

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
            ? "Units List"
            : formDataUnit.unit_id
            ? "Edit Unit"
            : "Add New Unit"}
        </h3>

        {isList ? (
          <div className="flex gap-2">
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              size="small"
              severity="secondary"
              onClick={handleRefresh}
            />
            <Button
              label="New Unit"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Units List"
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
          <UnitsListComponent
            dataList={unitList}
            onEdit={handleEditUnit}
            onDelete={handleDeleteUnit}
          />
        ) : (
          <UnitsFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataUnit}
            onChange={handleChange}
            onSave={handleSaveUnit}
          />
        )}
      </Card>
    </>
  );
};

export default UnitsPage;
