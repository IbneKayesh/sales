import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_scatg from "@/models/inventory/tmib_scatg.json";
const dataModel = generateDataModel(tmib_scatg);
import { subCategoryAPI } from "@/api/inventory/subCategoryAPI.js";
import { categoryAPI } from "@/api/inventory/categoryAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useSubCategory = () => {
  //hooks :: menuId M06-M01-M004,
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
  const [crTitle, setCrTitle] = useState("Sub Category List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [scatg_mcatg_Options, setScatg_mcatg_Options] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M06-M01-M004");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadSubCategory = async () => {
    try {
      setIsBusy(true);
      const resp = await subCategoryAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmib_scatg);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Sub Category");
    setCrView("form");
    handleGetCategory();
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
      const resp = await subCategoryAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Sub Category List");
        setCrView("list");
        loadSubCategory();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Sub Category List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Sub Category");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Sub Category List");
    setCrView("list");
    loadSubCategory();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Sub Category");
    setCrView("form");
    setFormData(dataModel);
    handleGetCategory();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmib_scatg);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await subCategoryAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Sub Category List");
        setCrView("list");
        loadSubCategory();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCategory = async () => {
    if (scatg_mcatg_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await categoryAPI.getAllActive();
      //console.log("resp", resp);
      setScatg_mcatg_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
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
    scatg_mcatg_Options,
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
export default useSubCategory;
