import { useState, useEffect } from "react";
import { businessAPI } from "@/api/auth/businessAPI";
import tmab_bsins from "@/models/auth/tmab_bsins.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDateForAPI } from "@/utils/datetime";
import { accountsHeadsAPI } from "@/api/accounts/accountsHeadsAPI";

const dataModel = generateDataModel(tmab_bsins, { edit_stop: 0 });

export const useAccountsHeads = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadAccountsHeads = async () => {
    try {
      const response = await accountsHeadsAPI.getAll({
        trhed_users: user.users_users,
      });
      //response = { success, message, data }

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadAccountsHeads();
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

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );
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
        bsins_users: user.users_users,
        bsins_stdat: formatDateForAPI(formData.bsins_stdat),
        user_id: user.id,
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
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
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

  //other functions
  const [headListDdl, setHeadListDdl] = useState([]);
  const fetchHeadListDdl = async () => {
    if (headListDdl.length > 0) return;

    try {
      if (dataList.length > 0) {
        setHeadListDdl(dataList);
      } else {
        const response = await accountsHeadsAPI.getAll({
          trhed_users: user.users_users,
        });
        //console.log("headListDdl: ", response.data);
        //response = { success, message, data }
        setHeadListDdl(response.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
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
    headListDdl,
    fetchHeadListDdl,
  };
};
