import { useState, useEffect } from "react";
import { accountsHeadsAPI } from "@/api/accounts/accountsHeadsAPI";
import { generateGuid } from "@/utils/guid";
import t_accounts_heads from "@/models/accounts/t_accounts_heads.json";

const fromDataModel = {
  head_id: "",
  head_name: "",
  group_name: "",
  group_type: "",
  contact_type: "",
  current_balance: 0,
};


export const useAccountsHeads = () => {
  const [accountsHeadsList, setAccountsHeadsList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState(fromDataModel);

  const loadAccountsHeads = async (resetModified = false) => {
    try {
      const data = await accountsHeadsAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setAccountsHeadsList(data);
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadAccountsHeads();
  }, []);


  return {
    accountsHeadsList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
  };
};
