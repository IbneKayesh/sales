import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { groupsAPI } from "@/api/M04/groupsAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmib_mgrup from "@/models/M04/tmib_mgrup.json";
const dataModel = generateDataModel(tmib_mgrup);
import { subGroupsAPI } from "@/api/M04/subGroupsAPI.js";
import tmib_sgrup from "@/models/M04/tmib_sgrup.json";
const dataModelItem = generateDataModel(tmib_sgrup);

const useGroups = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M02-M006");
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

  const getAllGroups = async () => {
    try {
      setIsBusy(true);
      const resp = await groupsAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllGroups();
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_mgrup);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.mgrup_actve;
    const dataName = rowData.mgrup_cname;
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
      const resp = await groupsAPI.delete(rowData);
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
        getAllGroups();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllGroups();
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
      const newErrors = validate(formData, tmib_mgrup);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await groupsAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllGroups();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //sub group
  const [thisGroup, setThisGroup] = useState("");

  const getAllSubGroups = async (id) => {
    try {
      setIsBusy(true);
      const resp = await subGroupsAPI.getAll({ sgrup_mgrup: id });
      const list = resp.data || [];
      //console.log(resp);
      setListDataItem(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubGroup = async (rowData) => {
    setThisGroup(rowData);
    setPgView("SYS_VW_LST_2");
    getAllSubGroups(rowData.id);
  };

  const handleChangeSubGroup = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_sgrup);
    setFormErrors(newErrors);
  };

  const handleEditSubGroup = (rowData) => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem(rowData);
  };

  const handleDeleteSubGroup = async (rowData) => {
    const isActive = rowData.sgrup_actve;
    const dataName = rowData.sgrup_cname;
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
      const resp = await subGroupsAPI.delete(rowData);
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
        getAllSubGroups(thisGroup.id);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddNewSubGroup = () => {
    setPgView("SYS_VW_FRM_2");
    setFormDataItem({ ...dataModelItem, sgrup_mgrup: thisGroup.id });
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancelSubGroup = () => {
    setPgView("SYS_VW_LST_2");
    setFormDataItem(dataModelItem);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmitSubGroup = async () => {
    try {
      const newErrors = validate(formDataItem, tmib_sgrup);
      setFormErrors(newErrors);

      //console.log("handleSubmitSubCat", newErrors);

      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const reqBody = {
        ...formDataItem,
      };
      setIsBusy(true);

      const resp = await subGroupsAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formDataItem.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_2");
        setFormDataItem(dataModelItem);
        getAllSubGroups(thisGroup.id);
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
    //sub group
    handleSubGroup,
    handleChangeSubGroup,
    handleEditSubGroup,
    handleDeleteSubGroup,
    handleAddNewSubGroup,
    handleCancelSubGroup,
    handleSubmitSubGroup,
  };
};
export default useGroups;
