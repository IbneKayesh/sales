import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { brandsAPI } from "@/api/inventory/brandsAPI";

export const useBrandsSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveBrands = async () => {
    try {
      const response = await brandsAPI.getAllActive({
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
    handleGetAllActiveBrands,
  };
};