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

  const handleLoadPurchaseReceipt = async () => {
    try {
      setIsBusy(true);
      const response = await stockreportsAPI.purchaseReceipt({
        mrcpt_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleLoadPurchaseInvoice = async () => {
    try {
      setIsBusy(true);
      const response = await stockreportsAPI.purchaseInvoice({
        mrcpt_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleLoadInventoryTransfer = async () => {
    try {
      setIsBusy(true);
      const response = await stockreportsAPI.inventoryTransfer({
        mtrsf_bsins: user.users_bsins,
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

  const handleLoadReports = (reportFilter) => {
    setDataList([]);
    if (reportFilter === "pbooking") {
      handleLoadPurchaseBooking();
    }
    if (reportFilter === "preceipt") {
      handleLoadPurchaseReceipt();
    }
    if (reportFilter === "pinvoice") {
      handleLoadPurchaseInvoice();
    }
    if (reportFilter === "itransfer") {
      handleLoadInventoryTransfer();
    }
  };

  return {
    dataList,
    isBusy,
    handleLoadReports,
  };
};
