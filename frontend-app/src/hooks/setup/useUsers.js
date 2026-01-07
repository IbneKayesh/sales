import { useState, useEffect } from "react";
import { usersAPI } from "@/api/setup/usersAPI";
// import { shopsAPI } from "@/api/setup/shopsAPI";
import validate from "@/models/validator";
import t_users from "@/models/setup/t_users";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";

const dataModel = {
  user_id: "",
  user_email: "",
  user_password: "",
  user_mobile: "",
  user_name: "",
  recovery_code: "sgd",
  user_role: "",
  shop_id: "",
  edit_stop: 0,
};

export const useUsers = () => {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const [shopOptions, setShopOptions] = useState([]);
  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
  ];

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      // response = { message, data }

      setUserList(response.data);

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

  const loadShops = async () => {
    if (shopOptions.length > 0) {
      return;
    }
    try {
      const response = await shopsAPI.getAll();
      // response = { message, data }

      setShopOptions(
        response.data.map((shop) => ({
          value: shop.shop_id,
          label: shop.shop_name,
        }))
      );
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
    loadUsers();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, t_users);
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
    loadShops();
  };

  const handleEditUser = (user) => {
    //console.log("user: " + JSON.stringify(user));

    setFormData({
      ...user,
      user_password: "",
    });
    setCurrentView("form");
    loadShops();
  };

  const handleDeleteUser = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await usersAPI.delete(rowData);

      const updatedList = userList.filter((u) => u.user_id !== rowData.user_id);
      setUserList(updatedList);

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
    loadUsers();
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, t_users);
      setErrors(newErrors);
      console.log("handleSaveUser: " + JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure user_id exists (for create)
      const formDataNew = {
        ...formData,
        user_id: formData.user_id || generateGuid(),
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formData.user_id) {
        response = await usersAPI.update(formDataNew);
      } else {
        response = await usersAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message || "Operation successful",
      });

      handleClear();
      setCurrentView("list");
      loadUsers();
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
    userList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUser,
    handleDeleteUser,
    handleRefresh,
    handleSaveUser,
    roleOptions,
    shopOptions,
  };
};
