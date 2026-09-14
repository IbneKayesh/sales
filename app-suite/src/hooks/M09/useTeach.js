import { useEffect, useState, useMemo } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_teach from "@/models/M09/tmtb_teach.json";
const dataModel = generateDataModel(tmtb_teach);
import { teachAPI } from "@/api/M09/teachAPI.js";

/** A lesson is a root when its parent is empty or points at itself. */
const isRootNode = (item) => !item.teach_teach || item.teach_teach === item.id;

/** Build a tree from a flat list. Nodes with empty/self-referencing teach_teach are roots. */
function buildTree(list) {
  const map = {};
  const roots = [];
  for (const item of list) {
    map[item.id] = { ...item, children: [] };
  }
  for (const item of list) {
    const node = map[item.id];
    const parentId = item.teach_teach;
    if (!isRootNode(item) && map[parentId]) {
      map[parentId].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

const useTeach = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M09-M01-M001");
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
  const [formErrors, setFormErrors] = useState({});
  // Tree for the list; listData stays flat for the parent dropdown
  const treeData = useMemo(() => buildTree(listData), [listData]);

  const getAllTeach = async () => {
    try {
      setIsBusy(true);
      const resp = await teachAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllTeach();
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmtb_teach);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.teach_actve;
    const dataName = rowData.teach_cname || rowData.teach_srial;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await teachAPI.delete(rowData);
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
        getAllTeach();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllTeach();
  };

  /** Serial of a new lesson = highest numeric serial among its siblings + 1. */
  const getNextSiblingSerial = (parentId) => {
    const serials = listData
      .filter((item) =>
        parentId ? item.teach_teach === parentId : isRootNode(item),
      )
      .map((item) => Number(item.teach_srial))
      .filter((num) => !Number.isNaN(num));
    const next = serials.length ? Math.max(...serials) + 1 : 1;
    return String(next);
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      teach_srial: getNextSiblingSerial(""),
      teach_reads: 1,
      teach_marks: 1,
      teach_actve: true,
    });
    setFormErrors({});
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleAddChild = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      teach_teach: rowData.id,
      teach_srial: getNextSiblingSerial(rowData.id),
      teach_reads: 1,
      teach_marks: 1,
      teach_actve: true,
    });
    setFormErrors({});
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setFormErrors({});
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmtb_teach);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        showToast("Please fill in all required fields", "warning");
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await teachAPI.upsert(reqBody);
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
        getAllTeach();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  /** All descendants of a lesson — excludes them from the parent list to prevent cycles. */
  const getDescendantIds = (id) => {
    const ids = new Set();
    const walk = (parentId) => {
      for (const item of listData) {
        if (item.teach_teach === parentId && !ids.has(item.id)) {
          ids.add(item.id);
          walk(item.id);
        }
      }
    };
    walk(id);
    return ids;
  };

  // A lesson can't be its own parent, nor sit under one of its descendants
  const excludedIds = formData?.id ? getDescendantIds(formData.id) : new Set();

  const parentOptions = listData
    .filter((item) => item.id !== formData?.id && !excludedIds.has(item.id))
    .map((item) => ({
      value: item.id,
      label: `${item.teach_srial ? `${item.teach_srial} ~ ` : ""}${item.teach_cname}`,
    }));

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    treeData,
    formData,
    formErrors,
    parentOptions,
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

export default useTeach;
