import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiLogin } from "../../src/utils/api";

const useLogin = () => {
  const [crTitle, setCrTitle] = useState("Login");
  const [crView, setCrView] = useState("LOGIN");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  const [searchParams] = useSearchParams();
  const vmart = searchParams.get("vmart");

  const viewTitleMap = {
    LOGIN: {
      title: "Welcome Back",
      subTitle: "Sign in to continue",
      button: "Next",
      url: "/auth/v1/vmart/login",
    },
    PASSWORD: {
      title: "Login vMart",
      subTitle: "Enter password",
      button: "Login",
      url: "/auth/v1/vmart/login",
    },
    SIGNUP: {
      title: "Create Account",
      subTitle: "Sign up to continue",
      button: "Create",
      url: "/auth/v1/vmart/login",
    },
  };

  const viewTitle = viewTitleMap[crView];

  const handleChange = (field, value) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    const reqBody = {
      ...formData,
      crView,
    };
    console.log(reqBody);
    if (!formData.users_id) {
      setErrors({ users_id: "Mobile No is required" });
      return;
    }
    if (formData.users_id.length !== 11) {
      setErrors({ users_id: "A valid mobile no is required" });
      return;
    }

    const apiUrl = viewTitleMap[crView];
    const resp = await apiLogin(apiUrl.url, { body: reqBody });
    if (resp.success) {
      if (resp.data.users && Object.keys(resp.data.users).length > 0) {
        setCrView("PASSWORD");
      } else {
        setCrView("SIGNUP");
      }
    }

    console.log(resp);
  };
  const handleChangeMobileNo = () => {
    setCrView("LOGIN");
  };

  return {
    crTitle,
    crView,
    formData,
    errors,
    vmart,
    viewTitle,
    handleChange,
    handleLogin,
    handleChangeMobileNo,
  };
};
export default useLogin;
