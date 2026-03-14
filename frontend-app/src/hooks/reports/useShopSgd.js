import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { shopAPI } from "@/api/reports/shopAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useShopSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetShopDashboard = async (trsrt_trdat, trend_trdat) => {
    try {
      setIsBusy(true);
      setDataList([]);
      const response = await shopAPI.dashboard({
        trnsc_users: user.users_users,
        trnsc_bsins: user.users_bsins,
        trsrt_trdat: trsrt_trdat,
        trend_trdat: trend_trdat,
      });
      console.log("data", response.data);
      setDataList({ purchase: response.data });
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

  return {
    isBusy,
    dataList,
    handleGetShopDashboard,
  };
};
