import { useState, useEffect } from "react";
import { ledgerAPI } from "@/api/accounts/ledgerAPI";
import validate from "@/models/validator";
import t_ledger from "@/models/accounts/t_ledger";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const fromDataModel = {
  ledger_id: "",
  account_id: "",
  contact_id: "",
  head_name: "",
  ledger_date: new Date().toISOString().split("T")[0],
  ledger_ref: "",
  ledger_note: "",
  debit_amount: 0,
  credit_amount: 0,
  edit_stop: 0,
};

export const useLedger = () => {
  const [ledgerList, setLedgerList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(fromDataModel);

  const loadLedgers = async (resetModified = false) => {
    try {
      const data = await ledgerAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setLedgerList(data);
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadLedgers();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, t_ledger);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(fromDataModel);
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

  const handleEditLedger = (ledger) => {
    //console.log("ledger: " + JSON.stringify(ledger));

    setFormData(ledger);
    setCurrentView("form");
  };

  const handleDeleteLedger = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await ledgerAPI.delete(rowData);
      const updatedLedgers = ledgerList.filter(
        (b) => b.ledger_id !== rowData.ledger_id
      );
      setLedgerList(updatedLedgers);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting Payment", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Payment",
      });
    }
  };

  const handleRefresh = () => {
    loadLedgers(true);
  };

  const handleSaveLedger = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      const newErrors = validate(formData, t_ledger);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      // Custom validation: if debit_amount > 0 then credit_amount must be 0
      // if credit_amount > 0 then debit_amount must be 0
      // At least one of debit_amount or credit_amount must be greater than 0
      let customErrors = {};

      if (
        formData.debit_amount > 0 &&
        formData.credit_amount !== 0
      ) {
        customErrors.debit_amount = "Credit must be 0 when debit is entered.";
        customErrors.credit_amount = "Credit must be 0 when debit is entered.";
      }

      if (
        formData.credit_amount > 0 &&
        formData.debit_amount !== 0
      ) {
        customErrors.debit_amount = "Debit must be 0 when credit is entered.";
        customErrors.credit_amount = "Debit must be 0 when credit is entered.";
      }

      if (
        formData.debit_amount <= 0 &&
        formData.credit_amount <= 0
      ) {
        customErrors.debit_amount = "Enter either a debit or credit amount.";
        customErrors.credit_amount = "Enter either a debit or credit amount.";
      }

      const allErrors = { ...newErrors, ...customErrors };
      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...formData,
        ledger_id: formData.ledger_id
          ? formData.ledger_id
          : generateGuid(),
      };

      if (formData.ledger_id) {
        const data = await ledgerAPI.update(formDataNew);
      } else {
        const data = await ledgerAPI.create(formDataNew);
      }

      const message = formData.ledger_id
        ? `"${formData.head_name}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      loadLedgers();
      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save data",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    ledgerList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditLedger,
    handleDeleteLedger,
    handleRefresh,
    handleSaveLedger,
  };
};
