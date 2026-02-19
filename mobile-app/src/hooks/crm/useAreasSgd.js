import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { tareaAPI } from "@/api/crm/tareaAPI";


export const useAreasSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadAreas = async (tarea_dzone) => {
    try {
      const response = await tareaAPI.getByZone({
        tarea_users: user.users_users,
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
    handleLoadAreas,
  }
};