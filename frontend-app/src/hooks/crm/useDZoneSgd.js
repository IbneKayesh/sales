import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dzoneAPI } from "@/api/crm/dzoneAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useDZoneSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveDZones = async (dzone_cntry) => {
    try {
      setIsBusy(true);
      const response = await dzoneAPI.getByCountry({
        muser_id: user.users_users,
        dzone_cntry: dzone_cntry,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Zone",
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
    handleGetAllActiveDZones,
  };
};
