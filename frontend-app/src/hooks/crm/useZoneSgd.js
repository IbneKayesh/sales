import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { tareaAPI } from "@/api/crm/tareaAPI";


export const useZoneSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadZones = async (dzone_cntry) => {
    try {
      const response = await tareaAPI.getByZone({
        cntct_users: user.users_users,
        dzone_cntry: dzone_cntry,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadZones,
  }
};