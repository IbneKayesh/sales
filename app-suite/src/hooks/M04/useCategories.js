import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { categoriesAPI } from "@/api/M04/categoriesAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmib_mcatg from "@/models/M04/tmib_mcatg.json";
const dataModel = generateDataModel(tmib_mcatg);
import { subCategoriesAPI } from "@/api/M04/subCategoriesAPI.js";
import tmib_scatg from "@/models/M04/tmib_scatg.json";
const dataModelItem = generateDataModel(tmib_scatg);

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
    const newErrors = validate({ ...formData, [f]: v }, tmib_brand);
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

  const getSubAllCategories = async (id) => {
    try {
      setIsBusy(true);
      const resp = await subCategoriesAPI.getAll({ scatg_mcatg: id });
      const list = resp.data || [];
      setListDataItem(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubCategory = async (rowData) => {
    setThisCategory(rowData);
    setPgView("SYS_VW_LST_2");
    getSubAllCategories(rowData.id);
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

  const handleAddNewSubCat = () => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem(dataModelItem);
    setReadOnly(false);
    setStopEdit(false);
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
    handleAddNewSubCat,
  };
};
export default useCategories;
