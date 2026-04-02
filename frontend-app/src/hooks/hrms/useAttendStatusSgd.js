import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { attendStatusAPI } from "@/api/hrms/attendStatusAPI";

export const useAttendStatusSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAppLeave = async () => {
    try {
      setIsBusy(true);
      const response = await attendStatusAPI.getApplLeave({
        atnst_users: user.users_users,
        atnst_bsins: user.users_bsins,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Applicable Leave",
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
    handleGetAppLeave,
  };
};
