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
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { stockAPI } from "@/api/M04/stockAPI.js";
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import tmib_itmct from "@/models/M04/tmib_itmct.json";
import { itemContactAPI } from "@/api/M04/itemContactAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";
import { categoriesAPI } from "@/api/M04/categoriesAPI.js";

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
  const [tcVisibleItem, setTcVisibleItem] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  //others
  const [showModal, setShowModal] = useState({ show: false, modal: "" });
  const [modalTitle, setModalTitle] = useState({ title: "", subTitle: "" });

  const [units_Options, setUnits_Options] = useState([]);
  const [sgrup_Options, setSgrup_Options] = useState([]);
  const [scatg_Options, setScatg_Options] = useState([]);
  const [brand_Options, setBrand_Options] = useState([]);
  const [dpart_Options, setDpart_Options] = useState([]);
  //filter
  const [formDataFilter, setFormDataFilter] = useState({});
  const [mcatg_Options, setMcatg_Options] = useState([]);

  //Table Columns
  const getTabColumns = async () => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByPage({
        tabcl_cname: "SYS_INVENTORY_ITEMS",
      });
      const list = resp.data || [];
      //console.log("list", list);
      setTcVisibleItem(list);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const getAllItems = async (v) => {
    try {
      setIsBusy(true);
      const resp = await itemsAPI.getByFilter(v);
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAllCategories = async () => {
    try {
      setIsBusy(true);
      const resp = await categoriesAPI.getAllActive({});
      const list = resp.data || [];
      setMcatg_Options(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getTabColumns();
    //getAllItems();
    getAllCategories();
  }, []);

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_items);
    setFormErrors(newErrors);

    //filters
    if (pgView === "SYS_VW_LST_1" && f === "items_mcatg") {
      setFormDataFilter((prev) => ({ ...prev, [f]: v }));
      await getAllItems({ items_mcatg: v });
    }
    //console.log("pgView", f);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    getAllUnits();
    getAllSubGroups();
    getAllSubCategories();
    getAllBrands();
    setlistDataLedger([]);
    getItemSupplier(rowData.id);
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
        getAllItems(formDataFilter);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllItems(formDataFilter);
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
    setlistDataLedger([]);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setlistDataLedger([]);
    setSelectedItemPrice({});
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_items);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      // Purchase VAT, use same code for Purchase Entry
      if (formData.items_ptvat === "EXEMPT") {
        if (Number(formData.items_prvat) !== 0) {
          showToast("Purchase VAT % must be 0 for EXEMPT", { type: "danger" });
          return;
        }
      } else {
        if (Number(formData.items_prvat) === 0) {
          showToast("Purchase VAT % must not be 0", { type: "danger" });
          return;
        }
      }

      // Sales VAT, use same code for Sales Entry
      if (formData.items_stvat === "EXEMPT") {
        if (Number(formData.items_slvat) !== 0) {
          showToast("Sales VAT % must be 0 for EXEMPT", { type: "danger" });
          return;
        }
      } else {
        if (Number(formData.items_slvat) === 0) {
          showToast("Sales VAT % must not be 0", { type: "danger" });
          return;
        }
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
        getAllItems(formDataFilter);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //price (sub items)
  const [thisItem, setThisItem] = useState("");

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

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
    getAllDepartments();
  };

  const handleChangePrice = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_price);
    setFormErrors(newErrors);
  };

  const handleEditPrice = (rowData) => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem(rowData);
    setlistDataLedger([]);
    setSelectedItemPrice({});
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
    setFormDataItem({
      ...dataModelItem,
      price_items: thisItem.id,
      price_cname: thisItem.items_iname,
    });
    setReadOnly(false);
    setStopEdit(false);
    setlistDataLedger([]);
    setSelectedItemPrice({});
  };

  const handleCancelPrice = () => {
    setPgView("SYS_VW_LST_2");
    setFormDataItem(dataModelItem);
    setReadOnly(false);
    setStopEdit(false);
    setlistDataLedger([]);
    setSelectedItemPrice({});
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

  //ledger
  const [selectedItemPrice, setSelectedItemPrice] = useState({});
  const [listDataLedger, setlistDataLedger] = useState([]);
  const handleLedger = async (rowData) => {
    setSelectedItemPrice(rowData);
    setlistDataLedger([]);
    try {
      setIsBusy(true);
      const resp = await stockAPI.getPriceLedger({ price_id: rowData.id });
      const list = resp.data || [];
      setlistDataLedger(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //item contact
  const [cntct_Options, setCntct_Options] = useState([]);
  const [formDataCntct, setFormDataCntct] = useState({});
  const [listDataCntct, setListDataCntct] = useState([]);

  const getAvailItemSupplier = async (id) => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.getAvailItemSupplier({ itmct_items: id });
      const data = resp.data || {};
      setCntct_Options(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getItemSupplier = async (id) => {
    try {
      setIsBusy(true);
      const resp = await itemContactAPI.getByItemId({ itmct_items: id });
      const data = resp.data || {};
      setListDataCntct(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeCntct = (f, v) => {
    setFormDataCntct((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataCntct, [f]: v }, tmib_itmct);
    setFormErrors(newErrors);
  };

  const handleDeleteCntct = async (rowData) => {
    const isActive = rowData.itmct_actve;
    const dataName = rowData.cntct_cname;
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
      const resp = await itemContactAPI.delete(rowData);
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
        handleHideModal();
        setFormDataCntct({});
        getItemSupplier(rowData.itmct_items);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubmitCntct = async () => {
    try {
      const newErrors = validate(formDataCntct, tmib_itmct);
      setFormErrors(newErrors);
      //console.log("newErrors", newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const cntct_id = cntct_Options.find(
        (opt) => opt.id === formDataCntct.itmct_cntct,
      );
      const reqBody = {
        ...formDataCntct,
        cntct_cname: cntct_id.cntct_cname,
      };
      setIsBusy(true);

      const resp = await itemContactAPI.create(reqBody);
      // alertBox({
      //   title: resp.success
      //     ? formDataCntct.id
      //       ? "Updated"
      //       : "Saved"
      //     : "Error",
      //   message: resp.message,
      //   variant: resp.success ? "success" : "danger",
      //   confirmText: resp.success ? "Done" : "Close",
      // });
      showToast(resp.message, { type: resp.success ? "success" : "danger" });
      if (resp.success) {
        handleHideModal();
        getItemSupplier(formDataCntct.itmct_items);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "SUPPLIER") {
      setFormDataCntct({ itmct_items: formData.id });
      setModalTitle({
        title: "Add Supplier",
        subTitle: "Item supplier details",
      });
      getAvailItemSupplier({ itmct_items: formData.id });
    }
    setShowModal({ show: true, modal: modal });
  };
  const handleHideModal = () => {
    setShowModal({ show: false, modal: "" });
    setModalTitle({ title: "", subTitle: "" });
  };

  return {
    isBusy,
    pgView,
    pageAuth,
    tcVisibleItem,
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
    dpart_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //price
    thisItem,
    handlePrice,
    handleChangePrice,
    handleEditPrice,
    handleDeletePrice,
    handleAddNewPrice,
    handleCancelPrice,
    handleSubmitPrice,
    //ledger
    selectedItemPrice,
    listDataLedger,
    handleLedger,
    //item contact
    cntct_Options,
    formDataCntct,
    listDataCntct,
    handleChangeCntct,
    handleDeleteCntct,
    handleSubmitCntct,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
    //filter
    mcatg_Options,
    formDataFilter,
  };
};
export default useItems;
