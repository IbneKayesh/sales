import React, { useState, useRef, useEffect } from "react";
import { usePayments } from "@/hooks/accounts/usePayments";
import PaymentListComponent from "./PaymentListComponent";
import PaymentFormComponent from "./PaymentFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const PaymentsPage = () => {
  const toast = useRef(null);
  const {
    paymentList,
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
            ? "Payment List"
            : formDataPayment.payment_id
              ? "Edit Payment"
              : "Add New Payment"}
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
          <PaymentListComponent
            dataList={paymentList}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        ) : (
          <PaymentFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataPayment}
            onChange={handleChange}
            onSave={handleSavePayment}
          />
        )}
      </Card>
    </>
  );
};

export default PaymentsPage;
