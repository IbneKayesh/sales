import { useState, useEffect } from "react";
import { grainsAPI } from "@/api/support/grainsAPI";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export const useGrains = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);

  const loadGrains = async () => {
    try {
      const response = await grainsAPI.getAll({
        users_users: user.users_users,
      });
      // response = { message, data }

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadGrains();
  }, []);

  const handleRefresh = () => {
    loadGrains();
  };

  return {
    dataList,
    handleRefresh,
  };
};
