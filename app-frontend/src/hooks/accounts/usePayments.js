import { useState, useEffect } from "react";
import { paymentsAPI } from "@/api/paymentsAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_payments from "@/models/accounts/t_payments.json";

export const usePayments = () => {
  const [dueList, setDueList] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataPayment, setFormDataPayment] = useState({
    payment_id: "",
    bank_account_id: "",
    payment_type: "",
    payment_mode: "",
    payment_date: new Date().toISOString().split("T")[0],
    contact_id: "",
    ref_no: "",
    payment_amount: 0,
    order_amount: 0,
    payment_note: "",
  });

  const loadDues = async (resetModified = false) => {
    try {
      const data = await paymentsAPI.getAllDues();
      console.log("dues data: " + JSON.stringify(data));
      setDueList(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading dues:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load dues from server",
      });
    }
  };

  // Load bankAccounts from API on mount
  useEffect(() => {
    loadDues();
  }, []);

  const handleChange = (field, value) => {
    setFormDataPayment((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataPayment, [field]: value },
      t_payments.t_payments
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataPayment({
      payment_id: "",
      bank_account_id: "",
      payment_type: "",
      payment_mode: "",
      payment_date: new Date().toISOString().split("T")[0],
      contact_id: "",
      ref_no: "",
      payment_amount: 0,
      order_amount: 0,
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

  const handleEditPayment = (payment) => {
    //console.log("payment: " + JSON.stringify(payment));

    setFormDataPayment({
      payment_id: "",
      bank_account_id: "",
      payment_type: payment.order_type,
      payment_mode: "Cash",
      payment_date: new Date().toISOString().split("T")[0],
      contact_id: payment.contact_id,
      contact_name: payment.contact_name,
      ref_no: payment.order_no,
      due_amount: payment.due_amount,
      payment_amount: payment.due_amount,
      order_amount: 0,
      payment_note: "",
    });

    //setFormDataPayment(payment);
    setCurrentView("form");
  };

  const handleDeletePayment = async (id) => {
    try {
      await paymentsAPI.delete(id);
      const updatedPayments = dues.filter((p) => p.payment_id !== id);
      setDues(updatedPayments);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting payment:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete payment",
      });
    }
  };

  const handleRefresh = () => {
    loadDues(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataPayment, t_payments.t_payments);
    setErrors(newErrors);

    //console.log("newErrors: " + JSON.stringify(newErrors));
    //console.log("handleSavePayment: " + JSON.stringify(formDataPayment));

    if (formDataPayment.payment_amount > formDataPayment.due_amount) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail:
          "Payment amount cannot be greater than due amount " +
          formDataPayment.due_amount,
      });
      setIsBusy(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedDues;
      if (formDataPayment.payment_id) {
        // Edit existing
        const updatedPayment = await paymentsAPI.update(
          formDataPayment.payment_id,
          formDataPayment
        );
        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataPayment.ref_no}" updated successfully.`,
        });
      } else {
        // Add new
        const newPaymentData = {
          ...formDataPayment,
          payment_id: generateGuid(),
        };
        const newPayment = await paymentsAPI.create(newPaymentData);
        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataPayment.ref_no}" added successfully.`,
        });
      }

      //reload all dues
      loadDues();

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
    dueList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataPayment,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPayment,
    handleDeletePayment,
    handleRefresh,
    handleSavePayment,
  };
};
