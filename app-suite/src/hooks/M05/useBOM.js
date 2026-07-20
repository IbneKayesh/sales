import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { categoriesAPI } from "@/api/M04/categoriesAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmmb_bommf from "@/models/M05/tmmb_bommf.json";
const dataModel = generateDataModel(tmmb_bommf);
import { subCategoriesAPI } from "@/api/M04/subCategoriesAPI.js";
import tmib_scatg from "@/models/M04/tmib_scatg.json";
const dataModelItem = generateDataModel(tmib_scatg);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { unitsAPI } from "@/api/M04/unitsAPI.js";

const useBOM = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M05-M01-M002");
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
  //other
  const [dpart_Options, setDpart_Options] = useState([]);
  const [units_Options, setUnits_Options] = useState([]);

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

  const getAllDepartments = async () => {
    try {
      setIsBusy(true);
      const resp = await departmentAPI.getAllActive({});
      //console.log("getAllDepartments", resp);
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAllUnits = async () => {
    try {
      setIsBusy(true);
      const resp = await unitsAPI.getAllActive({});
      //console.log("getAllUnits", resp);
      const list = resp.data || [];
      setUnits_Options(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmmb_bommf);
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
    getAllDepartments();
    getAllUnits();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmmb_bommf);
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
    //other
    dpart_Options,
    units_Options,
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
  };
};
export default useBOM;
