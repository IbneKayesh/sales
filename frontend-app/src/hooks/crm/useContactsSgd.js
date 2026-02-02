import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { contactAPI } from "@/api/crm/contactAPI";


export const useContactsSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadSuppliers = async () => {
    try {
      const response = await contactAPI.getAllSuppliers({
        cntct_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLoadCustomers = async () => {
    try {
      const response = await contactAPI.getAllCustomers({
        cntct_users: user.users_users,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return {
    dataList,
    handleLoadSuppliers,
    handleLoadCustomers
  }
};