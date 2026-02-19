import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { territoryAPI } from "@/api/crm/territoryAPI";


export const useTerritorySgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadTerritories = async () => {
    try {
      const response = await territoryAPI.getAll({
        trtry_users: user.users_users,
        trtry_bsins: user.users_bsins,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadTerritories,
  }
};