import { useState } from "react";
import { usersAPI } from "@/api/usersAPI";
import { useAuth } from "@/hooks/useAuth";

export const useChangePassword = () => {
  const { user } = useAuth();
  const [isBusy, setIsBusy] = useState(false);
  const [toastBox, setToastBox] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 4) {
      newErrors.newPassword = "New password must be at least 4 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsBusy(true);

    if (!validateForm()) {
      setIsBusy(false);
      return;
    }

    try {
      await usersAPI.changePassword(
        user.user_id,
        formData.currentPassword,
        formData.newPassword
      );

      setToastBox({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully",
      });

      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to change password",
      });
    }

    setIsBusy(false);
  };

  const handleClear = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return {
    isBusy,
    toastBox,
    errors,
    formData,
    handleChange,
    handleSave,
    handleClear,
  };
};
