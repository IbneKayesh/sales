import { useState, useEffect } from "react";
import { shopsAPI } from "@/api/setup/shopsAPI";
import validate from "@/models/validator";
import t_shops from "@/models/setup/t_shops";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";

export const useShops = () => {
  const { user } = useAuth();
  const [shopList, setShopList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [fromData, setFormData] = useState({
    shop_id: "",
    shop_name: "",
    shop_address: "",
    edit_stop: 0,
  });


  const loadShops = async (resetModified = false) => {
    try {
      const data = await shopsAPI.getAll();
      //console.log("data: " + JSON.stringify(data));
      setShopList(data);

      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadShops();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...fromData, [field]: value }, t_shops);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      shop_id: "",
      shop_name: "",
      shop_address: "",
      edit_stop: 0,
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEditShop = (shop) => {
    //console.log("shop: " + JSON.stringify(shop));

    setFormData({
      shop_id: shop.shop_id,
      shop_name: shop.shop_name,
      shop_address: shop.shop_address,
      edit_stop: shop.edit_stop,
    });
    setCurrentView("form");
  };

  const handleDeleteShop = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await shopsAPI.delete(rowData);
      const updatedShops = shopList.filter(
        (s) => s.shop_id !== rowData.shop_id
      );
      setShopList(updatedShops);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting shop:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete shop",
      });
    }
  };

  const handleRefresh = () => {
    loadShops(true);
  };

  const handleSaveShop = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      const newErrors = validate(fromData, t_shops);
      setErrors(newErrors);
      console.log("handleSaveShop: " + JSON.stringify(fromData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...fromData,
        shop_id: fromData.shop_id || generateGuid(),
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      if (fromData.shop_id) {
        await shopsAPI.update(formDataNew);
      } else {
        await shopsAPI.create(formDataNew);
      }

      const message = fromData.shop_id
        ? `"${fromData.shop_name}" Updated`
        : "Created";
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: `${message} successfully.`,
      });

      handleClear();
      setCurrentView("list");
      loadShops();
    } catch (error) {
      console.error("Error fetching data:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data from server",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    shopList,
    toastBox,
    isBusy,
    currentView,
    errors,
    fromData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditShop,
    handleDeleteShop,
    handleRefresh,
    handleSaveShop,
  };
};
