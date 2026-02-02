import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { productsAPI } from "@/api/inventory/productsAPI";


export const useProductsSgd = () => {
  const { user } = useAuth();
  const [dataList, setDataList] = useState([]);

  const handleLoadBookingItems = async () => {
    try {
      const response = await productsAPI.getBookingItems({
        bitem_bsins: user.users_bsins,
      });
      //console.log("data",user.users_bsins);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

const handleLoadTransferItems = async (toBusinessId) => {
  //console.log("mtrsf_bsins_to ", toBusinessId);
  //return;
  try {
    const response = await productsAPI.getTransferItems({
      bitem_users: user.users_users,
      bitem_bsins: user.users_bsins,
      mtrsf_bsins_to: toBusinessId,
    });
    //console.log("data",user.users_bsins);
    setDataList(response.data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const handleLoadSalesItems = async () => {
  try {
    const response = await productsAPI.getSalesItems({ 
      bitem_users: user.users_users,
      bitem_bsins: user.users_bsins,
    });
    //console.log("data",user.users_bsins);
    setDataList(response.data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

  return {
    dataList,
    handleLoadBookingItems,
    handleLoadTransferItems,
    handleLoadSalesItems
  }
};