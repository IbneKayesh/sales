import { useState } from "react";
import { usersAPI } from "@/api/setup/usersAPI";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";

const fromDataModel = {
  pswrd_current: "",
  pswrd_new: "",
  pswrd_confirm: "",
};

export const usePassword = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { showToast } = useToast();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(fromDataModel);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    //console.log("formData: " + JSON.stringify(formData));

    if (!formData.pswrd_current) {
      newErrors.pswrd_current = "Current password is required";
    }

    if (!formData.pswrd_new) {
      newErrors.pswrd_new = "New password is required";
    } else if (formData.pswrd_new.length < 4) {
      newErrors.pswrd_new = "New password must be at least 4 characters";
    }

    if (!formData.pswrd_confirm) {
      newErrors.pswrd_confirm = "Confirm password is required";
    } else if (formData.pswrd_new !== formData.pswrd_confirm) {
      newErrors.pswrd_confirm = "Passwords do not match";
    }

    if (formData.pswrd_current === formData.pswrd_new) {
      newErrors.pswrd_new = "Current and New password are same";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      if (!validateForm()) {
        return { success: false, message: "Validation failed" };
      }

      setIsBusy(true);
      const fromDataUser = {
        id: user.id,
        users_email: user.users_email,
        pswrd_current: formData.pswrd_current,
        pswrd_new: formData.pswrd_new,
      };

      const response = await usersAPI.changePassword(fromDataUser);
      //response = { success, message, data }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Password - ${user.users_oname} ${
          response.success ? "modified" : "modification failed"
        } by ${user.users_oname}`,
        toast: false,
        notification: false,
        log: true,
      });

      if (response.success) {
        setFormData(fromDataModel);
      }
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );
      return response;
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Password",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
      return { success: false, message: error?.message || "Operation failed" };
    } finally {
      setIsBusy(false);
    }
  };

  const handleClear = () => {
    setFormData(fromDataModel);
    setErrors({});
  };

  return {
    isBusy,
    errors,
    formData,
    handleChange,
    handleSave,
    handleClear,
  };
};
