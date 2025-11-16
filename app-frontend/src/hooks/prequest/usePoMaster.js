import { useState, useEffect, useMemo } from "react";
import { poMasterAPI } from "@/api/poMasterAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_po_master from "@/models/prequest/t_po_master.json";

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
    is_paid: false,
  });

  const poTypeOptions = [
    { label: "Purchase Booking", value: "Purchase Booking" },
    { label: "Purchase Receive", value: "Purchase Receive" },
  ];

  const refNoOptions = useMemo(() => {
    if (formDataPoMaster.order_type === "Purchase Booking") {
      return [{ label: "No Ref", value: "No Ref" }];
    } else if (formDataPoMaster.order_type === "Purchase Receive") {
      return poMasters
        .filter(
          (po) => po.order_type === "Purchase Booking" && po.is_paid === 0
        )
        .map((po) => ({
          label: po.order_no,
          value: po.order_no,
        }));
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

  const handleChange = (field, value) => {
    setFormDataPoMaster((prev) => {
      const updatedData = { ...prev, [field]: value };

      // Reset ref_no when order_type changes
      if (field === "order_type") {
        if (value === "Purchase Booking") {
          updatedData.ref_no = "No Ref";
        } else if (value === "Purchase Receive") {
          // Set to first available option or empty
          const availableRefs = poMasters.filter(
            (po) => po.order_type === "Purchase Booking" && po.is_paid === 0
          );
          updatedData.ref_no =
            availableRefs.length > 0 ? availableRefs[0].order_no : "";
        } else {
          updatedData.ref_no = "";
        }
      }

      return updatedData;
    });

    const newErrors = validate(
      { ...formDataPoMaster, [field]: value },
      t_po_master.t_po_master
    );
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
      is_paid: false,
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

  const handleEditPoMaster = (poMaster) => {
    setFormDataPoMaster(poMaster);
    setCurrentView("form");
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

  const handleSavePoMaster = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataPoMaster, t_po_master.t_po_master);
    setErrors(newErrors);
    console.log("handleSavePoMaster: " + JSON.stringify(formDataPoMaster));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedPoMasters;
        if (formDataPoMaster.po_master_id) {
          // Edit existing
          const updatedPoMaster = await poMasterAPI.update(
            formDataPoMaster.po_master_id,
            formDataPoMaster
          );

          updatedPoMaster.ismodified = true;

          updatedPoMasters = poMasters.map((p) =>
            p.po_master_id === formDataPoMaster.po_master_id
              ? updatedPoMaster
              : p
          );

          setToastBox({
            severity: "success",
            summary: "Success",
            detail: `"Purchase Order #${formDataPoMaster.po_master_id}" updated successfully.`,
          });
        } else {
          // Add new
          const newPoMasterData = {
            ...formDataPoMaster,
            po_master_id: generateGuid(),
          };

          const newPoMaster = await poMasterAPI.create(newPoMasterData);
          newPoMaster.ismodified = true;
          updatedPoMasters = [...poMasters, newPoMaster];

          setToastBox({
            severity: "success",
            summary: "Success",
            detail: `New purchase order added successfully.`,
          });
        }
        setPoMasters(updatedPoMasters);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error("Error saving purchase order:", error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save purchase order",
        });
      }
    }

    setIsBusy(false);
  };

  return {
    poMasters,
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
    handleSavePoMaster,
    poTypeOptions,
    refNoOptions,
  };
};
