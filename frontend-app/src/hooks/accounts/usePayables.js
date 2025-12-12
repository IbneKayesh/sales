import { useState, useEffect } from "react";
import { payablesAPI } from "@/api/accounts/payablesAPI";
import validate from "@/models/validator";
import t_payments from "@/models/accounts/t_payments";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const fromDataModel = {
  payment_id: "",
  contact_id: "",
  payment_head: "",
  payment_mode: "",
  payment_date: new Date().toISOString().split("T")[0],
  payment_amount: 0,
  balance_amount: 0,
  payment_note: "",
  ref_no: "",
  allocation_amount: 0,
  ismodified: false,
};

export const usePayables = () => {
  const [payableDueList, setPayableDueList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataPayableDue, setformDataPayableDue] = useState(fromDataModel);

  const loadPayableDues = async (resetModified = false) => {
    try {
      const data = await payablesAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setPayableDueList(data);
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
    loadPayableDues();
  }, []);

  const handleChange = (field, value) => {
    setformDataPayableDue((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataPayableDue, [field]: value },
      t_payments
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setformDataPayableDue(fromDataModel);
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

  const handleEditPayableDue = (payableDue) => {
    //console.log("bankaccount: " + JSON.stringify(bankaccount));

    const newPayableDue = {
      ...payableDue,
      payment_date: new Date().toISOString().split("T")[0],
    };
    setformDataPayableDue(newPayableDue);
    setCurrentView("form");
  };

  const handleDeletePayableDue = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await payablesAPI.delete(rowData);
      const updatedPayableDues = payableDueList.filter(
        (p) => p.payment_id !== rowData.payment_id
      );
      setPayableDueList(updatedPayableDues);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting Payable Due", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Payable Due",
      });
    }
  };

  const handleRefresh = () => {
    loadPayableDues(true);
  };

  const handleSavePayableDue = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    if (formDataPayableDue.payment_amount > formDataPayableDue.balance_amount) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Payment amount cannot be greater than Due balance amount.",
      });
      setIsBusy(false);
      return;
    }

    const newErrors = validate(formDataPayableDue, t_payments);
    setErrors(newErrors);
    console.log("handleSavePayableDue: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedPayableDues;
      if (formDataPayableDue.payment_id) {
        // Edit existing
        const updatedPayableDue = await payablesAPI.update(formDataPayableDue);
        // updatedPayableDue.ismodified = true;
        // updatedPayableDues = payableDueList.map((p) =>
        //   p.payment_id === formDataPayableDue.payment_id ? updatedPayableDue : p
        // );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataPayableDue.ref_no}" updated successfully.`,
        });
      } else {
        // Add new
        const newPayableDueData = {
          ...formDataPayableDue,
          payment_id: generateGuid(),
        };
        console.log("newPayableDueData: " + JSON.stringify(newPayableDueData));

        const newPayableDue =
          await payablesAPI.create(
            newPayableDueData
          );
        //newPayableDue.ismodified = true;
        //updatedPayableDues = [...payableDueList, newPayableDue];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataPayableDue.ref_no}" added successfully.`,
        });
      }
      //setPayableDueList(updatedPayableDues);
      //call update process
      await closingProcessAPI("Payments", formDataPayableDue.ref_no);
      loadPayableDues();
      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving Payable Due", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save Payable Due",
      });
    }

    setIsBusy(false);
  };

  return {
    payableDueList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPayableDue,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPayableDue,
    handleDeletePayableDue,
    handleRefresh,
    handleSavePayableDue,
  };
};