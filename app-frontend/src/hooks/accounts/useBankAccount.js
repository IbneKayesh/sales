import { useState, useEffect } from "react";
import { bankAccountsAPI } from "@/api/bankAccountsAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_bank_account from "@/models/accounts/t_bank_account.json";

export const useBankAccount = () => {
  const [bankAccounts, setBankAccounts] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataBankAccount, setFormDataBankAccount] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
    opening_date: new Date().toISOString().split("T")[0],
    debit_balance: 0,
    credit_balance: 0,
    current_balance: 0,
    is_default: 0,
  });

  const loadBankAccounts = async (resetModified = false) => {
    try {
      const data = await bankAccountsAPI.getAll();
      setBankAccounts(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading bank accounts:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load bank accounts from server",
      });
    }
  };

  // Load bankAccounts from API on mount
  useEffect(() => {
    loadBankAccounts();
  }, []);

  const handleChange = (field, value) => {
    setFormDataBankAccount((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBankAccount, [field]: value },
      t_units.t_units
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataBankAccount({
      bank_name: "",
      account_name: "",
      account_number: "",
      opening_date: new Date().toISOString().split("T")[0],
      debit_balance: 0,
      credit_balance: 0,
      current_balance: 0,
      is_default: 0,
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
    console.log("bankAccount: " + JSON.stringify(bankAccount));

    setFormDataBankAccount(bankAccount);
    setCurrentView("form");
  };

  const handleDeleteBankAccount = async (id) => {
    try {
      await bankAccountsAPI.delete(id);
      const updatedBankAccounts = bankAccounts.filter(
        (b) => b.bank_account_id !== id
      );
      setBankAccounts(updatedBankAccounts);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting bank account:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete bank account",
      });
    }
  };

  const handleRefresh = () => {
    loadBankAccounts(true);
  };

  const handleSaveBankAccount = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(
      formDataBankAccount,
      t_bank_account.t_bank_account
    );
    setErrors(newErrors);
    console.log(
      "handleSaveBankAccount: " + JSON.stringify(formDataBankAccount)
    );

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedBankAccounts;
      if (formDataBankAccount.bank_account_id) {
        // Edit existing
        const updatedAccount = await bankAccountsAPI.update(
          formDataBankAccount.bank_account_id,
          formDataBankAccount
        );
        updatedAccount.ismodified = true;
        updatedBankAccounts = bankAccounts.map((b) =>
          b.bank_account_id === formDataBankAccount.bank_account_id
            ? updatedAccount
            : b
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataBankAccount.account_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newAccountData = {
          ...formDataBankAccount,
          bank_account_id: generateGuid(),
        };
        const newAccount = await bankAccountsAPI.create(newAccountData);
        newAccount.ismodified = true;
        updatedBankAccounts = [...bankAccounts, newAccount];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataBankAccount.account_name}" added successfully.`,
        });
      }
      setBankAccounts(updatedBankAccounts);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving bank account:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save bank account",
      });
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
    handleRefresh,
    handleSaveBankAccount,
  };
};
