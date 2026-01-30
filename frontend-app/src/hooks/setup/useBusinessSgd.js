import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { businessAPI } from "@/api/auth/businessAPI";

export const useBusinessSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadBusiness = async () => {
    try {
      const response = await businessAPI.getAll({
        bsins_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadBusiness,
  };
};
