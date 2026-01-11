import { useState, useEffect } from "react";
import { usersAPI } from "@/api/auth/usersAPI";
import tmab_users from "@/models/auth/tmab_users.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { businessAPI } from "@/api/auth/businessAPI";

const dataModel = generateDataModel(tmab_users, { edit_stop: 0 });

export const useUsers = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const [businessOptions, setBusinessOptions] = useState([]);
  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
  ];

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll({ users_users: user.users_users });
      // response = { message, data }

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadBusiness = async () => {
    //console.log("loadBusiness: ", businessOptions);
    if (businessOptions.length > 0) {
      return;
    }
    try {
      const response = await businessAPI.getAll({
        bsins_users: user.users_users,
      });
      //console.log("response: " + JSON.stringify(response));

      // response = { message, data }

      setBusinessOptions(
        response.data.map((d) => ({
          value: d.id,
          label: d.bsins_bname,
        }))
      );
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmab_users);
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
    loadBusiness();
  };

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    setFormData({
      ...data,
      users_pswrd: "",
    });
    setCurrentView("form");
    loadBusiness();
  };

  const handleDelete = async (rowData) => {
    try {
      if (rowData.id === rowData.users_users) {
        showToast("error", "Error", "Cannot delete primary user");
        return;
      }
      // Call API, unwrap { message, data }
      const response = await usersAPI.delete(rowData);

      const updatedList = dataList.filter((u) => u.id !== rowData.id);
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
    loadUsers();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      if (formData.users_pswrd === formData.users_recky) {
        showToast("error", "Error", "Password and recovery key are same");
        return;
      }

      // Validate form
      const newErrors = validate(formData, tmab_users);
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
        users_users: user.users_users,
        user_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await usersAPI.update(formDataNew);
      } else {
        response = await usersAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      handleClear();
      setCurrentView("list");
      loadUsers();
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
    roleOptions,
    businessOptions,
  };
};
