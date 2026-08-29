import { useEffect, useState, useMemo } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { featuresAPI } from "@/api/M01/featuresAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmsb_fetur from "@/models/M01/tmsb_fetur.json";
const dataModel = generateDataModel(tmsb_fetur);

/** Build a tree from a flat list. Nodes with empty/self-referencing fetur_fetur are roots. */
function buildTree(list) {
  const map = {};
  const roots = [];
  for (const item of list) {
    map[item.id] = { ...item, children: [] };
  }
  for (const item of list) {
    const node = map[item.id];
    const parentId = item.fetur_fetur;
    if (parentId && map[parentId] && parentId !== item.id) {
      map[parentId].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

const useFeatures = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M01-M0010");
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
  //others
  // Flat data for dropdowns, tree data for the list
  const treeData = useMemo(() => buildTree(listData), [listData]);
  const fetur_Options = listData;

  const getAllFeature = async () => {
    try {
      setIsBusy(true);
      const resp = await featuresAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllFeature();
  }, []);


  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmsb_fetur);
    setFormErrors(newErrors);
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.fetur_actve;
    const dataName = rowData.fetur_cname;
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
      const resp = await featuresAPI.delete(rowData);
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
        getAllFeature();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllFeature();
  };
  const handleAddNew = async () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleAddChild = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData({ ...dataModel, fetur_fetur: rowData.id });
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
      const newErrors = validate(formData, tmsb_fetur);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await featuresAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllFeature();
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
    treeData,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    fetur_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleAddChild,
    handleCancel,
    handleSubmit,
  };
};
export default useFeatures;
