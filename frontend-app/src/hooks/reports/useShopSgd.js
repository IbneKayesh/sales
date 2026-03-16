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
      const [purchaseRes, salesRes] = await Promise.all([
        shopAPI.dPurchase({
          trnsc_users: user.users_users,
          trnsc_bsins: user.users_bsins,
          trsrt_trdat: trsrt_trdat,
          trend_trdat: trend_trdat,
        }),

        shopAPI.dSales({
          trnsc_users: user.users_users,
          trnsc_bsins: user.users_bsins,
          trsrt_trdat: trsrt_trdat,
          trend_trdat: trend_trdat,
        }),

        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
      //console.log("purchase", purchaseRes.data);
      //console.log("sales", salesRes.data);
      setDataList({
        purchase: purchaseRes.data,
        sales: salesRes.data,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Purchase, Sales data",
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
