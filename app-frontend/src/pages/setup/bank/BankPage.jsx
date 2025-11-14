import React, { useState, useRef, useEffect } from "react";
import { useBank } from "@/hooks/setup/useBank";
import BankListComponent from "./BankListComponent";
import BankFormComponent from "./BankFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const BankPage = () => {
  const toast = useRef(null);
  const {
    banks,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataBank,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditBank,
    handleDeleteBank,
    handleSaveBank,
  } = useBank();

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
        {isList ? "Bank List" : formDataBank.bank_id ? "Edit Bank" : "Add New Bank"}
      </h2>

      {isList ? (
        <Button
          label="New Bank"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={handleAddNew}
        />
      ) : (
        <Button
          type="button"
          label="Bank List"
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
          <BankListComponent
            dataList={banks}
            onEdit={handleEditBank}
            onDelete={handleDeleteBank}
          />
        ) : (
          <BankFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataBank}
            onChange={handleChange}
            onSave={handleSaveBank}
          />
        )}
      </Card>
    </>
  );
};

export default BankPage;
