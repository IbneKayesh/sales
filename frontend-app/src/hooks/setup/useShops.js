import { useState, useEffect } from "react";
import { shopsAPI } from "@/api/setup/shopsAPI";
import validate from "@/models/validator";
import t_shops from "@/models/setup/t_shops";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { currentDate, formatDateForAPI } from "@/utils/datetime";

const dataModel = {
  shop_id: "",
  shop_name: "",
  shop_address: "",
  bin_no: "",
  open_date: currentDate(),
  edit_stop: 0,
};

export const useShops = () => {
  const { user } = useAuth();
  const [shopList, setShopList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [fromData, setFormData] = useState(dataModel);

  const loadShops = async () => {
    try {
      const response = await shopsAPI.getAll();
      // response = { message, data }

      setShopList(response.data);

      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
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
    setFormData(dataModel);
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
      bin_no: shop.bin_no,
      open_date: shop.open_date,
      edit_stop: shop.edit_stop,
    });
    setCurrentView("form");
  };

  const handleDeleteShop = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await shopsAPI.delete({ shop_id: rowData.shop_id });

      // Remove deleted shop from local state
      const updatedList = shopList.filter((s) => s.shop_id !== rowData.shop_id);
      setShopList(updatedList);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: response.message || "Deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete data",
      });
    }
  };

  const handleRefresh = () => {
    loadShops();
  };

  const handleSaveShop = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(fromData, t_shops);
      setErrors(newErrors);
      console.log("handleSaveShop:", JSON.stringify(fromData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure shop_id exists (for create)
      const formDataNew = {
        ...fromData,
        shop_id: fromData.shop_id || generateGuid(),
        open_date: formatDateForAPI(fromData.open_date),
      };

      // Call API and get { message, data }
      let response;
      if (fromData.shop_id) {
        response = await shopsAPI.update(formDataNew);
      } else {
        response = await shopsAPI.create(formDataNew);
      }

      // Update toast using API message
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message || "Operation successful",
      });

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadShops(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error saving data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to save data",
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
