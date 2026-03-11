import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { attributesAPI } from "@/api/inventory/attributesAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useAttributesSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveAttrib = async () => {
    try {
      setIsBusy(true);
      const response = await attributesAPI.getAll({
        muser_id: user.users_users,
      });
      //console.log("data", user.users_users);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "PBI Items",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  return { isBusy, dataList, handleGetAllActiveAttrib };
};
