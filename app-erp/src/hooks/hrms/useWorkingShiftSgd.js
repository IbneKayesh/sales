import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { workingShiftAPI } from "@/api/hrms/workingShiftAPI";

export const useWorkingShiftSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveWorkingShift = async () => {
    try {
      setIsBusy(true);
      const response = await workingShiftAPI.getAllActive({
        wksft_users: user.users_users,
        wksft_bsins: user.users_bsins,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Working Shift",
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
    handleGetAllActiveWorkingShift,
  };
};
