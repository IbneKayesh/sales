import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { contactAPI } from "@/api/crm/contactAPI";


export const useUsersSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadUsers = async () => {
    try {
      const response = await usersAPI.getByRole({
        users_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadUsers,
  }
};