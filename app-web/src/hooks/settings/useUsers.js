import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmnb_users from "@/models/settings/tmnb_users.json";
const dataModel = generateDataModel(tmnb_users);
import { businessAPI } from "@/api/settings/businessAPI.js";
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
  const [users_urole_Options, setUsers_urole_Options] = useState([
    {
      label_text: "Admin",
      value_text: "admin",
    },
    {
      label_text: "User",
      value_text: "user",
    },
  ]);
  const [users_bsins_Options, setUsers_bsins_Options] = useState([]);

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
    const newErrors = validate({ ...formData, [field]: value }, tmnb_users);
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
    handleGetBusiness();
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.users_actve ? "Deactivate" : "Activate"} this ${rowData.users_uname}?`,
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
      const resp = await usersAPI.delete(rowData);
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
    handleGetBusiness();
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmnb_users);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await usersAPI.upsert(formData);
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

  //other functions
  const handleGetBusiness = async () => {
    if (users_bsins_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await businessAPI.getAllActive();
      //console.log("resp", resp);
      setUsers_bsins_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleMenuPermission = async (rowData) => {
    //console.log("rowData", rowData);
    try {
      setIsBusy(true);
      const resp = await usersAPI.getMenus({ users_id: rowData.id });
      //console.log("getMenus", resp);
      setDataListMenus(resp.data || []);
      showToastError(resp);

      setFormData(rowData);
      setCrTitle("User Menu List");
      setCrView("menus");
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddEditMenu = async (rowData, field, value) => {
    setDataListMenus((prev) =>
      prev.map((m) => (m.menus_id === rowData.menus_id ? { ...m, [field]: value } : m)),
    );

    //console.log("handleAddEditMenu", rowData);
    //console.log("field:", field, "value:", value);

    try {
      setIsBusy(true);

      const reqBody = {
        ...rowData,
        [field]: value,
        users_id: formData.id,
      };

      const resp = await usersAPI.upsertMenus(reqBody);
      //console.log("resp", resp);
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
    dataListMenus,
    users_urole_Options,
    users_bsins_Options,
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
    handleAddEditMenu,
  };
};
export default useUsers;
