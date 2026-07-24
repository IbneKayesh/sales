import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  getStorageLoginData,
  setStorageLoginData,
} from "@/utils/storage";

const useLogin = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  const [formData, setFormData] = useState({
    username: "kayesh@sgd.com",
    password: "01722688266",
  });
  const [formErrors, setFormErrors] = useState("");
  const [savedLogin, setSavedLogin] = useState(false);

  // Load saved login data on mount
  useEffect(() => {
    const stored = getStorageLoginData();
    if (stored?.is_saved && stored?.saved_user) {
      setSavedLogin(true);
      setFormData((prev) => ({ ...prev, username: stored.saved_user }));
    }
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
  };

  const handleTryDifferentUser = () => {
    // Clear saved user data from storage
    setStorageLoginData({ is_saved: false, saved_user: null });
    // Reset form state — clear everything for a fresh login
    setSavedLogin(false);
    setFormData({ username: "", password: "" });
    setFormErrors("");
  };

  const handleSavedLoginChange = (checked) => {
    setSavedLogin(checked);
    if (!checked) {
      // User unchecked saved login — clear saved data
      setStorageLoginData({ is_saved: false, saved_user: null });
    }
  };

  const handleSubmitClick = async () => {
    setFormErrors("");
    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username) {
      setFormErrors("Please enter your username.");
      return;
    }
    if (!password) {
      setFormErrors("Please enter your password.");
      return;
    }
    try {
      setIsBusy(true);
      const resp = await login(formData);
      if (!resp.success) {
        setFormErrors(resp.message);
        return;
      }
      // On successful login, save credentials if checkbox is checked
      if (savedLogin) {
        setStorageLoginData({
          is_saved: true,
          saved_user: username,
        });
      }
      navigate("/");
    } catch (err) {
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    formData,
    formErrors,
    savedLogin,
    //functions
    handleChange,
    handleSubmitClick,
    handleSavedLoginChange,
    handleTryDifferentUser,
  };
};
export default useLogin;
