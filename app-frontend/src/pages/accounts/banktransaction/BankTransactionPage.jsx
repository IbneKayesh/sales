import React, { useState, useRef, useEffect } from "react";
import { useBankTransaction } from "@/hooks/accounts/useBankTransaction";
import { useBankAccount } from "@/hooks/accounts/useBankAccount";
import BankTransactionListComponent from "./BankTransactionListComponent";
import BankTransactionFormComponent from "./BankTransactionFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const BankTransactionPage = () => {
  const toast = useRef(null);
  const {
    bankTransactions,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataBankTransaction,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditBankTransaction,
    handleDeleteBankTransaction,
    handleRefresh,
    handleSaveBankTransaction,
    transGroups,
    contactsBank,
  } = useBankTransaction();
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
            ? "Bank Transaction List"
            : formDataBankTransaction.bank_transactions_id
            ? "Edit Bank Transaction"
            : "Add New Bank Transaction"}
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
              label="New Bank Transaction"
              icon="pi pi-plus"
              size="small"
              onClick={handleAddNew}
            />
          </div>
        ) : (
          <Button
            label="Bank Transaction List"
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
          <BankTransactionListComponent
            dataList={bankTransactions}
            onEdit={handleEditBankTransaction}
            onDelete={handleDeleteBankTransaction}
          />
        ) : (
          <BankTransactionFormComponent
            isBusy={isBusy}
            errors={errors}
            formData={formDataBankTransaction}
            onChange={handleChange}
            onSave={handleSaveBankTransaction}
            bankAccounts={bankAccounts}
            transGroups={transGroups}
            contactsBank={contactsBank}
          />
        )}
      </Card>
    </>
  );
};

export default BankTransactionPage;
