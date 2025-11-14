import { useState, useEffect } from "react";
import { bankTransactionsAPI } from "@/utils/api";

import validate from "@/models/validator";
import t_bank_trans from "@/models/setup/t_bank_trans.json";

export const useBankTransaction = () => {
  const [bankTransactions, setBankTransactions] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataBankTransaction, setFormDataBankTransaction] = useState({
    bank_account_id: "",
    transaction_date: "",
    transaction_name: "",
    reference_no: "",
    transaction_details: "",
    debit_amount: 0,
    credit_amount: 0,
  });

  // Load bankTransactions from API on mount
  useEffect(() => {
    const loadBankTransactions = async () => {
      try {
        const data = await bankTransactionsAPI.getAll();
        setBankTransactions(data);
      } catch (error) {
        console.error('Error loading bank transactions:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load bank transactions from server",
        });
      }
    };
    loadBankTransactions();
  }, []);

  const handleChange = (field, value) => {
    setFormDataBankTransaction((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBankTransaction, [field]: value },
      t_bank_trans.t_bank_trans
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataBankTransaction({
      bank_transactions_id: "",
      bank_account_id: "",
      transaction_date: "",
      transaction_name: "",
      reference_no: "",
      transaction_details: "",
      debit_amount: 0,
      credit_amount: 0,
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEditBankTransaction = (bankTransaction) => {
    setFormDataBankTransaction(bankTransaction);
    setCurrentView("form");
  };

  const handleDeleteBankTransaction = async (id) => {
    try {
      await bankTransactionsAPI.delete(id);
      const updatedBankTransactions = bankTransactions.filter((b) => b.bank_transactions_id !== id);
      setBankTransactions(updatedBankTransactions);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting bank transaction:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete bank transaction",
      });
    }
  };

  const handleSaveBankTransaction = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataBankTransaction, t_bank_trans.t_bank_trans);
    setErrors(newErrors);

    console.log("handleSaveBankTransaction: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedBankTransactions;
        if (formDataBankTransaction.bank_transactions_id) {
          // Edit existing
          const updatedTransaction = await bankTransactionsAPI.update(formDataBankTransaction.bank_transactions_id, formDataBankTransaction);
          updatedBankTransactions = bankTransactions.map((b) =>
            b.bank_transactions_id === formDataBankTransaction.bank_transactions_id ? updatedTransaction : b
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataBankTransaction.transaction_name}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newTransaction = await bankTransactionsAPI.create(formDataBankTransaction);
          updatedBankTransactions = [...bankTransactions, newTransaction];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataBankTransaction.transaction_name}" added successfully.`,
          };
          setToastBox(toastBox);
        }
        setBankTransactions(updatedBankTransactions);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving bank transaction:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save bank transaction",
        });
      }
    }

    setIsBusy(false);
  };

  return {
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
  };
};
