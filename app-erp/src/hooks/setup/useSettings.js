import { useState, useEffect } from "react";
import { settingsAPI } from "@/api/setup/settingsAPI";

const useSettings = () => {
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list");
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});

  const loadSettingsList = async () => {
    try {
      setIsBusy(true);
      const data = await settingsAPI.getAll();
      setDataList(data);

      console.log("Settings data loaded:", data);
    } catch (error) {
      console.error("Error fetching settings data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load settings data from server",
      });   
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadSettingsList();
  }, []);

  return {
    toastBox,
    dataList,
  };
};

export default useSettings;
