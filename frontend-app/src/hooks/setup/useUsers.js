import { useState, useEffect } from "react";
import { usersAPI } from "@/api/setup/usersAPI";
import validate from "@/models/validator";
import t_users from "@/models/setup/t_users";
import { generateGuid } from "@/utils/guid";

export const useUsers = () => {
  const [userList, setUserList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataUser, setFormDataUser] = useState({
    user_id: "",
    user_name: "",
    user_password: "",
    user_mobile: "",
    user_email: "",
    user_role: "",
    ismodified: 0,
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
    setFormDataUser((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataUser, [field]: value },
      t_users
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataUser({
      user_id: "",
      user_name: "",
      user_password: "",
      user_mobile: "",
      user_email: "",
      user_role: "",
      ismodified: 0,
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

    setFormDataUser(user);
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
    setIsBusy(true);

    const newErrors = validate(formDataUser, t_users);
    setErrors(newErrors);
    console.log("handleSaveUser: " + JSON.stringify(formDataUser));

    if (Object.keys(newErrors).length > 0) {
      setIsBusy(false);
      return;
    }

    try {
      let updatedUsers;
      if (formDataUser.user_id) {
        // Edit existing
        const updatedUser = await usersAPI.update(formDataUser);
        updatedUser.ismodified = true;
        updatedUsers = userList.map((u) =>
          u.user_id === formDataUser.user_id ? updatedUser : u
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataUser.user_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newUserData = {
          ...formDataUser,
          user_id: generateGuid(),
        };
        //console.log("newContactData: " + JSON.stringify(newContactData));

        const newUser = await usersAPI.create(newUserData);
        newUser.ismodified = true;
        updatedUsers = [...userList, newUser];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataUser.user_name}" added successfully.`,
        });
      }
      setUserList(updatedUsers);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving user:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save contact",
      });
    }

    setIsBusy(false);
  };

  return {
    userList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataUser,
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
