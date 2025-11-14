import React, { useState, useRef, useEffect } from "react";
import { useBankTransaction } from "@/hooks/setup/useBankTransaction";
import { useBankAccount } from "@/hooks/setup/useBankAccount";
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
    handleSaveBankTransaction,
  } = useBankTransaction();
  const { bankAccounts } = useBankAccount();

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
        {isList ? "Bank Transaction List" : formDataBankTransaction.bank_transactions_id ? "Edit Bank Transaction" : "Add New Bank Transaction"}
      </h2>

      {isList ? (
        <Button
          label="New Bank Transaction"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={handleAddNew}
        />
      ) : (
        <Button
          type="button"
          label="Bank Transaction List"
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
          />
        )}
      </Card>
    </>
  );
};

export default BankTransactionPage;
