import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_price from "@/models/inventory/tmib_price.json";
const dataModel = generateDataModel(tmib_price);
import { priceAPI } from "@/api/inventory/priceAPI.js";
import { itemsAPI } from "@/api/inventory/itemsAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const usePrice = () => {
  //hooks :: menuId M06-M01-M009,
  //mnusr_extpr : export, mnusr_addpr : add, mnusr_edtpr : edit, mnusr_delpr : delete
  const { getPageAuth } = useAuth();
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } =
    useAppUI();
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [crTitle, setCrTitle] = useState("Price List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [price_items_Options, setPrice_items_Options] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M06-M01-M009");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadPrice = async () => {
    try {
      setIsBusy(true);
      const resp = await priceAPI.getAll({});
      //console.log("resp", resp);
      setDataList(resp.data || []);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_price);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Price");
    setCrView("form");
    setPrice_items_Options([
      { id: rowData.price_items, items_iname: rowData.items_iname },
    ]);
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.price_actve ? "Deactivate" : "Activate"} this ${rowData.items_iname}?`,
      header: "Confirmation!",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        console.log("Operation is cancelled");
      },
    });
  };

  const onDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const resp = await priceAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Price List");
        setCrView("list");
        loadPrice();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Price List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Price");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Price List");
    setCrView("list");
    loadPrice();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Price");
    setCrView("form");
    setFormData(dataModel);
    handleGetItems();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmib_price);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      //fetch items name if not already present
      const items_iname = price_items_Options.find(
        (item) => item.id === formData.price_items
      )?.items_iname;
      if (items_iname) {
        formData.items_iname = items_iname;
      }

      const resp = await priceAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Price List");
        setCrView("list");
        loadPrice();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetItems = async () => {
    // if (price_items_Options.length > 0) {
    //   return;
    // }
    try {
      setIsBusy(true);
      const resp = await itemsAPI.getNewBusinessItems();
      //console.log("resp", resp);
      setPrice_items_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //products

  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    price_items_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
  };
};
export default usePrice;
