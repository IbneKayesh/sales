import { useEffect, useState, useMemo } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { featuresAPI } from "@/api/M01/featuresAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import { splitList } from "@/utils/misc";
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
  //filters
  const [filterData, setFilterData] = useState({
    fetur_ttype: "",
    fetur_tagno: "",
  });
  // The list is narrowed by the filters; listData itself stays complete so the
  // parent dropdown in the form still offers every feature.
  // Type is an exact match, tags match any of the selected ones.
  const filteredList = useMemo(() => {
    const tagFilter = splitList(filterData.fetur_tagno);
    if (!filterData.fetur_ttype && tagFilter.length === 0) return listData;
    return listData.filter((item) => {
      if (filterData.fetur_ttype && item.fetur_ttype !== filterData.fetur_ttype) {
        return false;
      }
      if (tagFilter.length > 0) {
        const itemTags = splitList(item.fetur_tagno);
        if (!tagFilter.some((tag) => itemTags.includes(tag))) return false;
      }
      return true;
    });
  }, [listData, filterData]);
  // Flat data for dropdowns, tree data for the list
  const treeData = useMemo(() => buildTree(filteredList), [filteredList]);
  const filteredCount = filteredList.length;
  const isFiltered =
    Boolean(filterData.fetur_ttype) || splitList(filterData.fetur_tagno).length > 0;
  //const fetur_Options = listData;
  const fetur_Options = [
    {
      fetur_cname: "Root",
      id: "root",
    },
    ...listData,
  ];

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

  //filters
  const handleFilterChange = (f, v) => {
    setFilterData((prev) => ({ ...prev, [f]: v }));
  };

  const handleAddNew = async () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  /** Serial of a new child = highest numeric serial among its siblings + 1. */
  const getNextSiblingSerial = (parentId) => {
    const serials = listData
      .filter((item) => item.fetur_fetur === parentId)
      .map((item) => Number(item.fetur_srial))
      .filter((num) => !Number.isNaN(num));
    const next = serials.length ? Math.max(...serials) + 1 : 1;
    return String(next);
  };

  const handleAddChild = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      fetur_fetur: rowData.id,
      fetur_srial: getNextSiblingSerial(rowData.id),
    });
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
      // alertBox({
      //   title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
      //   message: resp.message,
      //   variant: resp.success ? "success" : "danger",
      //   confirmText: resp.success ? "Done" : "Close",
      // });
      showToast(resp.message, {
        type: resp.success ? "success" : "error",
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

  const handleStatus = async (rowData) => {
    try {
      setIsBusy(true);
      const resp = await featuresAPI.updateStatus(rowData);
      showToast(resp.message, {
        type: resp.success ? "success" : "error",
      });
      getAllFeature();
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
    //filters
    filterData,
    filteredCount,
    isFiltered,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleAddChild,
    handleCancel,
    handleSubmit,
    handleStatus,
    handleFilterChange,
  };
};
export default useFeatures;
