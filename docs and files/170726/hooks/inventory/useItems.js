import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_items from "@/models/inventory/tmib_items.json";
const dataModel = generateDataModel(tmib_items);
import { itemsAPI } from "@/api/inventory/itemsAPI.js";
import { unitsAPI } from "@/api/inventory/unitsAPI.js";
import { brandsAPI } from "@/api/inventory/brandsAPI.js";
import { subCategoryAPI } from "@/api/inventory/subCategoryAPI.js";
import { subGroupAPI } from "@/api/inventory/subGroupAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useItems = () => {
  //hooks :: menuId M06-M01-M008,
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
  const [crTitle, setCrTitle] = useState("Product List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [items_runit_Options, setItems_runit_Options] = useState([]);
  const [items_punit_Options, setItems_punit_Options] = useState([]);
  const [items_sgrup_Options, setItems_sgrup_Options] = useState([]);
  const [items_scatg_Options, setItems_scatg_Options] = useState([]);
  //const [items_itype_Options, setItems_itype_Options] = useState([]);
  const [items_brand_Options, setItems_brand_Options] = useState([]);

  const items_itype_Options = [
    { label_text: "Raw Material", value_text: "RM" },
    { label_text: "Packaging Material", value_text: "PM" },
    { label_text: "Finished Good", value_text: "FG" },
    { label_text: "Service", value_text: "SV" },
    { label_text: "Other", value_text: "OT" },
  ];

  useEffect(() => {
    const perms = getPageAuth("M06-M01-M008");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadItems = async () => {
    try {
      setIsBusy(true);
      const resp = await itemsAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmib_items);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Product");
    setCrView("form");
    handleGetUnit();
    handleGetSubGroup();
    handleGetSubCategory();
    handleGetBrand();
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.scatg_actve ? "Deactivate" : "Activate"} this ${rowData.scatg_sname}?`,
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
      const resp = await itemsAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Products List");
        setCrView("list");
        loadItems();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Products List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Product");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Products List");
    setCrView("list");
    loadItems();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Product");
    setCrView("form");
    setFormData(dataModel);
    handleGetUnit();
    handleGetSubGroup();
    handleGetSubCategory();
    handleGetBrand();
  };

  const handleSubmitClick = async () => {
    try {
      const { items_runit, items_pkqty, items_punit } = formData;

      if (items_runit === items_punit && Number(items_pkqty) > 1) {
        showToast(
          "warn",
          "Warning",
          "Retail Unit and Pack Unit are same, Pack Qty must be 1.",
        );
        return;
      } else if (items_runit !== items_punit && Number(items_pkqty) < 2) {
        showToast(
          "warn",
          "Warning",
          "Retail Unit and Pack Unit are different, Pack Qty must be more than 1.",
        );
        return;
      }

      const newErrors = validate(formData, tmib_items);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await itemsAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Product List");
        setCrView("list");
        loadItems();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetUnit = async () => {
    if (items_runit_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await unitsAPI.getAllActive();
      //console.log("resp", resp);
      setItems_runit_Options(resp.data);
      setItems_punit_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetSubGroup = async () => {
    if (items_sgrup_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await subGroupAPI.getAllActive();
      //console.log("resp", resp);
      setItems_sgrup_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetSubCategory = async () => {
    if (items_scatg_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await subCategoryAPI.getAllActive();
      //console.log("resp", resp);
      setItems_scatg_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetBrand = async () => {
    if (items_brand_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await brandsAPI.getAllActive();
      //console.log("resp", resp);
      setItems_brand_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleCopy = (rowData) => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setFormData({
      ...rowData,
      id: "",
      items_icode: "",
      items_brcod: "",
      items_iname: rowData.items_iname + " (Copy)",
    });

    setCrTitle("Add Product");
    setCrView("form");
    handleGetUnit();
    handleGetSubGroup();
    handleGetSubCategory();
    handleGetBrand();
  };

  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    items_runit_Options,
    items_punit_Options,
    items_sgrup_Options,
    items_scatg_Options,
    items_itype_Options,
    items_brand_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //other functions
    handleCopy,
  };
};
export default useItems;
