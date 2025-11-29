import { useState, useEffect, useMemo } from "react";
import { poMasterAPI } from "@/api/poMasterAPI";
import { poChildAPI } from "@/api/poChildAPI";
import { paymentsAPI } from "@/api/paymentsAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_po_master from "@/models/prequest/t_po_master.json";
import t_po_child from "@/models/prequest/t_po_child.json";
import useClosingProcess from "@/hooks/setup/useClosingProcess";

export const usePoMaster = () => {
  const { processAll } = useClosingProcess();

  const [poMasters, setPoMasters] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [selectedPoType, setSelectedPoType] = useState("Purchase Booking");
  const [selectedFilter, setSelectedFilter] = useState("default");

  const poTypeOptions = [
    { label: "Purchase Booking", value: "Purchase Booking" },
    { label: "Purchase Receive", value: "Purchase Receive" },
    { label: "Purchase Order", value: "Purchase Order" },
    { label: "Return Purchase", value: "Return Purchase" },
  ];

  const filterOptions = [
    { label: "Default", value: "default" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 90 Days", value: "90days" },
    { label: "All Days", value: "alldays" },
  ];

  const [formDataPoMaster, setFormDataPoMaster] = useState({
    po_master_id: "",
    order_type: selectedPoType,
    order_no: "[SL-123456]",
    order_date: new Date().toISOString().split("T")[0],
    contact_id: "",
    ref_no: "No Ref",
    order_note: "",
    order_amount: 0,
    discount_amount: 0,
    cost_amount: 0,
    total_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    is_paid: "Unpaid",
    is_posted: 0,
    is_completed: 0,
    other_cost: 0,
    ismodified: 0,
  });

  const [formDataPayments_v1, setFormDataPayments_v1] = useState({
    payment_id: "",
    bank_account_id: "",
    payment_type: "",
    payment_mode: "",
    payment_date: new Date().toISOString().split("T")[0],
    contact_id: "",
    ref_no: "",
    paid_amount: 0,
    order_amount: 0,
    payment_note: "",
    ismodified: 0,
  });

  const [formDataPaymentList, setFormDataPaymentList] = useState([]);

  const paymentOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Bank", value: "Bank" },
    { label: "MFS", value: "MFS" },
  ];

  // const [formDataPoChild, setFormDataPoChild] = useState({
  //   po_master_id: "",
  //   item_id: "",
  //   item_rate: 0,
  //   item_qty: 0,
  //   discount_amount: 0,
  //   item_amount: 0,
  //   item_note: "",
  //   received_qty: 0,
  //   ismodified: 0,
  // });

  const refNoOptions = useMemo(() => {
    if (formDataPoMaster.order_type === "Purchase Booking") {
      return [{ label: "No Ref", value: "No Ref" }];
    } else if (formDataPoMaster.order_type === "Purchase Receive") {
      const options = poMasters
        .filter(
          (po) => po.order_type === "Purchase Booking" && po.is_complete === 0
        )
        .map((po) => ({
          label: po.order_no,
          value: po.order_no,
        }));

      // prepend default "Select" option
      return [{ label: "Select Ref No.", value: "-" }, ...options];
    } else {
      return [];
    }
  }, [formDataPoMaster.order_type, poMasters]);

  const loadPoMasters = async (filter = "default", resetModified = false) => {
    try {
      const data = await poMasterAPI.getAll(selectedPoType, filter);
      //console.log("poType " + selectedPoType);
      //console.log("data " + JSON.stringify(data));
      setPoMasters(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading Purchase transactions:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load Purchase transactions from server",
      });
    }
  };

  // Load poMasters from API on mount
  useEffect(() => {
    loadPoMasters(selectedFilter);
  }, [selectedFilter, selectedPoType]);

  const [orderChildItems, setOrderChildItems] = useState([]);
  const [orderChildItemsStore, setOrderChildItemsStore] = useState([]);

  //for edit
  const loadPoChildren = async (po_master_id) => {
    setOrderChildItems([]);
    try {
      const data = await poChildAPI.getByMasterId(po_master_id);
      setOrderChildItems(data);
      setOrderChildItemsStore(data);
    } catch (error) {
      console.error("Error loading Purchase transaction items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load Purchase transaction items from server",
      });
    }
  };
  const loadPoPayments = async (ref_no) => {
    setFormDataPaymentList([]);
    try {
      const data = await paymentsAPI.getByRefNo(ref_no);
      //console.log("ref_no " + ref_no);
      //console.log("data " + JSON.stringify(data));
      setFormDataPaymentList(data);
    } catch (error) {
      console.error("Error loading Purchase transaction payments:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load Purchase transaction payments from server",
      });
    }
  };

  //for Purchase Receive
  const loadPurchaseBookingPoChild = async (supplierId) => {
    setOrderChildItems([]);
    try {
      const data = await poChildAPI.getBySupplierId(supplierId);
      setOrderChildItems(data);
      setOrderChildItemsStore(data);
    } catch (error) {
      console.error("Error loading purchase booking items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load purchase booking items from server",
      });
    }
  };

  const loadPurchaseBookingPayment = async (supplierId) => {
    setFormDataPaymentList([]);
    try {
      const data = await paymentsAPI.getBySupplierId(supplierId);
      //console.log("ref_no " + ref_no);
      //console.log("data " + JSON.stringify(data));
      setFormDataPaymentList(data);
    } catch (error) {
      console.error("Error loading Purchase transaction payments:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load Purchase transaction payments from server",
      });
    }
  };

  //for Purchase return
  const loadPurchaseReturnsPoChild = async (orderNo) => {
    setOrderChildItems([]);
    try {
      const data = await poChildAPI.getReturnsByOrderNo(orderNo);
      setOrderChildItems(data);
      setOrderChildItemsStore(data);
      //console.log("Error loading purchase return items:", data);
    } catch (error) {
      console.error("Error loading purchase booking items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load purchase booking items from server",
      });
    }
  };

  const handleChange = async (field, value) => {
    let processedValue = value;
    // if (field === "is_paid") {
    //   processedValue = value ? 1 : 0;
    // }

    setFormDataPoMaster((prev) => {
      const updatedData = { ...prev, [field]: processedValue };

      // Reset ref_no when order_type changes
      if (field === "order_type") {
        //updatedData.ref_no = "-";
      }

      return updatedData;
    });

    const newErrors = validate(
      { ...formDataPoMaster, [field]: processedValue },
      t_po_master.t_po_master
    );

    //console.log("field " + field + JSON.stringify(newErrors));
    //load child for receive
    if (
      field === "contact_id" &&
      value &&
      formDataPoMaster.order_type === "Purchase Receive"
    ) {
      //console.log("contact_id " + value);
      await loadPurchaseBookingPoChild(value);
      await loadPurchaseBookingPayment(value);
    }

    //load child for return
    if (
      field === "ref_no" &&
      value &&
      formDataPoMaster.order_type === "Return Purchase"
    ) {
      await loadPurchaseReturnsPoChild(value);
    }

    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataPoMaster({
      po_master_id: "",
      order_type: selectedPoType,
      order_no: "[SL-123456]",
      order_date: new Date().toISOString().split("T")[0],
      contact_id: "",
      ref_no: "No Ref",
      order_note: "",
      order_amount: 0,
      discount_amount: 0,
      total_amount: 0,
      paid_amount: 0,
      cost_amount: 0,
      is_paid: "Unpaid",
      is_posted: 0,
      is_completed: 0,
      other_cost: 0,
      ismodified: 0,
    });
    setErrors({});

    // setFormDataPoChild({
    //   po_master_id: "",
    //   item_id: "",
    //   item_rate: 0,
    //   item_qty: 0,
    //   discount_amount: 0,
    //   item_amount: 0,
    //   item_note: "",
    //   received_qty: 0,
    //   ismodified: 0,
    // });

    setOrderChildItems([]);
    setFormDataPaymentList([]);
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEditPoMaster = (poMaster) => {
    setFormDataPoMaster(poMaster);
    setCurrentView("form");
    //fetch child items
    loadPoChildren(poMaster.po_master_id);
    loadPoPayments(poMaster.order_no);
  };

  const handleDeletePoMaster = async (id) => {
    try {
      await poMasterAPI.delete(id);
      const updatedPoMasters = poMasters.filter((p) => p.po_master_id !== id);
      setPoMasters(updatedPoMasters);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting Purchase transaction:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Purchase transaction",
      });
    }
  };

  const handleRefresh = () => {
    loadPoMasters(selectedFilter, true);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handlePoTypeChange = (filter) => {
    setSelectedPoType(filter);
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsBusy(true);
    try {
      //order master data
      //number fields will allow decimal places
      //fix the validate function
      const newErrors = validate(formDataPoMaster, t_po_master.t_po_master);
      setErrors(newErrors);
      //console.log("handleSavePoMaster: " + JSON.stringify(formDataPoMaster));
      //console.log("formDataPaymentList: " + JSON.stringify(formDataPaymentList));

      //return;
      console.log("newErrors" + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //----------------------1 :: same for insert------Start

      const payments_create = formDataPaymentList
        .filter((item) => item.payment_type === formDataPoMaster.order_type)
        .map((item) => ({
          ...item,
          payment_id: generateGuid(),
          payment_date: formDataPoMaster.order_date,
          contact_id: formDataPoMaster.contact_id,
          order_amount:
            formDataPoMaster.order_type === "Purchase Booking"
              ? "0"
              : formDataPoMaster.order_type === "Purchase Receive"
              ? item.payment_amount
              : item.order_amount,
        }));

      //console.log("payments_create: " + JSON.stringify(payments_create));
      //return;
      const paidStatus =
        formDataPoMaster.total_amount === formDataPoMaster.due_amount
          ? "Unpaid"
          : formDataPoMaster.due_amount === 0
          ? "Paid"
          : "Partial";

      //----------------------1 :: same for insert------END

      if (formDataPoMaster.po_master_id) {
        // Edit existing
        // 1️⃣ Items to CREATE (new items have po_master_id === "sgd")
        const toCreateChildItems = orderChildItems.filter(
          (item) => item.po_master_id === "sgd"
        );

        // 2️⃣ Items to UPDATE (existing items whose fields were modified)
        const toUpdateChildItems = orderChildItems.filter(
          (item) => item.po_master_id !== "sgd" && item.ismodified === 1
        );

        // 3️⃣ Items to DELETE (exist in store but NOT in updated orderChildItems)
        const toDeleteChildItems = orderChildItemsStore.filter(
          (oldItem) =>
            !orderChildItems.some((newItem) => newItem.id === oldItem.id)
        );

        const childs = toCreateChildItems.map((item) => ({
          ...item,
          id: generateGuid(),
        }));

        const newPoMasterData = {
          ...formDataPoMaster,
          is_paid: paidStatus,
          ismodified: true,
          childs_create: childs,
          childs_update: toUpdateChildItems,
          childs_delete: toDeleteChildItems,
          payments_create,
        };

        //console.log("newPoMasterData " + JSON.stringify(newPoMasterData));
        //console.log("orderChildItems " + JSON.stringify(orderChildItems));
        //console.log("toCreateChildItems " + JSON.stringify(toCreateChildItems));
        //console.log("toUpdateChildItems " + JSON.stringify(toUpdateChildItems));
        //console.log("toDeleteChildItems " + JSON.stringify(toDeleteChildItems));

        const updatedPoMaster = await poMasterAPI.update(
          formDataPoMaster.po_master_id,
          newPoMasterData
        );
        await processAll("Purchase Edit");
        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"Order #${formDataPoMaster.order_no}" updated successfully.`,
        });
      } else {
        // Add new
        const po_master_id = generateGuid();
        // assign new GUID to each child
        const childs_create = orderChildItems.map((item) => ({
          ...item,
          id: generateGuid(),
        }));

        const newPoMasterData = {
          ...formDataPoMaster,
          po_master_id,
          is_paid: paidStatus,
          ismodified: true,
          childs_create,
          payments_create,
        };
        //console.log("newPoMasterData " + JSON.stringify(newPoMasterData));
        const newPoMaster = await poMasterAPI.create(newPoMasterData);

        await processAll("Purchase Add");

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: "New order saved successfully.",
        });

        //reset entry
        handleCancel();
        //load from db and set it into
        const fromDbData = await poMasterAPI.getById(
          newPoMasterData.po_master_id
        );
        setPoMasters((prev) => [...prev, fromDbData]);
      }
    } catch (error) {
      console.error("Error saving all items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save changes.",
      });
    }
    setIsBusy(false);
  };

  return {
    poMasters,
    orderChildItems,
    setOrderChildItems,
    toastBox,
    isBusy,
    currentView,
    errors,
    setErrors,
    formDataPoMaster,
    setFormDataPoMaster,
    selectedFilter,
    filterOptions,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPoMaster,
    handleDeletePoMaster,
    handleRefresh,
    handleFilterChange,
    handleSaveAll,
    refNoOptions,
    poTypeOptions,
    selectedPoType,
    handlePoTypeChange,
    formDataPaymentList,
    setFormDataPaymentList,
    paymentOptions,
  };
};
