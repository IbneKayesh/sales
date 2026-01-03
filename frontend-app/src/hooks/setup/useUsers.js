import { useState, useEffect } from "react";
import { usersAPI } from "@/api/setup/usersAPI";
import validate from "@/models/validator";
import t_users from "@/models/setup/t_users";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";

export const useUsers = () => {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [fromData, setFormData] = useState({
    user_id: "",
    user_email: "",
    user_password: "",
    user_mobile: "",
    user_name: "",
    user_role: "",
    edit_stop: 0,
  });

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
  ];

  const loadUsers = async (resetModified = false) => {
    try {
      const data = await usersAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setUserList(data);

      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...fromData, [field]: value }, t_users);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      user_id: "",
      user_email: "",
      user_password: "",
      user_mobile: "",
      user_name: "",
      user_role: "",
      edit_stop: 0,
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

  const handleEditUser = (user) => {
    //console.log("user: " + JSON.stringify(user));

    setFormData({
      user_id: user.user_id,
      user_email: user.user_email,
      user_password:"",
      user_mobile: user.user_mobile,
      user_name: user.user_name,
      user_role: user.user_role,
      edit_stop: user.edit_stop,
    });
    setCurrentView("form");
  };

  const handleDeleteUser = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await usersAPI.delete(rowData);
      const updatedUsers = userList.filter(
        (u) => u.user_id !== rowData.user_id
      );
      setUserList(updatedUsers);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete contact",
      });
    }
  };

  const handleRefresh = () => {
    loadUsers(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      const newErrors = validate(fromData, t_users);
      setErrors(newErrors);
      console.log("handleSaveUser: " + JSON.stringify(fromData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...fromData,
        user_id: fromData.user_id || generateGuid(),
        shop_id: user?.shop_id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      if (fromData.user_id) {
        await usersAPI.update(formDataNew);
      } else {
        await usersAPI.create(formDataNew);
      }

      const message = fromData.user_id
        ? `"${fromData.user_name}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      handleClear();
      setCurrentView("list");
      loadUsers();
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
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
    fromData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditUser,
    handleDeleteUser,
    handleRefresh,
    handleSaveUser,
    roleOptions,
  };
};
