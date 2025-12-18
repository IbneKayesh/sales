import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useBankAccounts } from "@/hooks/accounts/useBankAccounts";
import BankAccountListComponent from "./BankAccountListComponent";
import BankAccountFormComponent from "./BankAccountFormComponent";
import SubAccountComponent from "./SubAccountComponent";

const BankAccountPage = () => {
  const toast = useRef(null);
  const {
    bankAccountList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataBankAccount,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditBankAccount,
    handleDeleteBankAccount,
    handleRefresh,
    handleSaveBankAccount,
    handleSubAccountList,
    subAccountList,
    subAccount,
  } = useBankAccounts();

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
            ? "Bank Account List"
            : currentView === "subaccount"
            ? "Sub Account List"
            : formDataBankAccount.account_id
            ? "Edit Bank Account"
            : "Add New Bank Account"}
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
              label="New Bank Account"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Bank Account List"
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
          <BankAccountListComponent
            dataList={bankAccountList}
            onEdit={handleEditBankAccount}
            onDelete={handleDeleteBankAccount}
            onSubAccountList={handleSubAccountList}
          />
        ) : currentView === "subaccount" ? (
          <SubAccountComponent subAccountList={subAccountList} subAccount={subAccount}/>
        ) : (
          <BankAccountFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataBankAccount}
            onChange={handleChange}
            onSave={handleSaveBankAccount}
          />
        )}
      </Card>
    </>
  );
};

export default BankAccountPage;
