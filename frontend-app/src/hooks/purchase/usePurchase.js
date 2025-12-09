import { useState, useEffect } from "react";
import { purchaseAPI } from "@/api/purchase/purchaseAPI";
import validate from "@/models/validator";
import t_po_master from "@/models/purchase/t_po_master.json";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const fromDataModel = {
  po_master_id: "",
  order_type: "",
  order_no: "[SL-123456]",
  order_date: new Date().toISOString().split("T")[0],
  contact_id: "both",
  ref_no: "No Ref",
  order_note: "",
  order_amount: 0,
  discount_amount: 0,
  vat_amount: 0,
  vat_payable: 1,
  order_cost: 0,
  cost_payable: 1,
  total_amount: 0,
  payable_amount: 0,
  paid_amount: 0,
  due_amount: 0,
  other_cost: 0,
  is_paid: "Unpaid",
  is_posted: 0,
  is_completed: 0,
  is_returned: 0,
  ismodified: 0,
};

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

  const [formDataOrder, setFormDataOrder] = useState(fromDataModel);

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
    setFormDataOrder(fromDataModel);
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
    setFormDataOrder((prev) => ({ ...prev, order_type: selectedPoType }));
    setCurrentView("form");
  };

  const loadPurchaseDetails = async (po_master_id) => {
    try {
      const data = await purchaseAPI.getDetails(po_master_id);
      //console.log("loadPurchaseDetails: " + JSON.stringify(data));
      setFormDataOrderItems(data);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  const loadPurchasePayments = async (order_no) => {
    try {
      const data = await purchaseAPI.getPayments(order_no);
      //console.log("loadPurchasePayments: " + JSON.stringify(data));
      setFormDataOrderPayments(data);
    } catch (error) {
      console.error("Error fetching purchase payments:", error);
    }
  };

  const handleEditPurchase = (purchase) => {
    //console.log("purchase: " + JSON.stringify(purchase));

    setFormDataOrder(purchase);
    setCurrentView("form");

    //load saved order items, by po_master_id
    loadPurchaseDetails(purchase.po_master_id);
    //load saved order payments, by order_no
    loadPurchasePayments(purchase.order_no);
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
    console.log("handleSavePurchase: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    const paidStatus =
      formDataOrder.payable_amount === formDataOrder.due_amount
        ? "Unpaid"
        : formDataOrder.due_amount === 0
        ? "Paid"
        : "Partial";

    try {
      if (formDataOrder.po_master_id) {
        // Edit existing

        const fromDataEdit = {
          ...formDataOrder,
          is_paid: paidStatus,
          details_create: formDataOrderItems,
          payments_create: formDataOrderPayments,
        };
        const updatedPurchase = await purchaseAPI.update(fromDataEdit);
        updatedPurchase.ismodified = true;

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataOrder.order_no}" updated successfully.`,
        });
      } else {
        // Add new
        const fromDataNew = {
          ...formDataOrder,
          po_master_id: generateGuid(),
          is_paid: paidStatus,
          details_create: formDataOrderItems,
          payments_create: formDataOrderPayments,
        };
        //console.log("newPurchaseData: " + JSON.stringify(newPurchaseData));

        const newPurchase = await purchaseAPI.create(fromDataNew);
        fromDataNew.ismodified = true;

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${newPurchase.order_no}" added successfully.`,
        });
      }

      loadPurchase();

      handleClear();
      setCurrentView("list");

      //call update process
      await closingProcessAPI("Purchase", formDataOrder.order_no);
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
    setErrors,
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
