import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppUI } from "@/hooks/useAppUI";
import t_login from "@/models/auth/t_login.json";
import validate, { generateDataModel } from "@/models/validator";
import { setStorageLoginData } from "@/utils/storage";

const dataModel = generateDataModel(t_login);

const useLogin = () => {
  // ---Hooks
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();

  // ---States
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});

  // ---Functions
  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onLoginClick = async (rememberUser) => {
    const newErrors = validate(formData, t_login);
    setErrors(newErrors);
    //console.log("handleSave: " + JSON.stringify(newErrors));
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsBusy(true);

      const resp = await login(formData);
      if (resp.result) {
        navigate("/");
        if (rememberUser && formData.username) {
          setStorageLoginData({
            saved_user: {
              username: formData.username,
              usertext: resp.aempName
            },
            is_saved: true,
          });
        } else {
          setStorageLoginData({ saved_user: null, is_saved: false });
        }

        //console.log("resp",resp)
      } else {
        showToast("error", "Login", resp.message);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  return {
    formData,
    errors,
    onChange,
    onLoginClick
  }
};
export default useLogin;
