import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { contactAPI } from "@/api/crm/contactAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";


export const useContactsSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveSuppliers = async () => {
    try {
      setIsBusy(true);
      const response = await contactAPI.getAllSuppliers({
        muser_id: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Supplier",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleLoadCustomers = async () => {
    try {
      const response = await contactAPI.getAllCustomers({
        cntct_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLoadReceiptSuppliers = async () => {
    try {
      const response = await contactAPI.getAllReceiptSuppliers({
        cntct_users: user.users_users,
        cntct_bsins: user.users_bsins,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLoadRouteOutlets = async (routeId) => {
    try {
      const response = await contactAPI.getRouteOutletsAvailable({
        cntct_users: user.users_users,
        cntct_bsins: user.users_bsins,
        cnrut_rutes: routeId
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleGetAllActiveSuppliers,
    handleLoadCustomers,
    handleLoadReceiptSuppliers,
    handleLoadRouteOutlets
  }
};