import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmrb_dzone from "@/models/crm/tmrb_dzone.json";
const dataModel = generateDataModel(tmrb_dzone);
import { dzoneAPI } from "@/api/crm/dzoneAPI.js";
import { shortdataAPI } from "@/api/settings/shortdataAPI.js";
import { usersAPI } from "@/api/settings/usersAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useUsers = () => {
  //hooks :: menuId M02-M01,
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
  const [crTitle, setCrTitle] = useState("Users List");
  const [crView, setCrView] = useState("list");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //other states
  const [dataListMenus, setDataListMenus] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M02-M01");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadUsers = async () => {
    try {
      setIsBusy(true);
      const resp = await usersAPI.getAll({});
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
    const newErrors = validate({ ...formData, [field]: value }, tmrb_dzone);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Users");
    setCrView("form");
    handleGetCountry();
  };
  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.dzone_actve ? "Deactivate" : "Activate"} this ${rowData.dzone_dname}?`,
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
      const resp = await dzoneAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Users List");
        setCrView("list");
        loadUsers();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Users List");
    setCrView("list");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Users");
    setCrView("list");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Users List");
    setCrView("list");
    loadUsers();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Users");
    setCrView("form");
    setFormData(dataModel);
    handleGetCountry();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmrb_dzone);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await dzoneAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Users List");
        setCrView("list");
        loadUsers();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCountry = async () => {
    if (dzone_cntry_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await shortdataAPI.getCountry();
      //console.log("resp", resp);
      setDzone_cntry_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  const handleMenuPermission = async (rowData) => {
    console.log("rowData", rowData);

    try {
      setIsBusy(true);
      const resp = await usersAPI.getMenus({ users_id: rowData.id });
      //console.log("getMenus", resp);
      setDataListMenus(resp.data || []);
      showToastError(resp);

      setCrTitle("User Menu List");
      setCrView("menus");
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
    dataListMenus,
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
    handleMenuPermission,
  };
};
export default useUsers;
