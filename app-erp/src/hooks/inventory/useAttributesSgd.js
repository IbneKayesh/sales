import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { attributesAPI } from "@/api/inventory/attributesAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useAttributesSgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllAttribProduct = async (itemsId) => {
    try {
      setIsBusy(true);
      const response = await attributesAPI.getAllAttribProduct({
        muser_id: user.users_users,
        items_id: itemsId,
      });
      //console.log("data", user.users_users);
      setDataList(response.data);
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

  const handleGetAllAttribCategory = async (catId) => {
    try {
      setIsBusy(true);
      const response = await attributesAPI.getAllAttribCategory({
        muser_id: user.users_users,
        attrb_ctgry: catId,
      });
      //console.log("data", user.users_users);
      setDataList(response.data);
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
    handleGetAllAttribProduct,
    handleGetAllAttribCategory,
  };
};
