import { useState, useEffect } from "react";
import { bankTransactionsAPI } from "@/api/bankTransactionsAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_bank_trans from "@/models/accounts/t_bank_trans.json";
import { getListByGroup, getGroupList, defaultList } from "@/utils/vtable.js";
import { useContacts } from "@/hooks/setup/useContacts";

export const useBankTransaction = () => {
  const [bankTransactions, setBankTransactions] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataBankTransaction, setFormDataBankTransaction] = useState({
    bank_account_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
    transaction_name: "",
    reference_no: "",
    transaction_details: "",
    debit_amount: 0,
    credit_amount: 0,
  });
    const { contactsBank } = useContacts();

  const [transGroups, setTransGroups] = useState([]);
  useEffect(() => {
    setTransGroups(getGroupList());
  }, []);




  const transOptions1 = [
    // Income
    { label: "Sales (+)", value: "Sales" },
    { label: "Other Income (+)", value: "Other Income" },
    { label: "Commission Received (+)", value: "Commission Received" },
    { label: "Discount Received (+)", value: "Discount Received" },

    // Purchases & Stock
    { label: "Purchase Booking (-)", value: "Purchase Booking" },
    { label: "Purchase Receive (+)", value: "Purchase Receive" },
    { label: "Purchase Order (-)", value: "Purchase Order" },
    { label: "Purchase Return (+)", value: "Purchase Return" },
    { label: "Stock Adjustment (+/-)", value: "Stock Adjustment" },

    // Expenses
    { label: "Expenses (-)", value: "Expenses" },
    { label: "Salary (-)", value: "Salary" },
    { label: "Rent (-)", value: "Rent" },
    { label: "Electricity Bill (-)", value: "Electricity Bill" },
    { label: "Internet Bill (-)", value: "Internet Bill" },
    { label: "Transport / Delivery (-)", value: "Transport" },
    { label: "Bank Charges (-)", value: "Bank Charges" },
    { label: "GST / Tax Payment (-)", value: "Tax Payment" },
    { label: "Maintenance (-)", value: "Maintenance" },

    // Cash & Bank
    { label: "Cash In (+)", value: "Cash In" },
    { label: "Cash Out (-)", value: "Cash Out" },
    { label: "Deposit to Bank (-)", value: "Bank Deposit" },
    { label: "Withdraw from Bank (+)", value: "Bank Withdraw" },

    // Dues (Receivables/Payables)
    { label: "Customer Due (+)", value: "Customer Due" },
    { label: "Customer Due Received (+)", value: "Due Received" },
    { label: "Supplier Due (-)", value: "Supplier Due" },
    { label: "Supplier Due Paid (-)", value: "Due Paid" },

    // Assets & Liabilities
    { label: "Asset Purchase (-)", value: "Asset Purchase" },
    { label: "Asset Sale (+)", value: "Asset Sale" },
    { label: "Loan Taken (+)", value: "Loan Taken" },
    { label: "Loan Repayment (-)", value: "Loan Repayment" },
  ];

  const loadBankTransactions = async (resetModified = false) => {
    try {
      const data = await bankTransactionsAPI.getAll();
      setBankTransactions(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading bank transactions:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load bank transactions from server",
      });
    }
  };

  // Load bankTransactions from API on mount
  useEffect(() => {
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
      transaction_date: new Date().toISOString().split("T")[0],
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
      const updatedBankTransactions = bankTransactions.filter(
        (b) => b.bank_transactions_id !== id
      );
      setBankTransactions(updatedBankTransactions);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting bank transaction:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete bank transaction",
      });
    }
  };

  const handleRefresh = () => {
    loadBankTransactions(true);
  };

  const handleSaveBankTransaction = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(
      formDataBankTransaction,
      t_bank_trans.t_bank_trans
    );

    // Custom validation: if debit_amount > 0 then credit_amount must be 0
    // if credit_amount > 0 then debit_amount must be 0
    // At least one of debit_amount or credit_amount must be greater than 0
    let customErrors = {};

    if (
      formDataBankTransaction.debit_amount > 0 &&
      formDataBankTransaction.credit_amount !== 0
    ) {
      customErrors.debit_amount = "Credit must be 0 when debit is entered.";
      customErrors.credit_amount = "Credit must be 0 when debit is entered.";
    }

    if (
      formDataBankTransaction.credit_amount > 0 &&
      formDataBankTransaction.debit_amount !== 0
    ) {
      customErrors.debit_amount = "Debit must be 0 when credit is entered.";
      customErrors.credit_amount = "Debit must be 0 when credit is entered.";
    }

    if (
      formDataBankTransaction.debit_amount <= 0 &&
      formDataBankTransaction.credit_amount <= 0
    ) {
      customErrors.debit_amount = "Enter either a debit or credit amount.";
      customErrors.credit_amount = "Enter either a debit or credit amount.";
    }

    const allErrors = { ...newErrors, ...customErrors };
    setErrors(allErrors);
    console.log("handleSaveBankTransaction: " + JSON.stringify(allErrors));

    if (Object.keys(allErrors).length === 0) {
      try {
        let updatedBankTransactions;
        if (formDataBankTransaction.bank_transactions_id) {
          // Edit existing
          const updatedTransaction = await bankTransactionsAPI.update(
            formDataBankTransaction.bank_transactions_id,
            formDataBankTransaction
          );

          updatedTransaction.ismodified = true;

          updatedBankTransactions = bankTransactions.map((b) =>
            b.bank_transactions_id ===
            formDataBankTransaction.bank_transactions_id
              ? updatedTransaction
              : b
          );

          setToastBox({
            severity: "success",
            summary: "Success",
            detail: `"${formDataBankTransaction.transaction_name}" updated successfully.`,
          });
        } else {
          // Add new
          const newTransactionData = {
            ...formDataBankTransaction,
            bank_transactions_id: generateGuid(),
          };
          const newTransaction = await bankTransactionsAPI.create(
            newTransactionData
          );

          newTransaction.ismodified = true;

          updatedBankTransactions = [...bankTransactions, newTransaction];

          setToastBox({
            severity: "success",
            summary: "Success",
            detail: `"${formDataBankTransaction.transaction_name}" added successfully.`,
          });
        }
        setBankTransactions(updatedBankTransactions);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error("Error saving bank transaction:", error);
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
    handleRefresh,
    handleSaveBankTransaction,
    transGroups,
    contactsBank,
  };
};
