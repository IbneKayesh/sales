import { useState, useEffect } from "react";
import { bankAccountsAPI } from "@/utils/api";

import validate from "@/models/validator";
import t_bank_account from "@/models/setup/t_bank_account.json";

export const useBankAccount = () => {
  const [bankAccounts, setBankAccounts] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataBankAccount, setFormDataBankAccount] = useState({
    bank_id: "",
    account_name: "",
    account_number: "",
    opening_date: "",
    debit_balance: 0,
    credit_balance: 0,
  });

  // Load bankAccounts from API on mount
  useEffect(() => {
    const loadBankAccounts = async () => {
      try {
        const data = await bankAccountsAPI.getAll();
        setBankAccounts(data);
      } catch (error) {
        console.error('Error loading bank accounts:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load bank accounts from server",
        });
      }
    };
    loadBankAccounts();
  }, []);

  const handleChange = (field, value) => {
    setFormDataBankAccount((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBankAccount, [field]: value },
      t_bank_account.t_bank_account
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataBankAccount({
      bank_account_id: "",
      bank_id: "",
      account_name: "",
      account_number: "",
      opening_date: "",
      debit_balance: 0,
      credit_balance: 0,
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

  const handleEditBankAccount = (bankAccount) => {
    setFormDataBankAccount(bankAccount);
    setCurrentView("form");
  };

  const handleDeleteBankAccount = async (id) => {
    try {
      await bankAccountsAPI.delete(id);
      const updatedBankAccounts = bankAccounts.filter((b) => b.bank_account_id !== id);
      setBankAccounts(updatedBankAccounts);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting bank account:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete bank account",
      });
    }
  };

  const handleSaveBankAccount = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataBankAccount, t_bank_account.t_bank_account);
    setErrors(newErrors);

    console.log("handleSaveBankAccount: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedBankAccounts;
        if (formDataBankAccount.bank_account_id) {
          // Edit existing
          const updatedAccount = await bankAccountsAPI.update(formDataBankAccount.bank_account_id, formDataBankAccount);
          updatedBankAccounts = bankAccounts.map((b) =>
            b.bank_account_id === formDataBankAccount.bank_account_id ? updatedAccount : b
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataBankAccount.account_name}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newAccount = await bankAccountsAPI.create(formDataBankAccount);
          updatedBankAccounts = [...bankAccounts, newAccount];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataBankAccount.account_name}" added successfully.`,
          };
          setToastBox(toastBox);
        }
        setBankAccounts(updatedBankAccounts);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving bank account:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save bank account",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    bankAccounts,
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
    handleSaveBankAccount,
  };
};
