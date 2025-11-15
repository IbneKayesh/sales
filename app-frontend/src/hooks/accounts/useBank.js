import { useState, useEffect } from "react";
import { banksAPI } from "@/utils/api";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_bank from "@/models/accounts/t_bank.json";

export const useBank = () => {
  const [banks, setBanks] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataBank, setFormDataBank] = useState({
    bank_name: "",
    bank_address: "",
    routing_number: "",
    debit_balance: 0,
    credit_balance: 0,
  });

  // Load banks from API on mount
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const data = await banksAPI.getAll();
        setBanks(data);
      } catch (error) {
        console.error('Error loading banks:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load banks from server",
        });
      }
    };
    loadBanks();
  }, []);

  const handleChange = (field, value) => {
    setFormDataBank((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBank, [field]: value },
      t_bank.t_bank
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataBank({
      bank_id: "",
      bank_name: "",
      bank_address: "",
      routing_number: "",
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

  const handleEditBank = (bank) => {
    setFormDataBank(bank);
    setCurrentView("form");
  };

  const handleDeleteBank = async (id) => {
    try {
      await banksAPI.delete(id);
      const updatedBanks = banks.filter((b) => b.bank_id !== id);
      setBanks(updatedBanks);

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting bank:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete bank",
      });
    }
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataBank, t_bank.t_bank);
    setErrors(newErrors);

    console.log("handleSaveBank: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedBanks;
        if (formDataBank.bank_id) {
          // Edit existing
          const updatedBank = await banksAPI.update(formDataBank.bank_id, formDataBank);
          updatedBanks = banks.map((b) =>
            b.bank_id === formDataBank.bank_id ? updatedBank : b
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataBank.bank_name}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newBankData = { ...formDataBank, bank_id: generateGuid() };
          const newBank = await banksAPI.create(newBankData);
          updatedBanks = [...banks, newBank];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataBank.bank_name}" added successfully.`,
          };
          setToastBox(toastBox);
        }
        setBanks(updatedBanks);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving bank:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save bank",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    banks,
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
    handleSaveBank,
  };
};
