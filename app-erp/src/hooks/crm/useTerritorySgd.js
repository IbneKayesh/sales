import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { territoryAPI } from "@/api/crm/territoryAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useTerritorySgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveTerritories = async (trtry_tarea) => {
    try {
      setIsBusy(true);
      const response = await territoryAPI.getByArea({
        trtry_users: user.users_users,
        trtry_bsins: user.users_bsins,
        trtry_tarea: trtry_tarea,
      });
      //console.log("data",response);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Territories",
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
    dataList,
    handleGetAllActiveTerritories,
  };
};
