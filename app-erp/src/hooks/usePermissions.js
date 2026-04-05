import { useState, useEffect } from "react";
import { authAPI } from "@/api/auth/authAPI";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useAppUI";
import { setStorageData, getStorageData } from "@/utils/storage";

export const usePermissions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const loadModules = async () => {
    try {
      setIsBusy(true);
      // const [response] = await Promise.all([
      //   authAPI.permissionsModules({
      //     id: user.users_users,
      //   }),
      //   new Promise((resolve) => setTimeout(resolve, 500)),
      // ]);
      //setDataList(response.data);
      const menus = getStorageData("user");
      //console.log(menus?.user?.menu_list)
      setDataList(menus?.user?.menu_list);
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
      // const [response] = await Promise.all([
      //   authAPI.permissionsMenus({
      //     id: user.users_users,
      //     menus_mdule: id,
      //   }),
      //   new Promise((resolve) => setTimeout(resolve, 500)),
      // ]);
      // //set to storage or send direct to leftbar
      // setStorageData({ menus: response.data });

      const menus = getStorageData("user");
      const subMenuList = menus?.user?.menu_list?.filter(item => item.id === id);
      //console.log("subItems", subMenuList[0].subItems)
      setStorageData({ menus: subMenuList[0].subItems });

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
