import { useState, useEffect } from "react";
import { territoryAPI } from "@/api/crm/territoryAPI";
import tmcb_trtry from "@/models/crm/tmcb_trtry.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmcb_trtry, { edit_stop: 0 });

export const useTerritory = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadTerritories = async () => {
    try {
      setIsBusy(true);
      const response = await territoryAPI.getAll({
        muser_id: user.users_users,
        bsins_id: user.users_bsins,
      });
      //console.log("loadOrderRoutes: ", response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Territory",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadTerritories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_trtry);
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
      setIsBusy(true);
      // Call API, unwrap { message, data }
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await territoryAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Territory - ${rowData.trtry_wname} ${
          response.success ? "is deleted by" : "delete failed by"
        } ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      notify({
        severity: "error",
        summary: "Territory",
        detail: error?.message || "Failed to delete data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadTerritories();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Validate form
      const newErrors = validate(formData, tmcb_trtry);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        muser_id: user.users_users,
        bsins_id: user.users_bsins,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await territoryAPI.update(formDataNew);
      } else {
        response = await territoryAPI.create(formDataNew);
      }

      // Update toast using API message

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Territory - ${formDataNew.trtry_wname} ${
          response.success
            ? formData.id
              ? "modified"
              : "created"
            : formData.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        handleClear();
        setCurrentView("list");
        loadTerritories();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Territory",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //other functions

  return {
    isBusy,
    dataList,
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
