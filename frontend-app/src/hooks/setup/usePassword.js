import { useState } from "react";
import { usersAPI } from "@/api/setup/usersAPI";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const fromDataModel = {
  pswrd_current: "",
  pswrd_new: "",
  pswrd_confirm: "",
};

export const usePassword = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isBusy, setIsBusy] = useState(false);
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
    e.preventDefault();
    setIsBusy(true);

    if (!validateForm()) {
      setIsBusy(false);
      return;
    }

    try {
      const fromDataUser = {
        id: user.id,
        users_email: user.users_email,
        pswrd_current: formData.pswrd_current,
        pswrd_new: formData.pswrd_new,
      };

      //console.log("fromDataUser: " + JSON.stringify(fromDataUser));

      const response = await usersAPI.changePassword(fromDataUser);
      //console.log("response: " + JSON.stringify(response));

      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      // Clear form
      setFormData(fromDataModel);
    } catch (error) {
      console.error("Error changing password:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }

    setIsBusy(false);
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
