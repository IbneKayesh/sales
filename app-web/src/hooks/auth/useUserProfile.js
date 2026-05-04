import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmnb_users_pswd from "@/models/settings/tmnb_users_pswd.json";
const dataModel = generateDataModel(tmnb_users_pswd);
import { usersAPI } from "@/api/settings/usersAPI.js";
import { useAuth } from "@/hooks/useAuth";

const useUserProfile = () => {
  const { user } = useAuth();
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } =
    useAppUI();
  const [crTitle, setCrTitle] = useState("Profile List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [formDataPswrd, setFormDataPswrd] = useState(dataModel);

  //functions
  const loadUserProfile = async () => {
    setFormData(user);
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    //error validation is not required
  };

  const handleSaveClick = async () => {
    showToast("error", "Update", "Profile updates are restricted.");
  };

  const handleChangePaswrd = (field, value) => {
    setFormDataPswrd((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataPswrd, [field]: value },
      tmnb_users_pswd,
    );
    setErrors(newErrors);
  };
  const handleChangePswrdClick = () => {
    setCrTitle("Change Password");
    setCrView("form");
    setFormDataPswrd({
      ...dataModel,
      id: formData.id,
      users_email: formData.users_email,
    });
    setErrors({});
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formDataPswrd, tmnb_users_pswd);
      if (formDataPswrd.users_pswrd_new !== formDataPswrd.users_pswrd_con) {
        newErrors.users_pswrd_con = "Passwords do not match";
      }

      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await usersAPI.changePassword(formDataPswrd);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: resp.success ? "Updated" : "Error",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Profile");
        setCrView("list");
        loadUserProfile();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  return {
    //hooks
    crTitle,
    crView,
    setCrView,
    formData,
    formDataPswrd,
    errors,
    dataList,
    //other states
    //functions
    handleChange,
    handleSaveClick,
    handleChangePaswrd,
    handleChangePswrdClick,
    handleSubmitClick,
  };
};
export default useUserProfile;
