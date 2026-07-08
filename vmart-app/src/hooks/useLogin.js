import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiLogin } from "@/utils/api";
import { useUI } from "@/pages/context/UIContext";
import { useAuth } from "@/pages/context/AuthContext";

const useLogin = () => {
  const navigate = useNavigate();
  const { showToast, setIsBusy, isBusy } = useUI();
  const { saveLoggedAuth } = useAuth();

  const [crTitle, setCrTitle] = useState("Login");
  const [crView, setCrView] = useState("LOGIN");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [roleName, setRoleName] = useState("CUSTOMER"); //SHOP

  const [searchParams] = useSearchParams();
  const vmart = searchParams.get("vmart");

  const viewTitleMap = {
    LOGIN: {
      title: "Sign In",
      subTitle: "Enter your name to continue",
      button: "Next",
      url: "/auth/v1/vmart/login",
    },
    PASSWORD: {
      title: "Login to vMart",
      subTitle: "Enter login password",
      button: "Login",
      url: "/auth/v1/vmart/login-with-password",
    },
    SIGNUP: {
      title: "Create Account",
      subTitle: "Sign up to continue",
      button: "Create & Login",
      url: "/auth/v1/vmart/login",
    },
  };

  const viewTitle = viewTitleMap[crView];

  const handleChange = (field, value) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    try {
      const reqBody = {
        ...formData,
        crView,
      };
      //console.log("reqBody", reqBody);
      if (!formData.users_id) {
        showToast("Mobile No is required", "error");
        return;
      }
      if (formData.users_id.length !== 11) {
        showToast("A valid mobile no is required", "error");
        return;
      }
      const apiUrl = viewTitleMap[crView];
      setIsBusy(true);
      const resp = await apiLogin(apiUrl.url, { body: reqBody });
      if (resp.success) {
        if (resp.data.users && Object.keys(resp.data.users).length > 0) {
          setCrView("PASSWORD");
        } else {
          setCrView("SIGNUP");
        }
      }
      //console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };
  const handlePassword = async () => {
    try {
      const reqBody = {
        ...formData,
        crView,
      };
      console.log("reqBody", reqBody);
      if (!formData.users_id) {
        showToast("Mobile No is required", "error");
        return;
      }
      if (formData.users_id.length !== 11) {
        showToast("A valid mobile no is required", "error");
        return;
      }
      if (!formData.users_pswrd) {
        showToast("Password is required", "error");
        return;
      }
      const apiUrl = viewTitleMap[crView];
      setIsBusy(true);
      const resp = await apiLogin(apiUrl.url, { body: reqBody });
      console.log("resp", resp);
      if (resp.success) {
        if (resp.data.users && Object.keys(resp.data.users).length > 0) {
          //redirect to home
          saveLoggedAuth(resp.data.users);
          navigate("/");
        } else {
          showToast(resp.message, "error");
        }
      }
      //console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };
  const handleRegister = async () => {
    try {
      console.log("SIGNUP");
    } catch (error) {}
  };
  const handleSubmitLogin = async () => {
    if (crView === "LOGIN") handleContinue();
    if (crView === "PASSWORD") handlePassword();
    if (crView === "SIGNUP") handleRegister();
  };
  const handleChangeMobileNo = () => {
    setCrView("LOGIN");
  };
  const handleChangeRole = (roleName) => {
    setRoleName(roleName);
  };
  const handleForgotPassword = () => {
    //setCrView("LOGIN");
  };
  const handleResetPassword = () => {
    //setCrView("LOGIN");
  };

  return {
    crTitle,
    crView,
    formData,
    errors,
    vmart,
    viewTitle,
    roleName,
    handleChange,
    handleSubmitLogin,
    handleChangeMobileNo,
    handleChangeRole,
    handleForgotPassword,
  };
};
export default useLogin;
