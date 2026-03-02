import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { categoriesAPI } from "@/api/inventory/categoriesAPI";


export const useCategorySgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveCategory = async () => {
    try {
      const response = await categoriesAPI.getAllActive({
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
    handleGetAllActiveCategory,
  }
};