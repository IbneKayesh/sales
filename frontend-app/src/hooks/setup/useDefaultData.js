import { useState, useEffect } from "react";
import { defaultDataAPI } from "@/api/setup/defaultDataAPI";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";

export const useDefaultData = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  const loadDefaultData = async () => {
    try {
      setIsBusy(true);
      const response = await defaultDataAPI.getAll({
        ucnfg_users: user.users_users,
        ucnfg_bsins: user.users_bsins,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Default Data",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadDefaultData();
  }, []);

  const handleSave = async (data) => {
    // e.preventDefault();
    try {
      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...data,
        ucnfg_users: user.users_users,
        ucnfg_bsins: user.users_bsins,
        user_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response = await defaultDataAPI.update(formDataNew);
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      // showToast(
      //   response.success ? "success" : "error",
      //   response.success ? "Success" : "Error",
      //   response.message ||
      //     "Operation " + (response.success ? "successful" : "failed"),
      // );

      loadDefaultData();
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Default Data",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    dataList,
    setFormData,
    handleSave,
  };
};
