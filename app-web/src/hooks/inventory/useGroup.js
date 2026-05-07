import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_mgrup from "@/models/inventory/tmib_mgrup.json";
const dataModel = generateDataModel(tmib_mgrup);
import { groupAPI } from "@/api/inventory/groupAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useGroup = () => {
  //hooks :: menuId M04-M01-M006,
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
  const [crTitle, setCrTitle] = useState("Group List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M04-M01-M006");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadGroup = async () => {
    try {
      setIsBusy(true);
      const resp = await groupAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmib_mgrup);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Group");
    setCrView("form");
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.mgrup_actve ? "Deactivate" : "Activate"} this ${rowData.mgrup_mname}?`,
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
      const resp = await groupAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Group List");
        setCrView("list");
        loadGroup();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Group List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Group");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Group List");
    setCrView("list");
    loadGroup();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Group");
    setCrView("form");
    setFormData(dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmib_mgrup);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await groupAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Group List");
        setCrView("list");
        loadGroup();
      }
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
export default useGroup;
