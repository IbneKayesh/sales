import React, { useState, useRef, useEffect } from "react";
import { useBankPayments } from "@/hooks/accounts/useBankPayments";
import PaymentsListComponent from "./PaymentsListComponent";
import PaymentsFormComponent from "./PaymentsFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const BankPaymentsPage = () => {
  const toast = useRef(null);
  const {
    bankPaymentsDueList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataBankPayment,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditBankPayment,
    handleDeleteBankPayment,
    handleRefresh,
    handleSaveBankPayment,
  } = useBankPayments();

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
            ? "Bank Payment Due List"
            : formDataBankPayment.bank_payments_id
            ? "Edit Bank Payment Due"
            : "Add New Bank Payment Due"}
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
              label="New Bank Payment Due"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
              disabled
            />
          </div>
        ) : (
          <Button
            label="Bank Payment Due List"
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
            dataList={bankPaymentsDueList}
            onEdit={handleEditBankPayment}
            onDelete={handleDeleteBankPayment}
          />
        ) : (
          <PaymentsFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataBankPayment}
            onChange={handleChange}
            onSave={handleSaveBankPayment}
          />
        )}
      </Card>
    </>
  );
};

export default BankPaymentsPage;
