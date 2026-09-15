import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_exams from "@/models/M49/tmtb_exams.json";
const dataModel = generateDataModel(tmtb_exams);
import { examAPI } from "@/api/M49/examAPI.js";
import { teachAPI } from "@/api/M49/teachAPI.js";

const useExam = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M09-M02-M001");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [teachList, setTeachList] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [formErrors, setFormErrors] = useState({});

  const getAllExams = async () => {
    try {
      setIsBusy(true);
      const resp = await examAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getTeachList = async () => {
    try {
      const resp = await teachAPI.getAllActive({});
      const list = resp.data || [];
      setTeachList(list);
    } catch (error) {
      console.error("Error fetching teaching list:", error);
    }
  };

  useEffect(() => {
    getAllExams();
    getTeachList();
  }, []);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmtb_exams);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.exams_actve;
    const dataName = rowData.exams_cname || rowData.exams_srial;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await examAPI.delete(rowData);
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
        getAllExams();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllExams();
  };

  const handleAddNew = () => {
    const nextSerial = String(listData.length + 1).padStart(2, "0");
    const defaultTeach = teachList[0]?.id || "";
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      exams_srial: nextSerial,
      exams_teach: defaultTeach,
      exams_marks: 1,
      exams_stats: false,
      exams_actve: true,
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
      const newErrors = validate(formData, tmtb_exams);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        showToast("Please fill in all required fields", "warning");
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await examAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllExams();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const teachOptions = teachList.map((item) => ({
    value: item.id,
    label: `[${item.teach_ttype || "General"}] ${item.teach_cname}${item.teach_tagno ? ` (${item.teach_tagno})` : ""}`,
  }));

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    teachList,
    teachOptions,
    formData,
    formErrors,
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
  };
};

export default useExam;
