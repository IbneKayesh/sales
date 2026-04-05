import { useAuth } from "@/hooks/useAuth";
import { accountsAPI } from "@/api/accounts/accountsAPI";
import { useState } from "react";

export const useAccountsSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveAccounts = async () => {
    try {
      const response = await accountsAPI.getAllActive({
        bacts_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleGetAllActiveAccounts,
  }
};
