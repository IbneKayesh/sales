import React, { useState, useRef, useEffect } from "react";
import { useLedger } from "@/hooks/accounts/useLedger";
import LedgerListComponent from "./LedgerListComponent";
import LedgerFormComponent from "./LedgerFormComponent";
import TransferFormComponent from "./TransferFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const LedgerPage = () => {
  const toast = useRef(null);
  const {
    ledgerList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditLedger,
    handleDeleteLedger,
    handleRefresh,
    handleSaveLedger,
    selectedHead,
    setSelectedHead,
    //transfer
    handleAddNewTransfer,
    handleSaveTransfer,
  } = useLedger();

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
            ? "Ledger List"
            : formData.ledger_id
            ? "Edit Ledger"
            : "Add New Ledger"}
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
              label="New Ledger"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
            <Button
              label="New Transfer"
              icon="pi pi-send"
              size="small"
              onClick={handleAddNewTransfer}
            />
          </div>
        ) : (
          <Button
            label="Ledger List"
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
          <LedgerListComponent
            dataList={ledgerList}
            onEdit={handleEditLedger}
            onDelete={handleDeleteLedger}
          />
        ) : currentView === "transfer" ? (
          <TransferFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSaveTransfer}
          />
        ) : (
          <LedgerFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formData}
            onChange={handleChange}
            onSave={handleSaveLedger}
            selectedHead={selectedHead}
            setSelectedHead={setSelectedHead}
          />
        )}
      </Card>
    </>
  );
};

export default LedgerPage;
