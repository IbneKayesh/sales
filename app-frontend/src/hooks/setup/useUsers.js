import { useState, useEffect } from "react";
import { usersAPI } from "@/utils/api";

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

  // Load users from API on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to load users from server",
        });
      }
    };
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

      const toastBox = {
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      };
      setToastBox(toastBox);
    } catch (error) {
      console.error('Error deleting user:', error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete user",
      });
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    const newErrors = validate(formDataUser, t_users.t_users);
    setErrors(newErrors);

    console.log("handleSaveUser: " + JSON.stringify(newErrors));

    if (Object.keys(newErrors).length === 0) {
      try {
        let updatedUsers;
        if (formDataUser.user_id) {
          // Edit existing
          const updatedUser = await usersAPI.update(formDataUser.user_id, formDataUser);
          updatedUsers = users.map((u) =>
            u.user_id === formDataUser.user_id ? updatedUser : u
          );

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataUser.username}" updated successfully.`,
          };
          setToastBox(toastBox);
        } else {
          // Add new
          const newUser = await usersAPI.create(formDataUser);
          updatedUsers = [...users, newUser];

          const toastBox = {
            severity: "success",
            summary: "Success",
            detail: `"${formDataUser.username}" added successfully.`,
          };
          setToastBox(toastBox);
        }
        setUsers(updatedUsers);

        handleClear();
        setCurrentView("list");
      } catch (error) {
        console.error('Error saving user:', error);
        setToastBox({
          severity: "error",
          summary: "Error",
          detail: "Failed to save user",
        });
      }
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
    handleSaveUser,
  };
};
