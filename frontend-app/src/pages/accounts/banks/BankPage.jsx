import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useBanks } from "@/hooks/accounts/useBanks";
import BankListComponent from "./BankListComponent";
import BankFormComponent from "./BankFormComponent";
import AccountComponent from "./AccountComponent";

const BankPage = () => {
  const toast = useRef(null);
  const {
    bankList,
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
    handleRefresh,
    handleSaveBank,
    handleAccountList,
    accountList,
    fromDataAccount,
    handleChangeAccount,
    handleSaveAccount,
    handleEditAccount,
  } = useBanks();

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
          {currentView === "list"
            ? " Bank List"
            : currentView === "account"
            ? "Account List"
            : formDataBank.bank_id
            ? "Edit  Bank"
            : "Add New  Bank"}
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
              label="New Bank"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Bank List"
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
          <BankListComponent
            dataList={bankList}
            onEdit={handleEditBank}
            onDelete={handleDeleteBank}
            onAccountList={handleAccountList}
          />
        ) : currentView === "account" ? (
          <AccountComponent
            accountList={accountList}
            isBusy={isBusy}
            errors={errors}
            formData={fromDataAccount}
            onChange={handleChangeAccount}
            onSave={handleSaveAccount}
            onEdit={handleEditAccount}
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
