import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { accountsHeadsAPI } from "@/api/accounts/accountsHeadsAPI";

export const useAccountsHeadsSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveHeads = async () => {
    try {
      const response = await accountsHeadsAPI.getAllActive({
        trhed_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  
  const handleGetAllAdviceHeads = async () => {
    try {
      const response = await accountsHeadsAPI.getAllAdvice({
        trhed_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleGetAllActiveHeads,
    handleGetAllAdviceHeads
  }
};
