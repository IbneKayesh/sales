import { useState, useEffect } from "react";
import { authAPI } from "@/api/auth/authAPI";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { setStorageData } from "@/utils/storage";

export const usePermissions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const loadModules = async () => {
    try {
      setIsBusy(true);
      const response = await authAPI.permissionsModules({
        id: user.users_users,
      });
      //console.log("response", response);
      //response = { success, message, data }
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    } finally {
      setIsBusy(false);
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadModules();
  }, []);

  const handleFetchMenus = async (id) => {
    try {
      //console.log("handleFetchMenus", id);
      setIsBusy(true);
      const response = await authAPI.permissionsMenus({
        id: user.users_users,
        menus_mdule: id,
      });
      //set to storage or send direct to leftbar
      setStorageData({ menus: response.data });
      window.dispatchEvent(new CustomEvent("menusUpdated"));
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    } finally {
      setIsBusy(false);
    }
  };

  return {
    dataList,
    isBusy,
    handleFetchMenus,
  };
};
