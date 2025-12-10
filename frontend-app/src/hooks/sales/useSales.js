import { useState, useEffect } from "react";
import { salesAPI } from "@/api/sales/salesAPI";
import validate from "@/models/validator";
import t_so_master from "@/models/sales/t_so_master.json";
import { generateGuid } from "@/utils/guid";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const fromDataModel = {
  so_master_id: "",
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

export const useSales = () => {
  const [salesList, setSalesList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});

  const [selectedSoType, setSelectedSoType] = useState("Sales Order");
  const [selectedFilter, setSelectedFilter] = useState("default");

  const soTypeOptions = [
    { label: "Sales Order", value: "Sales Order" },
    { label: "Sales Return", value: "Sales Return" },
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

  const loadSales = async (resetModified = false) => {
    try {
      const data = await salesAPI.getAll(selectedSoType, selectedFilter);
      //console.log("data: " + JSON.stringify(data));
      setSalesList(data);
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
    loadSales();
  }, [selectedSoType, selectedFilter]);

  const handleChange = (field, value) => {
    setFormDataOrder((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataOrder, [field]: value },
      t_so_master
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
    setFormDataOrder((prev) => ({ ...prev, order_type: selectedSoType }));
    setCurrentView("form");
  };

  const loadSalesDetails = async (so_master_id) => {
    try {
      const data = await salesAPI.getDetails(so_master_id);
      //console.log("loadSalesDetails: " + JSON.stringify(data));
      setFormDataOrderItems(data);
    } catch (error) {
      console.error("Error fetching sales details:", error);
    }
  };

  const loadSalesPayments = async (order_no) => {
    try {
      const data = await salesAPI.getPayments(order_no);
      //console.log("loadSalesPayments: " + JSON.stringify(data));
      setFormDataOrderPayments(data);
    } catch (error) {
      console.error("Error fetching sales payments:", error);
    }
  };

  const handleEditSales = (sales) => {
    //console.log("sales: " + JSON.stringify(sales));

    setFormDataOrder(sales);
    setCurrentView("form");

    //load saved order items, by so_master_id
    loadSalesDetails(sales.so_master_id);
    //load saved order payments, by order_no
    loadSalesPayments(sales.order_no);
  };

  const handleDeleteSales = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await salesAPI.delete(rowData);
      const updatedSales = salesList.filter(
        (s) => s.so_master_id !== rowData.so_master_id
      );
      setSalesList(updatedSales);

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
    loadSales(true);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSoTypeChange = (filter) => {
    setSelectedSoType(filter);
  };

  const handleSaveSales = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataOrder, t_so_master);
    setErrors(newErrors);
    console.log("handleSaveSales: " + JSON.stringify(newErrors));

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
      if (formDataOrder.so_master_id) {
        // Edit existing

        const fromDataEdit = {
          ...formDataOrder,
          is_paid: paidStatus,
          details_create: formDataOrderItems,
          payments_create: formDataOrderPayments,
        };
        const updatedSales = await salesAPI.update(fromDataEdit);
        updatedSales.ismodified = true;

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataOrder.order_no}" updated successfully.`,
        });
      } else {
        // Add new
        const fromDataNew = {
          ...formDataOrder,
          so_master_id: generateGuid(),
          is_paid: paidStatus,
          details_create: formDataOrderItems,
          payments_create: formDataOrderPayments,
        };
        //console.log("newPurchaseData: " + JSON.stringify(newPurchaseData));

        const newSales = await salesAPI.create(fromDataNew);
        fromDataNew.ismodified = true;

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${newSales.order_no}" added successfully.`,
        });
      }

      loadSales();

      handleClear();
      setCurrentView("list");

      //call update process
      await closingProcessAPI("Sales", formDataOrder.order_no);
    } catch (error) {
      console.error("Error saving sales:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save sales",
      });
    }
    setIsBusy(false);
  };

  return {
    salesList,
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
    handleEditSales,
    handleDeleteSales,
    handleRefresh,
    handleSaveSales,
    selectedSoType,
    setSelectedSoType,
    selectedFilter,
    setSelectedFilter,
    soTypeOptions,
    filterOptions,
    paymentOptions,
    handleSoTypeChange,
    handleFilterChange,
  };
};
