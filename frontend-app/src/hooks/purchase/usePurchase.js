import { useState, useEffect } from "react";
import { purchaseAPI } from "@/api/purchase/purchaseAPI";
import validate from "@/models/validator";
import t_po_master from "@/models/purchase/t_po_master.json";
import { generateGuid } from "@/utils/guid";

export const usePurchase = () => {
  const [purchaseList, setPurchaseList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});

  const [selectedPoType, setSelectedPoType] = useState("Purchase Order");
  const [selectedFilter, setSelectedFilter] = useState("default");

  const poTypeOptions = [
    { label: "Purchase Order", value: "Purchase Order" },
    { label: "Purchase Return", value: "Purchase Return" },
  ];

  const filterOptions = [
    { label: "Default", value: "default" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 90 Days", value: "90days" },
    { label: "All Days", value: "alldays" },
  ];

  const paymentOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Bank", value: "Bank" },
    { label: "MFS", value: "MFS" },
  ];

  const [formDataOrder, setFormDataOrder] = useState({
    po_master_id: "",
    order_type: selectedPoType,
    order_no: "[SL-123456]",
    order_date: new Date().toISOString().split("T")[0],
    contact_id: "",
    ref_no: "",
    order_note: "",
    order_amount: 0,
    discount_amount: 0,
    tax_amount: 0,
    cost_amount: 0,
    total_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    other_cost: 0,
    is_paid: "Unpaid",
    is_posted: 0,
    is_completed: 0,
    ismodified: 0,
  });

  const [formDataOrderItems, setFormDataOrderItems] = useState([]);
  const [formDataOrderPayments, setFormDataOrderPayments] = useState([]);

  const loadPurchase = async (resetModified = false) => {
    try {
      const data = await purchaseAPI.getAll(selectedPoType, selectedFilter);
      //console.log("data: " + JSON.stringify(data));
      setPurchaseList(data);
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
    loadPurchase();
  }, [selectedPoType, selectedFilter]);

  const handleChange = (field, value) => {
    setFormDataOrder((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataOrder, [field]: value },
      t_po_master
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataOrder({
      po_master_id: "",
      order_type: selectedPoType,
      order_no: "[SL-123456]",
      order_date: new Date().toISOString().split("T")[0],
      contact_id: "",
      ref_no: "",
      order_note: "",
      order_amount: 0,
      discount_amount: 0,
      tax_amount: 0,
      cost_amount: 0,
      total_amount: 0,
      paid_amount: 0,
      due_amount: 0,
      other_cost: 0,
      is_paid: "Unpaid",
      is_posted: 0,
      is_completed: 0,
      ismodified: 0,
    });
    setErrors({});
    setFormDataOrderItems([]);
    setFormDataOrderPayments([]);
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEditPurchase = (purchase) => {
    //console.log("purchase: " + JSON.stringify(purchase));

    setFormDataOrder(purchase);
    setCurrentView("form");

    //load saved order items, by po_master_id
    //load saved order payments, by order_no
  };

  const handleDeletePurchase = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await purchaseAPI.delete(rowData);
      const updatedPurchase = purchaseList.filter(
        (p) => p.po_master_id !== rowData.po_master_id
      );
      setPurchaseList(updatedPurchase);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete data",
      });
    }
  };

  const handleRefresh = () => {
    loadPurchase(true);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handlePoTypeChange = (filter) => {
    setSelectedPoType(filter);
  };

  const handleSavePurchase = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataOrder, t_po_master);
    setErrors(newErrors);
    console.log("handleSavePurchase: " + JSON.stringify(formDataOrder));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedPurchase;
      if (formDataOrder.po_master_id) {
        // Edit existing
        const updatedPurchase = await purchaseAPI.update(formDataOrder);
        updatedPurchase.ismodified = true;
        updatedPurchase = purchaseList.map((p) =>
          p.po_master_id === formDataOrder.po_master_id ? updatedPurchase : p
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataOrder.order_no}" updated successfully.`,
        });
      } else {
        // Add new
        const newPurchaseData = {
          ...formDataOrder,
          po_master_id: generateGuid(),
        };
        //console.log("newPurchaseData: " + JSON.stringify(newPurchaseData));

        const newPurchase = await purchaseAPI.create(newPurchaseData);
        newPurchase.ismodified = true;
        updatedPurchase = [...purchaseList, newPurchase];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataOrder.order_no}" added successfully.`,
        });
      }
      setPurchaseList(updatedPurchase);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving purchase:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save purchase",
      });
    }

    setIsBusy(false);
  };

  return {
    purchaseList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataOrder,
    setFormDataOrder,
    formDataOrderItems,
    setFormDataOrderItems,
    formDataOrderPayments,
    setFormDataOrderPayments,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPurchase,
    handleDeletePurchase,
    handleRefresh,
    handleSavePurchase,
    selectedPoType,
    setSelectedPoType,
    selectedFilter,
    setSelectedFilter,
    poTypeOptions,
    filterOptions,
    paymentOptions,
    handlePoTypeChange,
    handleFilterChange,
  };
};
