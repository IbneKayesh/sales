import { useState, useEffect, useMemo } from "react";
import { poMasterAPI } from "@/api/poMasterAPI";
import { poChildAPI } from "@/api/poChildAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_po_master from "@/models/prequest/t_po_master.json";
import t_po_child from "@/models/prequest/t_po_child.json";

export const usePoMaster = () => {
  const [poMasters, setPoMasters] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataPoMaster, setFormDataPoMaster] = useState({
    order_type: "",
    order_no: "Auto[ON#0001]",
    order_date: new Date().toISOString().split("T")[0],
    contacts_id: "",
    ref_no: "No Ref",
    order_note: "",
    total_amount: 0,
    paid_amount: 0,
    is_paid: 0,
    ismodified: 0,
  });

  const [formDataPoChild, setFormDataPoChild] = useState({
    po_master_id: "",
    item_id: "",
    item_rate: 0,
    item_qty: 0,
    discount_amount: 0,
    item_amount: 0,
    item_note: "",
    order_qty: 0,
    ismodified: 0,
  });

  const poTypeOptions = [
    { label: "Purchase Booking", value: "Purchase Booking" },
    { label: "Purchase Receive", value: "Purchase Receive" },
  ];

  const refNoOptions = useMemo(() => {
    if (formDataPoMaster.order_type === "Purchase Booking") {
      return [{ label: "No Ref", value: "No Ref" }];
    } else if (formDataPoMaster.order_type === "Purchase Receive") {
      const options = poMasters
        .filter(
          (po) => po.order_type === "Purchase Booking" && po.is_paid === 0
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

  const loadPoMasters = async (resetModified = false) => {
    try {
      const data = await poMasterAPI.getAll();
      setPoMasters(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading purchase orders:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load purchase orders from server",
      });
    }
  };

  // Load poMasters from API on mount
  useEffect(() => {
    loadPoMasters();
  }, []);

  const [orderChildItems, setOrderChildItems] = useState([]);
  const [orderChildItemsStore, setOrderChildItemsStore] = useState([]);

  const loadPoChildren = async (po_master_id) => {
    setOrderChildItems([]);
    try {
      const data = await poChildAPI.getByMasterId(po_master_id);
      setOrderChildItems(data);
      setOrderChildItemsStore(data);
    } catch (error) {
      console.error("Error loading purchase order items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load purchase order items from server",
      });
    }
  };
  const loadPoChildrenByOrderNo = async (orderno) => {
    setOrderChildItems([]);
    try {
      const data = await poChildAPI.getByOrderNo(orderno);
      setOrderChildItems(data);
      setOrderChildItemsStore(data);
    } catch (error) {
      console.error("Error loading purchase order items:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load purchase order items from server",
      });
    }
  };

  const handleChange = async (field, value) => {
    let processedValue = value;
    if (field === "is_paid") {
      processedValue = value ? 1 : 0;
    }

    setFormDataPoMaster((prev) => {
      const updatedData = { ...prev, [field]: processedValue };

      // Reset ref_no when order_type changes
      if (field === "order_type") {
        if (value === "Purchase Booking") {
          updatedData.ref_no = "No Ref";
        } else if (value === "Purchase Receive") {
          // Set to first available option or empty
          // const availableRefs = poMasters.filter(
          //   (po) => po.order_type === "Purchase Booking" && po.is_paid === 0
          // );
          // updatedData.ref_no =
          //   availableRefs.length > 0 ? availableRefs[0].order_no : "";
          updatedData.ref_no = "-";
        } else {
          updatedData.ref_no = "-";
        }
      }

      return updatedData;
    });

    const newErrors = validate(
      { ...formDataPoMaster, [field]: processedValue },
      t_po_master.t_po_master
    );

    if (field === "ref_no" && value) {
      console.log("ref_no " + value);
      await loadPoChildrenByOrderNo(value);
    }
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataPoMaster({
      po_master_id: "",
      order_type: "",
      order_no: "Auto[ON#0001]",
      order_date: new Date().toISOString().split("T")[0],
      contacts_id: "",
      ref_no: "No Ref",
      order_note: "",
      total_amount: 0,
      paid_amount: 0,
      is_paid: 0,
      ismodified: 0,
    });
    setErrors({});

    setFormDataPoChild({
      po_master_id: "",
      item_id: "",
      item_rate: 0,
      item_qty: 0,
      discount_amount: 0,
      item_amount: 0,
      item_note: "",
      order_qty: 0,
      ismodified: 0,
    });

    setOrderChildItems([]);
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
      console.error("Error deleting purchase order:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete purchase order",
      });
    }
  };

  const handleRefresh = () => {
    loadPoMasters(true);
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsBusy(true);
    try {
      //order master data
      const newErrors = validate(formDataPoMaster, t_po_master.t_po_master);
      setErrors(newErrors);
      //console.log("handleSavePoMaster: " + JSON.stringify(formDataPoMaster));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //Step 1 : used in Step 2
      const total_amount = orderChildItems.reduce(
        (sum, i) => sum + Number(i.item_amount || 0),
        0
      );

      //Step 2 : used in Step 3 (paid_amount)
      // if (formDataPoMaster.order_type === "Purchase Receive") {
      //   //console.log("orderChildItems " + JSON.stringify(orderChildItems));

      //   //if receive creates from booking then full paid
      //   if (
      //     formDataPoMaster.ref_no !== "-" &&
      //     formDataPoMaster.ref_no !== "No Ref"
      //   ) {
      //     formDataPoMaster.paid_amount = total_amount;

      //     setOrderChildItems((prev) => {
      //       const updatedItems = prev.map((item) => ({
      //         ...item,
      //         order_qty: item.item_qty,
      //       }));
      //       //console.log("orderChildItems " + JSON.stringify(updatedItems));
      //       return updatedItems;
      //     });
      //   }
      // }

      //Step 3 :
      // const is_paid =
      //   Number(total_amount) === Number(formDataPoMaster.paid_amount || 0);

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
          total_amount,
          ismodified: true,
          childs_create: childs,
          childs_update: toUpdateChildItems,
          childs_delete: toDeleteChildItems,
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
        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"Order #${formDataPoMaster.order_no}" updated successfully.`,
        });
      } else {
        // Add new
        const po_master_id = generateGuid();
        // assign new GUID to each child
        const childs = orderChildItems.map((item) => ({
          ...item,
          id: generateGuid(),
        }));

        const newPoMasterData = {
          ...formDataPoMaster,
          po_master_id,
          total_amount,
          ismodified: true,
          childs,
        };
        //console.log("newPoMasterData " + JSON.stringify(newPoMasterData));
        const newPoMaster = await poMasterAPI.create(newPoMasterData);

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
    formDataPoMaster,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditPoMaster,
    handleDeletePoMaster,
    handleRefresh,
    handleSaveAll,
    poTypeOptions,
    refNoOptions,
  };
};
