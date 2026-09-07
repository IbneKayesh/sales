import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { usersAPI } from "@/api/M01/usersAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmhb_emply from "@/models/M01/tmhb_emply.json";
import tmsb_menup from "@/models/M01/tmsb_menup.json";
import { rawAppModules } from "@/utils/appModules.js";

const dataModel = generateDataModel(tmhb_emply);
const dataModelMenu = generateDataModel(tmsb_menup);

export const buildUserMenuPermissions = (rawModules, userMenus = []) => {
  const permMap = {};
  if (Array.isArray(userMenus)) {
    for (const p of userMenus) {
      if (p?.menup_menus) {
        permMap[p.menup_menus] = p;
      }
    }
  }

  const result = [];
  for (const mod of rawModules) {
    if (!mod.groups) continue;
    for (const g of mod.groups) {
      for (const m of g.menus) {
        const existing = permMap[m.id];
        result.push({
          menuId: m.id,
          menuName: m.name,
          moduleId: mod.id,
          moduleName: mod.name,
          moduleIcon: mod.icon,
          moduleColor: mod.color,
          groupId: g.id,
          groupName: g.name,
          link: m.link,
          desc: m.desc,
          assigned: !!existing,
          menup_extpr: existing ? !!existing.menup_extpr : false,
          menup_addpr: existing ? !!existing.menup_addpr : true,
          menup_edtpr: existing ? !!existing.menup_edtpr : true,
          menup_delpr: existing ? !!existing.menup_delpr : true,
          id: existing?.id,
        });
      }
    }
  }
  return result;
};

const useUsers = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M0005");
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

  const getAllUsers = async () => {
    try {
      setIsBusy(true);
      const resp = await usersAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleGetMenus = async (id) => {
    try {
      setIsBusy(true);
      const resp = await usersAPI.getMenusUser({ menup_emply: id });
      const list = resp.data || [];
      const initialized = buildUserMenuPermissions(rawAppModules, list);
      setListDataItem(initialized);
    } catch (error) {
      setListDataItem(buildUserMenuPermissions(rawAppModules, []));
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmhb_emply);
    setFormErrors(newErrors);
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    await handleGetMenus(rowData.id);
  };

  const handleUpdateMenus = (updatedList) => {
    setListDataItem(updatedList);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.emply_actve;
    const dataName = rowData.emply_cname;
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
      const resp = await usersAPI.delete(rowData);
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
        getAllUsers();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllUsers();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setListDataItem([]);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setListDataItem([]);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmhb_emply);
      //console.log("newErrors", newErrors);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const reqBody = { ...formData };
      setIsBusy(true);

      const resp = await usersAPI.update(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllUsers();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubmitMenu = async () => {
    if (!formData?.id) return;
    try {
      const grantedMenus = listDataItem
        .filter((item) => item.assigned)
        .map((item) => ({
          ...(item.id ? { id: item.id } : {}),
          menup_emply: formData.id,
          menup_menus: item.menuId,
          menup_extpr: !!item.menup_extpr,
          menup_addpr: !!item.menup_addpr,
          menup_edtpr: !!item.menup_edtpr,
          menup_delpr: !!item.menup_delpr,
        }));

      const reqBody = {
        menup_emply: formData.id,
        menup_menus: grantedMenus,
      };
      setIsBusy(true);

      const resp = await usersAPI.updateMenusUser(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        await handleGetMenus(formData.id);
      }
    } catch (error) {
      alertBox({
        title: "Error",
        message: error?.message || "Failed to update permissions.",
        variant: "danger",
      });
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
    handleSubmitMenu,
    handleUpdateMenus,
  };
};
export default useUsers;
