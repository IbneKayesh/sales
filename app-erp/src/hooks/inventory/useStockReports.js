import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { stockreportsAPI } from "@/api/inventory/stockreportsAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useStockReports = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();

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

  useEffect(() => {}, []);

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

  const handleUpdatePrice = async (rowData) => {
    //console.log("rowData", rowData);
    try {
      if (Number(rowData.cinvc_dprat) <= Number(rowData.cinvc_itrat)) {
        notify({
          severity: "error",
          summary: "Price update",
          detail: "DP must be greater than PP",
          toast: true,
          notification: true,
          log: false,
        });
        return;
      }

      if (Number(rowData.cinvc_mcmrp) <= Number(rowData.cinvc_dprat)) {
        notify({
          severity: "error",
          summary: "Price update",
          detail: "MRP must be greater than DP",
          toast: true,
          notification: true,
          log: false,
        });
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        cinvc_id: rowData.cinvc_id || generateGuid(),
        cinvc_dprat: rowData.cinvc_dprat || 0,
        cinvc_mcmrp: rowData.cinvc_mcmrp || 0,
        suser_id: user.id,
      };
      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;
      let response = await stockreportsAPI.purchaseInvoiceUpdate(formDataNew);

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Price - ${rowData.items_iname} ${
          response.success ? "modified" : "modification failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        await handleLoadPurchaseInvoice();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Price update",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetItemLedger = async (rowData) => {
    try {
      setIsBusy(true);
      const response = await stockreportsAPI.itemLedger({
        muser_id: user.users_users,
        bsins_id: user.users_bsins,
        bitem_id: rowData
      });
      console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "SI Items",
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
    isBusy,
    handleLoadReports,
    handleUpdatePrice,
    handleGetItemLedger
  };
};
