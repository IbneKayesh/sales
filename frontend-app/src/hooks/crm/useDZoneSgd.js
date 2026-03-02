import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dzoneAPI } from "@/api/crm/dzoneAPI";


export const useDZoneSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveDZones = async (dzone_cntry) => {
    try {
      const response = await dzoneAPI.getByCountry({
        muser_id: user.users_users,
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
    handleGetAllActiveDZones,
  }
};