import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { territoryAPI } from "@/api/crm/territoryAPI";


export const useTerritorySgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadTerritories = async (trtry_tarea) => {
    try {
      const response = await territoryAPI.getByArea({
        trtry_users: user.users_users,
        trtry_bsins: user.users_bsins,
        trtry_tarea: trtry_tarea,
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