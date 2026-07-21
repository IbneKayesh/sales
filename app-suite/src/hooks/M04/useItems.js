import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmib_items from "@/models/M04/tmib_items.json";
const dataModel = generateDataModel(tmib_items);
import { priceAPI } from "@/api/M04/priceAPI.js";
import tmib_price from "@/models/M04/tmib_price.json";
const dataModelItem = generateDataModel(tmib_price);
import { brandAPI } from "@/api/M04/brandAPI.js";
import { subGroupsAPI } from "@/api/M04/subGroupsAPI.js";
import { subCategoriesAPI } from "@/api/M04/subCategoriesAPI.js";
import { unitsAPI } from "@/api/M04/unitsAPI.js";

const useItems = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M01-M001");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  //others
  const [units_Options, setUnits_Options] = useState([]);
  const [sgrup_Options, setSgrup_Options] = useState([]);
  const [scatg_Options, setScatg_Options] = useState([]);
  const [brand_Options, setBrand_Options] = useState([]);

  const getAllItems = async () => {
    try {
      setIsBusy(true);
      const resp = await itemsAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_items);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    getAllUnits();
    getAllSubGroups();
    getAllSubCategories();
    getAllBrands();
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.items_actve;
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${
        isActive ? "deactivate" : "activate"
      } "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await itemsAPI.delete(rowData);
      alertBox({
        title: resp.success
          ? isActive
            ? "Deactivated"
            : "Activated"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllItems();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllItems();
  };

  const getAllUnits = async () => {
    if (units_Options.length > 0) {
      return;
    }
    try {
      const resp = await unitsAPI.getAllActive({});
      const list = resp.data || [];
      setUnits_Options(list);
    } catch (error) {}
  };

  const getAllSubGroups = async () => {
    if (sgrup_Options.length > 0) {
      return;
    }
    try {
      const resp = await subGroupsAPI.getAllActive({});
      const list = resp.data || [];
      setSgrup_Options(list);
    } catch (error) {}
  };

  const getAllSubCategories = async () => {
    if (scatg_Options.length > 0) {
      return;
    }
    try {
      const resp = await subCategoriesAPI.getAllActive({});
      const list = resp.data || [];
      setScatg_Options(list);
    } catch (error) {}
  };

  const getAllBrands = async () => {
    if (brand_Options.length > 0) {
      return;
    }
    try {
      const resp = await brandAPI.getAllActive({});
      const list = resp.data || [];
      setBrand_Options(list);
    } catch (error) {}
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    getAllUnits();
    getAllSubGroups();
    getAllSubCategories();
    getAllBrands();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_items);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await itemsAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllItems();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //price (sub items)
  const [thisItem, setThisItem] = useState("");

  const getAllPrices = async (id) => {
    try {
      setIsBusy(true);
      const resp = await priceAPI.getAllByItem({ price_items: id });
      const list = resp.data || [];
      setListDataItem(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handlePrice = async (rowData) => {
    setThisItem(rowData);
    setPgView("SYS_VW_LST_2");
    getAllPrices(rowData.id);
  };

  const handleChangePrice = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_price);
    setFormErrors(newErrors);
  };

  const handleEditPrice = (rowData) => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem(rowData);
  };

  const handleDeletePrice = async (rowData) => {
    const isActive = rowData.price_actve;
    const dataName = rowData.price_cname;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${
        isActive ? "deactivate" : "activate"
      } "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await priceAPI.delete(rowData);
      alertBox({
        title: resp.success
          ? isActive
            ? "Deactivated"
            : "Activated"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_2");
        setFormDataItem(dataModelItem);
        getAllPrices(thisItem.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddNewPrice = () => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem({ ...dataModelItem, price_items: thisItem.id });
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancelPrice = () => {
    setPgView("SYS_VW_LST_2");
    setFormDataItem(dataModelItem);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmitPrice = async () => {
    try {
      const newErrors = validate(formDataItem, tmib_price);
      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const reqBody = {
        ...formDataItem,
      };
      setIsBusy(true);

      const resp = await priceAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formDataItem.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_2");
        setFormDataItem(dataModelItem);
        getAllPrices(thisItem.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    units_Options,
    sgrup_Options,
    scatg_Options,
    brand_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //price
    handlePrice,
    handleChangePrice,
    handleEditPrice,
    handleDeletePrice,
    handleAddNewPrice,
    handleCancelPrice,
    handleSubmitPrice,
  };
};
export default useItems;
