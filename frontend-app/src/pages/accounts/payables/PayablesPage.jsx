import React, { useState, useRef, useEffect } from "react";
import PayableListComponent from "./PayableListComponent";
import PayableFormComponent from "./PayableFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { usePayables } from "@/hooks/accounts/usePayables";

const PayablesPage = () => {
  const toast = useRef(null);
  const {
    payableDueList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPayableDue,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPayableDue,
    handleDeletePayableDue,
    handleRefresh,
    handleSavePayableDue,
  } = usePayables();

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
            ? "Payable Due List"
            : formDataPayableDue.payable_dues_id
              ? "Edit Payable Due"
              : "Add New Payable Due"}
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
              label="New Payable Due"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
              disabled
            />
          </div>
        ) : (
          <Button
            label="Payable Due List"
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
          <PayableListComponent
            dataList={payableDueList}
            onEdit={handleEditPayableDue}
            onDelete={handleDeletePayableDue}
          />
        ) : (
          <PayableFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataPayableDue}
            onChange={handleChange}
            onSave={handleSavePayableDue}
          />
        )}
      </Card>
    </>
  );
};

export default PayablesPage;
