import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_teach from "@/models/M09/tmtb_teach.json";
const dataModel = generateDataModel(tmtb_teach);
import { teachAPI } from "@/api/M09/teachAPI.js";

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

  const handleAddNew = () => {
    const nextSerial = String(listData.length + 1).padStart(2, "0");
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      teach_srial: nextSerial,
      teach_reads: 1,
      teach_marks: 1,
      teach_stats: true,
      teach_actve: true,
      teach_ttype: "English",
      teach_tagno: "Kindergarten",
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
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
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

  const parentOptions = listData
    .filter((item) => !formData?.id || item.id !== formData.id)
    .map((item) => ({
      value: item.id,
      label: `[${item.teach_ttype || "General"}] ${item.teach_cname}`,
    }));

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    formErrors,
    parentOptions,
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
  };
};

export default useTeach;
