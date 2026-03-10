import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { businessAPI } from "@/api/setup/businessAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useBusinessSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveBusiness = async () => {
    try {
      setIsBusy(true);
      const response = await businessAPI.getAllActive({
        muser_id: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Business",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    dataList,
    handleGetAllActiveBusiness,
  };
};
