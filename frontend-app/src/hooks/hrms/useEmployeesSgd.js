import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { employeesAPI } from "@/api/hrms/employeesAPI";


export const useEmployeesSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadAvailableRouteEmployees = async () => {
    try {
      const response = await employeesAPI.availableRouteEmployees({
        emply_users: user.users_users,
        emply_bsins: user.users_bsins,
      });
      //console.log("data",response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };


  return {
    dataList,
    handleLoadAvailableRouteEmployees,
  }
};