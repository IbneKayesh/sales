import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { employeesAPI } from "@/api/hrms/employeesAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useEmployeesSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleLoadAvailableRouteEmployees = async () => {
    try {
      setIsBusy(true);
      const response = await employeesAPI.availableRouteEmployees({
        emply_users: user.users_users,
        emply_bsins: user.users_bsins,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Employee",
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
    handleLoadAvailableRouteEmployees,
  };
};
