import { useState, useEffect } from "react";
import { businessAPI } from "@/api/auth/businessAPI";
import validate, { generateDataModel } from "@/models/validator";
import tmab_bsins from "@/models/auth/tmab_bsins.json";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast.jsx";
import { formatDateForAPI } from "@/utils/datetime";

const dataModel = generateDataModel(tmab_bsins, { edit_stop: 0 });

export const useBusiness = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadBusiness = async () => {
    try {
      const response = await businessAPI.getAll({ bsins_users: user.id });
      //response = { success, message, data }

      setDataList(response.data);
      showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadBusiness();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmab_bsins);
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

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await businessAPI.delete(rowData);

      // Remove deleted business from local state
      const updatedList = dataList.filter((s) => s.id !== rowData.id);
      setDataList(updatedList);

      showToast("info", "Deleted", response.message || "Deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadBusiness();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmab_bsins);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        bsins_users: user.id, // Ensure user id is set
        bsins_stdat: formatDateForAPI(formData.bsins_stdat),
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await businessAPI.update(formDataNew);
      } else {
        response = await businessAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        "success",
        "Success",
        response.message || "Operation successful"
      );

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadBusiness(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
  };
};
