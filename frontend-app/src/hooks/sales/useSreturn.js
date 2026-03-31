import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";
import { sinvoiceAPI } from "@/api/sales/sinvoiceAPI";

export const useSreturn = () => {
  //const location = useLocation();
  //const data = location.state;
  const { state } = useLocation();
  const data = state || {};

  const { user, business } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [dataList, setDataList] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [formDataItemList, setFormDataItemList] = useState([]);

  const loadCreateReturn = async (state) => {
    //console.log("state", state);
    try {
      setIsBusy(true);
      //console.log("loadInvoice:");
      const response = await sinvoiceAPI.getReturn({
        minvc_users: user.users_users,
        minvc_bsins: user.users_bsins,
        minvc_refid: state,
      });
      //console.log("loadInvoice:", JSON.stringify(response));

      if (response.data && response.success) {
        setFormData(response.data);

        //details
        const responseDet = await sinvoiceAPI.getReturnDetails({
          minvc_refid: state,
        });
        setFormDataItemList(responseDet.data);

        setCurrentView("form");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "SI List",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadCreateReturn("7de9b196-c42c-4109-b635-2520da8ef464");
  },[]);

  // useEffect(() => {
  //   if (state) {
  //     loadCreateReturn(state);
  //   }
  // }, [state]);
  return { isBusy, currentView, dataList, errors, formData, formDataItemList };
};
