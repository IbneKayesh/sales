import { useState, useEffect } from "react";
import { paymentsAPI } from "@/api/accounts/paymentsAPI";
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
    ismodified: false,
}

export const usePayments = () => {
  const [paymentList, setPaymentList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataPayment, setFormDataPayment] = useState(fromDataModel);

  const loadPayments = async (resetModified = false) => {
    try {
      const data = await paymentsAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setPaymentList(data);
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
    loadPayments();
  }, []);

  const handleChange = (field, value) => {
    setFormDataPayment((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataPayment, [field]: value },
      t_payments
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataPayment(fromDataModel);
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

    setFormDataPayment(payment);
    setCurrentView("form");
  };

  const handleDeletePayment = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await paymentsAPI.delete(rowData);
      const updatedPayments = paymentList.filter(
        (b) => b.payment_id !== rowData.payment_id
      );
      setPaymentList(updatedPayments);

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
    loadPayments(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataPayment, t_payments);
    setErrors(newErrors);
    console.log(
      "handleSavePayment: " + JSON.stringify(formDataPayment)
    );

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
      let updatedPayments;
      if (formDataPayment.payment_id) {
        // Edit existing
        const updatedPayment = await paymentsAPI.update(
          formDataPayment
        );
        updatedPayment.ismodified = true;
        updatedPayments = paymentList.map((b) =>
          b.payment_id === formDataPayment.payment_id
            ? updatedPayment
            : b
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataPayment.payment_head}" updated successfully.`,
        });
      } else {
        // Add new
        const newPaymentData = {
          ...formDataPayment,
          payment_id: generateGuid(),
        };
        //console.log("newPaymentData: " + JSON.stringify(newPaymentData));

        const newPayment = await paymentsAPI.create(newPaymentData);
        //newPayment.ismodified = true;
        //updatedPayments = [...paymentList, newPayment];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataPayment.payment_head}" added successfully.`,
        });
      }
      //setPaymentList(updatedPayments);

      handleClear();
      setCurrentView("list");

      //call update process
      await closingProcessAPI("Payments",formDataPayment.ref_no);

      
      loadPayments(true);

    } catch (error) {
      console.error("Error saving payment", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save payment",
      });
    }

    setIsBusy(false);
  };

  return {
    paymentList,
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
