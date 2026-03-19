import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { tareaAPI } from "@/api/crm/tareaAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useTAreaSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveTAreas = async (tarea_dzone) => {
    try {
      setIsBusy(true);
      const response = await tareaAPI.getByZone({
        muser_id: user.users_users,
        tarea_dzone: tarea_dzone,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Area",
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
    handleGetAllActiveTAreas,
  };
};
