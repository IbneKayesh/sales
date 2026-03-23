import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { expCategoryAPI } from "@/api/accounts/expCategoryAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

export const useExpCategorySgd = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveCategory = async () => {
    try {
      setIsBusy(true);
      const response = await expCategoryAPI.getAllActive({
        exctg_users: user.users_users,
        exctg_bsins: user.users_bsins,
      });
      //console.log("data", user.users_users);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Category",
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
    handleGetAllActiveCategory,
  };
};
