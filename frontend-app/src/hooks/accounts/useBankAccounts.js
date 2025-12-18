import { useState, useEffect } from "react";
import { bankaccountsAPI } from "@/api/accounts/bankaccountsAPI";
import validate from "@/models/validator";
import t_bank_accounts from "@/models/accounts/t_bank_accounts";
import { generateGuid } from "@/utils/guid";

const fromDataModel = {
  account_id: "",
  bank_name: "",
  branch_name: "",
  account_no: "",
  account_name: "",
  opening_date: new Date().toISOString().split("T")[0],
  current_balance: 0,
};

export const useBankAccounts = () => {
  const [bankAccountList, setBankAccountList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataBankAccount, setformDataBankAccount] = useState(fromDataModel);

  const loadBankAccounts = async (resetModified = false) => {
    try {
      const data = await bankaccountsAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setBankAccountList(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadBankAccounts();
  }, []);

  const handleChange = (field, value) => {
    setformDataBankAccount((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBankAccount, [field]: value },
      t_bank_accounts
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setformDataBankAccount(fromDataModel);
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

  const handleEditBankAccount = (bankaccount) => {
    //console.log("bankaccount: " + JSON.stringify(bankaccount));

    setformDataBankAccount(bankaccount);
    setCurrentView("form");
  };

  const handleDeleteBankAccount = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await bankaccountsAPI.delete(rowData);
      const updatedBankaccounts = bankAccountList.filter(
        (b) => b.account_id !== rowData.account_id
      );
      setBankAccountList(updatedBankaccounts);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting Bank Account", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Bank Account",
      });
    }
  };

  const handleRefresh = () => {
    loadBankAccounts(true);
  };

  const handleSaveBankAccount = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataBankAccount, t_bank_accounts);
    setErrors(newErrors);
    console.log(
      "handleSaveBankaccount: " + JSON.stringify(formDataBankAccount)
    );

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedBankaccounts;
      if (formDataBankAccount.account_id) {
        // Edit existing
        const updatedBankaccount = await bankaccountsAPI.update(
          formDataBankAccount
        );
        updatedBankaccount.ismodified = true;
        updatedBankaccounts = bankAccountList.map((b) =>
          b.account_id === formDataBankAccount.account_id
            ? updatedBankaccount
            : b
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataBankAccount.bank_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newBankaccountData = {
          ...formDataBankAccount,
          account_id: generateGuid(),
        };
        //console.log("newBankaccountData: " + JSON.stringify(newBankaccountData));

        const newBankaccount = await bankaccountsAPI.create(newBankaccountData);
        newBankaccount.ismodified = true;
        updatedBankaccounts = [...bankAccountList, newBankaccount];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataBankAccount.bank_name}" added successfully.`,
        });
      }
      setBankAccountList(updatedBankaccounts);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving bankaccount", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save bankaccount",
      });
    }

    setIsBusy(false);
  };

  //sub accounts

  const [subAccountList, setSubAccountList] = useState([]);
  const [subAccount, setSubAccount] = useState({});

  const fetchSubAccountList = async (account_id) => {
    try {
      const data = await bankaccountsAPI.getSubAccounts(account_id);
      console.log("data: " + JSON.stringify(data));
      setSubAccountList(data);
    } catch (error) {
      console.error("Error fetching subaccounts", error);
    }
  };

  const handleSubAccountList = (bankaccount) => {
    console.log("bankaccount: " + JSON.stringify(bankaccount));
    setCurrentView("subaccount");
    setformDataBankAccount(bankaccount);
    fetchSubAccountList(bankaccount.account_id);
  };

  return {
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
  };
};
