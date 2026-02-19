import { useState, useEffect } from "react";
import { banksAPI } from "@/api/accounts/banksAPI";
import validate from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import t_banks from "@/models/accounts/t_banks.json";
import t_accounts from "@/models/accounts/t_accounts";

const fromDataModel = {
  bank_id: "",
  bank_name: "",
  branch_name: "",
  routing_no: "",
  current_balance: 0,
};
const fromDataModelAccount = {
  account_id: "",
  bank_id: "",
  account_name: "",
  account_no: "",
  account_note: "",
  opening_date: new Date().toISOString().split("T")[0],
  current_balance: 0,
};

export const useBanks = () => {
  const [bankList, setBankList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataBank, setformDataBank] = useState(fromDataModel);

  const loadBanks = async (resetModified = false) => {
    try {
      const data = await banksAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setBankList(data);
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
    loadBanks();
  }, []);

  const handleChange = (field, value) => {
    setformDataBank((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formDataBank, [field]: value }, t_banks);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setformDataBank(fromDataModel);
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

  const handleEditBank = (bank) => {
    //console.log("account: " + JSON.stringify(account));

    setformDataBank(bank);
    setCurrentView("form");
  };

  const handleDeleteBank = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await banksAPI.delete(rowData);
      const updatedbanks = bankList.filter(
        (b) => b.bank_id !== rowData.bank_id
      );
      setBankList(updatedbanks);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting Bank", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Bank",
      });
    }
  };

  const handleRefresh = () => {
    loadBanks(true);
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      const newErrors = validate(formDataBank, t_banks);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...formDataBank,
        bank_id: formDataBank.bank_id ? formDataBank.bank_id : generateGuid(),
      };

      if (formDataBank.bank_id) {
        const data = await banksAPI.update(formDataNew);
      } else {
        const data = await banksAPI.create(formDataNew);
      }

      const message = formDataBank.bank_id
        ? `"${formDataBank.bank_name}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      loadBanks();
      setCurrentView("list");
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
    } finally {
      setIsBusy(false);
    }
  };

  //sub accounts

  const [accountList, setAccountList] = useState([]);
  const [fromDataAccount, setfromDataAccount] = useState(fromDataModelAccount);

  const fetchAccountList = async (bank_id) => {
    try {
      const data = await banksAPI.getAccounts(bank_id);
      //console.log("data: " + JSON.stringify(data));
      setAccountList(data);
    } catch (error) {
      console.error("Error fetching accounts", error);
    }
  };

  const handleAccountList = (account) => {
    console.log("account: " + JSON.stringify(account));
    setCurrentView("account");
    setfromDataAccount({
      account_id: "",
      bank_id: account.bank_id,
      account_name: "",
      account_no: "",
      account_note: "",
      opening_date: new Date().toISOString().split("T")[0],
      current_balance: 0,
    });
    fetchAccountList(account.bank_id);
  };

  const handleChangeAccount = (field, value) => {
    setfromDataAccount((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...fromDataAccount, [field]: value },
      t_accounts
    );
    setErrors(newErrors);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      const newErrors = validate(fromDataAccount, t_accounts);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...fromDataAccount,
        account_id: fromDataAccount.account_id
          ? fromDataAccount.account_id
          : generateGuid(),
      };

      if (fromDataAccount.account_id) {
        const data = await banksAPI.updateAccount(formDataNew);
      } else {
        const data = await banksAPI.createAccount(formDataNew);
      }

      const message = fromDataAccount.account_id
        ? `"${fromDataAccount.account_name}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      fetchAccountList(fromDataAccount.bank_id);
      setfromDataAccount({
        account_id: "",
        bank_id: fromDataAccount.bank_id,
        account_name: "",
        account_no: "",
        account_note: "",
        opening_date: new Date().toISOString().split("T")[0],
        current_balance: 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditAccount = (account) => {
    console.log("account: " + JSON.stringify(account));
    setCurrentView("account");
    setfromDataAccount(account);
  };

  const fetchAllAccountList = async () => {
    try {
      const data = await banksAPI.getAllAccounts();
      //console.log("data: " + JSON.stringify(data));
      setAccountList(data);
    } catch (error) {
      console.error("Error fetching all accounts", error);
    }
  };

  return {
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
    fetchAccountList,
    fetchAllAccountList,
    accountList,
    fromDataAccount,
    handleChangeAccount,
    handleSaveAccount,
    handleEditAccount,
  };
};
