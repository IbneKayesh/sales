import { useState, useEffect } from "react";
import { unitsAPI } from "@/api/inventory/unitsAPI";
import validate from "@/models/validator";
import t_units from "@/models/inventory/t_units";
import { generateGuid } from "@/utils/guid";

const dataModel = {
  unit_id: "",
  unit_name: "",
  edit_stop: 0,
};

export const useUnits = () => {
  const [unitList, setUnitList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadUnits = async () => {
    try {
      const response = await unitsAPI.getAll();
      // response = { message, data }
      setUnitList(response.data);

      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadUnits();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, t_units);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
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
    //console.log("unit: " + JSON.stringify(unit));

    setFormData(unit);
    setCurrentView("form");
  };

  const handleDeleteUnit = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await unitsAPI.delete(rowData);

      // Remove deleted unit from local state
      const updatedList = unitList.filter(
        (u) => u.unit_id !== rowData.unit_id
      );
      setUnitList(updatedList);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: response.message || "Deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete data",
      });
    }
  };

  const handleRefresh = () => {
    loadUnits();
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, t_units);
      setErrors(newErrors);
      console.log("handleSaveUnit:", JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure unit_id exists (for create)
      const formDataNew = {
        ...formData,
        unit_id: formData.unit_id || generateGuid(),
      };

      // Call API and get { message, data }
      let response;
      if (formData.unit_id) {
        response = await unitsAPI.update(formDataNew);
      } else {
        response = await unitsAPI.create(formDataNew);
      }

      // Update toast using API message
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message || "Operation successful",
      });

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadUnits(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error saving data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to save data",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    unitList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUnit,
    handleDeleteUnit,
    handleRefresh,
    handleSaveUnit,
  };
};
