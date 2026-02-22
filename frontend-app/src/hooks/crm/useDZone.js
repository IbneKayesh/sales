import { useState, useEffect } from "react";
import { dzoneAPI } from "@/api/crm/dzoneAPI";
import tmcb_dzone from "@/models/crm/tmcb_dzone.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmcb_dzone, { edit_stop: 0 });

export const useDZone = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadDZones = async () => {
    try {
      const response = await dzoneAPI.getAll({
        dzone_users: user.users_users,
        dzone_bsins: user.users_bsins,
      });
      //console.log("loadOrderRoutes: ", response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadDZones();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_dzone);
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
      const response = await dzoneAPI.delete(rowData);

      const updatedList = dataList.filter((c) => c.id !== rowData.id);
      setDataList(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadDZones();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmcb_dzone);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        dzone_users: user.users_users,
        dzone_bsins: user.users_bsins,
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await dzoneAPI.update(formDataNew);
      } else {
        response = await dzoneAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      handleClear();
      setCurrentView("list");
      loadDZones();
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  //other functions

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
