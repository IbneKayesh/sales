import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dzoneAPI } from "@/api/crm/dzoneAPI";


export const useZoneSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadZones = async (dzone_cntry) => {
    try {
      const response = await dzoneAPI.getByCountry({
        dzone_users: user.users_users,
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