import { useState, useEffect } from "react";
import { productsAPI } from "@/api/inventory/productsAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmib_items from "@/models/inventory/tmib_items.json";
import tmib_bitem from "@/models/inventory/tmib_bitem.json";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmib_items, { edit_stop: 0 });
const dataModelBItem = generateDataModel(tmib_bitem, { edit_stop: 0 });

export const useProducts = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll({
        items_users: user.users_users,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setDataList(response.data);

      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_items);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
    //BItem
    setFormDataBItem(dataModelBItem);

    setBusinessItems([]);
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    //console.log("unit: " + JSON.stringify(unit));

    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await productsAPI.delete(rowData);

      // Remove deleted unit from local state
      const updatedList = dataList.filter((u) => u.id !== rowData.id);
      setDataList(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadProducts();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      const { items_puofm, items_dfqty, items_suofm } = formData;

      if (items_puofm === items_suofm && Number(items_dfqty) > 1) {
        showToast(
          "warn",
          "Warning",
          "If Primary Unit and Secondary Unit are the same, Difference Qty must be 1."
        );
        setIsBusy(false);
        return;
      } else if (items_puofm !== items_suofm && Number(items_dfqty) < 2) {
        showToast(
          "warn",
          "Warning",
          "If Primary Unit and Secondary Unit are different, Difference Qty must be greater than 1."
        );
        setIsBusy(false);
        return;
      }

      // Validate form
      const newErrors = validate(formData, tmib_items);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        items_users: user.users_users,
        user_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await productsAPI.update(formDataNew);
      } else {
        response = await productsAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      handleClear();
      setCurrentView("list");
      loadProducts();
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  // BItem
  const [formDataBItem, setFormDataBItem] = useState(dataModelBItem);

  const handleChangeBItem = (field, value) => {
    //console.log("handleChangeBItem: " + JSON.stringify(formDataBItem));
    setFormDataBItem((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataBItem, [field]: value },
      tmib_bitem
    );
    setErrors(newErrors);
  };
  const handleFetchBItem = async (itemId, businessId) => {
    //console.log("itemId: " + itemId);
    //console.log("businessId: " + businessId);
    //setFormDataBItem(dataModelBItem);

    try {
      const response = await productsAPI.getBItem({
        bitem_items: itemId,
        bitem_bsins: businessId,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));

      if (response?.data) {
        setFormDataBItem({
          ...response.data,
          bitem_items: itemId,
          bitem_bsins: businessId,
        });
      } else {
        setFormDataBItem({
          ...dataModelBItem,
          bitem_items: itemId,
          bitem_bsins: businessId,
        });
      }
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const handleSaveBItem = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formDataBItem, tmib_bitem);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const bitem_mpric = calculateApproxMargin();

      // Ensure id exists (for create)
      const formDataNewBItem = {
        ...formDataBItem,
        id: formDataBItem.id || generateGuid(),
        bitem_mpric: bitem_mpric,
        bitem_users: user.users_users,
        user_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formDataBItem.id) {
        response = await productsAPI.updateBItem(formDataNewBItem);
      } else {
        response = await productsAPI.createBItem(formDataNewBItem);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      //must clear business to prevent inserting same item in same business
      setFormDataBItem((prev) => ({
        ...prev,
        id: "",
        bitem_bsins: "",
      }));
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  const calculateApproxMargin = () => {
    //sales price = MRP or DP Rate
    const sales_dp_mrp = formDataBItem.bitem_mcmrp
      ? formDataBItem.bitem_mcmrp
      : formDataBItem.bitem_dprat;

    //discount amount = on sales price
    const discount_amount = sales_dp_mrp * (formDataBItem.bitem_sddsp / 100);

    //vat amount = on sales price
    const vat_amount = sales_dp_mrp * (formData.items_sdvat / 100);

    //cost amount = on purchase price
    const cost_amount =
      formDataBItem.bitem_lprat * (formData.items_costp / 100);

    //margin = sales price - (purchase price + discount amount + vat amount + cost amount)
    const margin =
      sales_dp_mrp -
      (Number(formDataBItem.bitem_lprat) +
        Number(discount_amount) +
        Number(vat_amount) +
        Number(cost_amount));
    return margin;
  };

  // Business Items
  const [businessItems, setBusinessItems] = useState([]);

  const handleItemPriceView = () => {
    setCurrentView("price");
  };

  const handleFetchBusinessItems = async (businessId) => {
    try {
      setBusinessItems([]);
      const response = await productsAPI.getBusinessItems({
        bitem_bsins: businessId,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setBusinessItems(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    // BItem
    formDataBItem,
    handleChangeBItem,
    handleSaveBItem,
    handleFetchBItem,
    // Business Items
    handleItemPriceView,
    handleFetchBusinessItems,
    businessItems,
  };
};
