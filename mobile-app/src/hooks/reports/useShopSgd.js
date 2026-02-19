import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { shopAPI } from "@/api/reports/shopAPI";

export const useShopSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadShopSummary = async (trsrt_trdat, trend_trdat) => {
    try {
      setDataList([]);
      const response = await shopAPI.summary({
        trnsc_users: user.users_users,
        trnsc_bsins: user.users_bsins,
        trsrt_trdat: trsrt_trdat,
        trend_trdat: trend_trdat,
      });
      console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadShopSummary,
  };
};
