import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const useLogin = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  const [formData, setFormData] = useState({
    username: "kayesh@sgd.com",
    password: "01722688266",
  });
  const [formErrors, setFormErrors] = useState("");

  const handleChange = (f, v) => {
    //console.log("f", f);
    //setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormData((prev) => ({ ...prev, [f]: v }));
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
      //console.log("login - resp", resp);
      if (!resp.success) {
        setFormErrors(resp.message);
        return;
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
    //functions
    handleChange,
    handleSubmitClick,
  };
};
export default useLogin;
