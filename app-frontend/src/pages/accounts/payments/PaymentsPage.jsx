import React, { useState, useRef, useEffect } from "react";
import { usePayments } from "@/hooks/accounts/usePayments";
import { useBankAccount } from "@/hooks/accounts/useBankAccount";
import PaymentsListComponent from "./PaymentsListComponent";
import PaymentsFormComponent from "./PaymentsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const PaymentsPage = () => {
  const toast = useRef(null);
  const {
    dueList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPayment,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPayment,
    handleDeletePayment,
    handleRefresh,
    handleSavePayment,
  } = usePayments();
  const { bankAccounts } = useBankAccount();

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
            ? "Payments List"
            : formDataPayment.payments_id
            ? "Edit Payments"
            : "Add New Payments"}
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
              label="New Payment"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Payment List"
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
          <PaymentsListComponent
            dataList={dueList}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        ) : (
          <PaymentsFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataPayment}
            onChange={handleChange}
            onSave={handleSavePayment}
            bankAccounts={bankAccounts}
          />
        )}
      </Card>
    </>
  );
};

export default PaymentsPage;
