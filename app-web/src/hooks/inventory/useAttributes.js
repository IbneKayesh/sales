import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_attrb from "@/models/inventory/tmib_attrb.json";
const dataModel = generateDataModel(tmib_attrb);
import { attributesAPI } from "@/api/inventory/attributesAPI.js";
import { categoryAPI } from "@/api/inventory/categoryAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useAttributes = () => {
  //hooks :: menuId M04-M01-M005,
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
  const [crTitle, setCrTitle] = useState("Attributes List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [attrb_mcatg_Options, setAttrb_mcatg_Options] = useState([]);

  //other states
  const attrb_dtype_Options = [
    { label: "Text", value: "Text" },
    { label: "Number", value: "Number" },
    { label: "Date", value: "Date" },
    { label: "Dropdown", value: "Dropdown" },
  ];

  useEffect(() => {
    const perms = getPageAuth("M04-M01-M005");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadAttributes = async () => {
    try {
      setIsBusy(true);
      const resp = await attributesAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmib_attrb);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Attributes");
    setCrView("form");
    handleGetCategory();
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.attrb_actve ? "Deactivate" : "Activate"} this ${rowData.attrb_aname}?`,
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
      const resp = await attributesAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Attributes List");
        setCrView("list");
        loadAttributes();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Attributes List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Attributes");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Attributes List");
    setCrView("list");
    loadAttributes();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Attributes");
    setCrView("form");
    setFormData(dataModel);
    handleGetCategory();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmib_attrb);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await attributesAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Attributes List");
        setCrView("list");
        loadAttributes();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCategory = async () => {
    if (attrb_mcatg_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await categoryAPI.getAllActive();
      //console.log("resp", resp);
      setAttrb_mcatg_Options(resp.data);
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
    attrb_mcatg_Options,
    attrb_dtype_Options,
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
export default useAttributes;
