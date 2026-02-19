import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { attributesAPI } from "@/api/inventory/attributesAPI";


export const useAttributesSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadAttributes = async () => {
    try {
      const response = await attributesAPI.getAll({
        attrb_users: user.users_users,
      });
      //console.log("data",user.users_bsins);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadAttributes,
  }
};