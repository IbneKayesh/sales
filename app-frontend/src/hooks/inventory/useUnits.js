import { useState, useEffect } from "react";
import { unitsAPI } from "@/api/unitsAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_units from "@/models/inventory/t_units.json";

export const useUnits = () => {
  const [units, setUnits] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataUnit, setFormDataUnit] = useState({
    unit_name: "",
  });

  const loadUnits = async (resetModified = false) => {
    try {
      const data = await unitsAPI.getAll();
      setUnits(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading units:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load units from server",
      });
    }
  };

  // Load units from API on mount
  useEffect(() => {
    loadUnits();
  }, []);

  const handleChange = (field, value) => {
    setFormDataUnit((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataUnit, [field]: value },
      t_units.t_units
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataUnit({
      unit_id: "",
      unit_name: "",
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

  const handleEditUnit = (unit) => {
    console.log("unit: " + JSON.stringify(unit));

    setFormDataUnit(unit);
    setCurrentView("form");
  };

  const handleDeleteUnit = async (id) => {
    try {
      await unitsAPI.delete(id);
      const updatedUnits = units.filter((u) => u.unit_id !== id);
      setUnits(updatedUnits);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting unit:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete unit",
      });
    }
  };

  const handleRefresh = () => {
    loadUnits(true);
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataUnit, t_units.t_units);
    setErrors(newErrors);
    console.log("handleSaveUnit: " + JSON.stringify(formDataUnit));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedUnits;
      if (formDataUnit.unit_id) {
        // Edit existing
        const updatedUnit = await unitsAPI.update(
          formDataUnit.unit_id,
          formDataUnit
        );
        updatedUnit.ismodified = true;
        updatedUnits = units.map((u) =>
          u.unit_id === formDataUnit.unit_id ? updatedUnit : u
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataUnit.unit_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newUnitData = { ...formDataUnit, unit_id: generateGuid() };
        //console.log("newUnitData: " + JSON.stringify(newUnitData));

        const newUnit = await unitsAPI.create(newUnitData);
        newUnit.ismodified = true;
        updatedUnits = [...units, newUnit];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataUnit.unit_name}" added successfully.`,
        });
      }
      setUnits(updatedUnits);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving unit:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save unit",
      });
    }

    setIsBusy(false);
  };

  return {
    units,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataUnit,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUnit,
    handleDeleteUnit,
    handleRefresh,
    handleSaveUnit,
  };
};
