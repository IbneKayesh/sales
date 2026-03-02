import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { unitsAPI } from "@/api/inventory/unitsAPI";

export const useUnitsSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveUnits = async () => {
    try {
      const response = await unitsAPI.getAllActive({
        muser_id: user.users_users,
      });
      //console.log("data",user.users_bsins);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleGetAllActiveUnits,
  };
};