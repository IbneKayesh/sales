import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { stockreportsAPI } from "@/api/inventory/stockreportsAPI";

export const useStockReports = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const handleLoadPurchaseBooking = async () => {
    try {
      setIsBusy(true);
      const response = await stockreportsAPI.purchaseBooking({
        mbkng_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
  }, []);

  return {
    dataList,
    isBusy,
    handleLoadPurchaseBooking,
  };
};
