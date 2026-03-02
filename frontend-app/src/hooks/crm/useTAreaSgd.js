import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { tareaAPI } from "@/api/crm/tareaAPI";


export const useTAreaSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleGetAllActiveTAreas = async (tarea_dzone) => {
    try {
      const response = await tareaAPI.getByZone({
        muser_id: user.users_users,
        tarea_dzone: tarea_dzone,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleGetAllActiveTAreas,
  }
};