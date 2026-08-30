import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { categoriesAPI } from "@/api/M04/categoriesAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmib_mcatg from "@/models/M04/tmib_mcatg.json";
const dataModel = generateDataModel(tmib_mcatg);
import { subCategoriesAPI } from "@/api/M04/subCategoriesAPI.js";
import tmib_scatg from "@/models/M04/tmib_scatg.json";
const dataModelItem = generateDataModel(tmib_scatg);
import { attrbAPI } from "@/api/M04/attrbAPI.js";
import tmib_attrb from "@/models/M04/tmib_attrb.json";
const dataModelAttrb = generateDataModel(tmib_attrb);
import { costingAPI } from "@/api/M04/costingAPI.js";
import tmib_pcost from "@/models/M04/tmib_pcost.json";
const dataModelCosting = generateDataModel(tmib_pcost);
import { validNumber } from "@/utils/misc.js";

const useCategories = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M02-M003");
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
  const [listDataAttrb, setListDataAttrb] = useState([]);
  const [formDataAttrb, setFormDataAttrb] = useState(dataModelAttrb);

  const [listDataCosting, setListDataCosting] = useState([]);
  const [formDataCosting, setFormDataCosting] = useState(dataModelCosting);

  const getAllCategories = async () => {
    try {
      setIsBusy(true);
      const resp = await categoriesAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_mcatg);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.mcatg_actve;
    const dataName = rowData.mcatg_cname;
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
      const resp = await categoriesAPI.delete(rowData);
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
        getAllCategories();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllCategories();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_mcatg);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await categoriesAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllCategories();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //sub category
  const [thisCategory, setThisCategory] = useState("");

  const getAllSubCategories = async (id) => {
    try {
      setIsBusy(true);
      const resp = await subCategoriesAPI.getAll({ scatg_mcatg: id });
      const list = resp.data || [];
      //console.log(resp);
      setListDataItem(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubCategory = async (rowData) => {
    setThisCategory(rowData);
    setPgView("SYS_VW_LST_2");
    getAllSubCategories(rowData.id);
  };

  const handleChangeSubCat = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_scatg);
    setFormErrors(newErrors);
  };

  const handleEditSubCat = (rowData) => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem(rowData);
  };

  const handleDeleteSubCat = async (rowData) => {
    const isActive = rowData.scatg_actve;
    const dataName = rowData.scatg_cname;
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
      const resp = await subCategoriesAPI.delete(rowData);
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
        getAllSubCategories(thisCategory.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddNewSubCat = () => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem({ ...dataModelItem, scatg_mcatg: thisCategory.id });
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancelSubCat = () => {
    setPgView("SYS_VW_LST_2");
    setFormDataItem(dataModelItem);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmitSubCat = async () => {
    try {
      const newErrors = validate(formDataItem, tmib_scatg);
      setFormErrors(newErrors);

      //console.log("handleSubmitSubCat", newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const reqBody = {
        ...formDataItem,
      };
      setIsBusy(true);

      const resp = await subCategoriesAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formDataItem.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_2");
        setFormDataItem(dataModelItem);
        getAllSubCategories(thisCategory.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //attributes
  const getAllAttributes = async (id) => {
    try {
      setIsBusy(true);
      const resp = await attrbAPI.getAll({ attrb_mcatg: id });
      const list = resp.data || [];
      setListDataAttrb(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAttributes = async (rowData) => {
    setThisCategory(rowData);
    setPgView("SYS_VW_LST_3");
    getAllAttributes(rowData.id);
  };

  const handleChangeAttrb = (f, v) => {
    setFormDataAttrb((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataAttrb, [f]: v }, tmib_attrb);
    setFormErrors(newErrors);
  };

  const handleEditAttrb = (rowData) => {
    setPgView("SYS_VW_FRM_3");
    setFormDataAttrb(rowData);
  };

  const handleDeleteAttrb = async (rowData) => {
    const isActive = rowData.attrb_actve;
    const dataName = rowData.attrb_cname;
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
      const resp = await attrbAPI.delete(rowData);
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
        setPgView("SYS_VW_LST_3");
        setFormDataAttrb(dataModelAttrb);
        getAllAttributes(thisCategory.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddNewAttrb = () => {
    setPgView("SYS_VW_FRM_3");
    setFormDataAttrb({ ...dataModelAttrb, attrb_mcatg: thisCategory.id });
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancelAttrb = () => {
    setPgView("SYS_VW_LST_3");
    setFormDataAttrb(dataModelAttrb);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmitAttrb = async () => {
    try {
      const newErrors = validate(formDataAttrb, tmib_attrb);
      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formDataAttrb,
      };
      setIsBusy(true);

      const resp = await attrbAPI.upsert(reqBody);
      alertBox({
        title: resp.success
          ? formDataAttrb.id
            ? "Updated"
            : "Saved"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_3");
        setFormDataAttrb(dataModelAttrb);
        getAllAttributes(thisCategory.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //costing
  const getAllCostings = async (id) => {
    try {
      setIsBusy(true);
      const resp = await costingAPI.getAll({ pcost_mcatg: id });
      const list = resp.data || [];
      setListDataCosting(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleCosting = async (rowData) => {
    setThisCategory(rowData);
    setPgView("SYS_VW_LST_4");
    getAllCostings(rowData.id);
  };

  const handleChangeCosting = (f, v) => {
    setFormDataCosting((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataCosting, [f]: v }, tmib_pcost);
    setFormErrors(newErrors);
  };

  const handleEditCosting = (rowData) => {
    setPgView("SYS_VW_FRM_4");
    setFormDataCosting(rowData);
  };

  const handleDeleteCosting = async (rowData) => {
    const isActive = rowData.pcost_actve;
    const dataName = rowData.pcost_party;
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
      const resp = await costingAPI.delete(rowData);
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
        setPgView("SYS_VW_LST_4");
        setFormDataCosting(dataModelCosting);
        getAllCostings(thisCategory.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddNewCosting = () => {
    setPgView("SYS_VW_FRM_4");
    setFormDataCosting({ ...dataModelCosting, pcost_mcatg: thisCategory.id });
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancelCosting = () => {
    setPgView("SYS_VW_LST_4");
    setFormDataCosting(dataModelCosting);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmitCosting = async () => {
    try {
      const newErrors = validate(formDataCosting, tmib_pcost);
      setFormErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const amount = validNumber(formDataCosting.pcost_csamt);
      const ratio = validNumber(formDataCosting.pcost_csrto);
      if (
        (amount < 0.1 && ratio < 0.1) || // both empty/invalid
        (amount >= 0.1 && ratio >= 0.1) // both entered
      ) {
        showToast(
          amount >= 0.1 && ratio >= 0.1
            ? "Enter either Amount or Ratio, not both"
            : "Amount or Ratio is required",
          { type: "warning" },
        );
        return;
      }

      const reqBody = {
        ...formDataCosting,
      };
      setIsBusy(true);

      const resp = await costingAPI.upsert(reqBody);
      alertBox({
        title: resp.success
          ? formDataCosting.id
            ? "Updated"
            : "Saved"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_4");
        setFormDataCosting(dataModelCosting);
        getAllCostings(thisCategory.id);
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
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //sub category
    handleSubCategory,
    handleChangeSubCat,
    handleEditSubCat,
    handleDeleteSubCat,
    handleAddNewSubCat,
    handleCancelSubCat,
    handleSubmitSubCat,
    //attributes
    listDataAttrb,
    formDataAttrb,
    handleAttributes,
    handleChangeAttrb,
    handleEditAttrb,
    handleDeleteAttrb,
    handleAddNewAttrb,
    handleCancelAttrb,
    handleSubmitAttrb,
    //costing
    listDataCosting,
    formDataCosting,
    handleCosting,
    handleChangeCosting,
    handleEditCosting,
    handleDeleteCosting,
    handleAddNewCosting,
    handleCancelCosting,
    handleSubmitCosting,
  };
};
export default useCategories;
