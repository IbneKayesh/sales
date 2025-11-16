import { useState, useEffect } from "react";
import { usersAPI } from "@/api/usersAPI";
import { generateGuid } from "@/utils/guid";

import validate from "@/models/validator";
import t_users from "@/models/setup/t_users.json";

export const useUsers = () => {
  const [users, setUsers] = useState([]); // Initialize with empty array
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const [errors, setErrors] = useState({});
  const [formDataUser, setFormDataUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
  ];

  const loadUsers = async (resetModified = false) => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load users from server",
      });
    }
  };

  // Load users from API on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (field, value) => {
    setFormDataUser((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataUser, [field]: value },
      t_users.t_users
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataUser({
      user_id: "",
      username: "",
      password: "",
      email: "",
      role: "",
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
    setFormDataUser(user);
    setCurrentView("form");
  };

  const handleDeleteUser = async (id) => {
    try {
      await usersAPI.delete(id);
      const updatedUsers = users.filter((u) => u.user_id !== id);
      setUsers(updatedUsers);
      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete user",
      });
    }
  };

  const handleRefresh = () => {
    loadUsers(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataUser, t_users.t_users);
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
        const updatedUser = await usersAPI.update(
          formDataUser.user_id,
          formDataUser
        );
        updatedUser.ismodified = true;
        updatedUsers = users.map((u) =>
          u.user_id === formDataUser.user_id ? updatedUser : u
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataUser.username}" updated successfully.`,
        });
      } else {
        // Add new
        const newUserData = {
          ...formDataUser,
          user_id: generateGuid(),
        };

        const newUser = await usersAPI.create(newUserData);
        newUser.ismodified = true;
        updatedUsers = [...users, newUser];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataUser.username}" added successfully.`,
        });
      }
      setUsers(updatedUsers);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving user:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save user",
      });
    }

    setIsBusy(false);
  };

  return {
    users,
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
