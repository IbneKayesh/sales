import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";

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

  const loadCreateReturn = async (state) => {
    console.log("state", state);
    setFormData(state);
    setCurrentView("form");
  };

  useEffect(() => {
    if (state) {
      loadCreateReturn(state);
    }
  }, [state]);
  return { isBusy, currentView, dataList, errors, formData };
};
