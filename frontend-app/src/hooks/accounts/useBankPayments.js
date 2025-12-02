import { useState, useEffect } from "react";
import { bankpaymentsAPI } from "@/api/accounts/bankpaymentsAPI";
import validate from "@/models/validator";
import t_bank_payments from "@/models/accounts/t_bank_payments";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

export const useBankPayments = () => {
  const [bankPaymentsDueList, setBankPaymentsDueList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataBankPayment, setFormDataBankPayment] = useState({
    payment_id: "",
    account_id: "",
    payment_head: "",
    payment_mode: "",
    payment_date: new Date().toISOString().split("T")[0],
    contact_id: "",
    ref_no: "",
    payment_amount: 0,
    payment_note: "",
  });

  const loadPurchaseDues = async () => {
    try {
      const data = await bankpaymentsAPI.getAllPurchaseDues();
      console.log("data: " + JSON.stringify(data));
      setBankPaymentsDueList(data);
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
    loadPurchaseDues();
  }, []);

  const handleChange = (field, value) => {
    setFormDataBankPayment((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBankPayment, [field]: value },
      t_bank_payments
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataBankPayment({
      payment_id: "",
      account_id: "",
      payment_head: "",
      payment_mode: "",
      payment_date: new Date().toISOString().split("T")[0],
      contact_id: "",
      ref_no: "",
      payment_amount: 0,
      payment_note: "",
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

  const handleEditBankPayment = (bankpayment) => {
    //console.log("bankpayment: " + JSON.stringify(bankpayment));

    setFormDataBankPayment(bankpayment);
    setCurrentView("form");
  };

  const handleDeleteBankPayment = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await bankpaymentsAPI.delete(rowData);
      const updatedBankpayments = bankPaymentsDueList.filter(
        (b) => b.payment_id !== rowData.payment_id
      );
      setBankPaymentsDueList(updatedBankpayments);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting Bank Payment", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Bank Payment",
      });
    }
  };

  const handleRefresh = () => {
    loadPurchaseDues(true);
  };

  const handleSaveBankPayment = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataBankPayment, t_bank_payments);
    setErrors(newErrors);
    console.log(
      "handleSaveBankPayment: " + JSON.stringify(formDataBankPayment)
    );

    if (formDataBankPayment.payment_amount > formDataBankPayment.due_amount) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail:
          "Payment amount cannot be greater than due amount " +
          formDataBankPayment.due_amount,
      });
      setIsBusy(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedBankPayments;
      if (formDataBankPayment.payment_id) {
        // Edit existing
        const updatedBankPayment = await bankpaymentsAPI.update(
          formDataBankPayment
        );
        updatedBankPayment.ismodified = true;
        updatedBankPayments = bankPaymentsDueList.map((b) =>
          b.payment_id === formDataBankPayment.payment_id
            ? updatedBankPayment
            : b
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataBankPayment.payment_head}" updated successfully.`,
        });
      } else {
        // Add new
        const newBankPaymentData = {
          ...formDataBankPayment,
          payment_id: generateGuid(),
        };
        //console.log("newBankPaymentData: " + JSON.stringify(newBankPaymentData));

        const newBankPayment = await bankpaymentsAPI.create(newBankPaymentData);
        //newBankPayment.ismodified = true;
        //updatedBankPayments = [...bankPaymentsDueList, newBankPayment];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataBankPayment.payment_head}" added successfully.`,
        });
      }
      //setBankPaymentsDueList(updatedBankPayments);

      handleClear();
      setCurrentView("list");
      loadPurchaseDues(true);

      //call update process
      await closingProcessAPI("Bank Payments",formDataBankPayment.ref_no);

    } catch (error) {
      console.error("Error saving bank payment", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save bank payment",
      });
    }

    setIsBusy(false);
  };

  return {
    bankPaymentsDueList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataBankPayment,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditBankPayment,
    handleDeleteBankPayment,
    handleRefresh,
    handleSaveBankPayment,
  };
};
