import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_sgrup from "@/models/inventory/tmib_sgrup.json";
const dataModel = generateDataModel(tmib_sgrup);
import { subGroupAPI } from "@/api/inventory/subGroupAPI.js";
import { groupAPI } from "@/api/inventory/groupAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useSubGroup = () => {
  //hooks :: menuId M06-M01-M007,
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
  const [crTitle, setCrTitle] = useState("Sub Group List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [sgrup_mgrup_Options, setSgrup_mgrup_Options] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M06-M01-M007");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadSubGroup = async () => {
    try {
      setIsBusy(true);
      const resp = await subGroupAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmib_sgrup);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Sub Group");
    setCrView("form");
    handleGetGroup();
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.sgrup_actve ? "Deactivate" : "Activate"} this ${rowData.sgrup_sname}?`,
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
      const resp = await subGroupAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Sub Group List");
        setCrView("list");
        loadSubGroup();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Sub Group List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Sub Group");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Sub Group List");
    setCrView("list");
    loadSubGroup();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Sub Group");
    setCrView("form");
    setFormData(dataModel);
    handleGetGroup();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmib_sgrup);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await subGroupAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Sub Group List");
        setCrView("list");
        loadSubGroup();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetGroup = async () => {
    if (sgrup_mgrup_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await groupAPI.getAllActive();
      //console.log("resp", resp);
      setSgrup_mgrup_Options(resp.data);
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
    sgrup_mgrup_Options,
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
export default useSubGroup;
