import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { journalAPI } from "@/api/M08/journalAPI.js";
import { coaAPI } from "@/api/M08/coaAPI.js";
import { partyAPI } from "@/api/M08/partyAPI.js";
import { acprdAPI } from "@/api/M08/acprdAPI.js";
import { fsyarAPI } from "@/api/M08/fsyarAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_jrnlm from "@/models/M08/tmtb_jrnlm.json";
const dataModel = generateDataModel(tmtb_jrnlm);
import tmtb_jrnlc from "@/models/M08/tmtb_jrnlc.json";
const dataModelItem = generateDataModel(tmtb_jrnlc);

const useJournal = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M08-M001");
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
  const [formDataItem, setFormDataItem] = useState(dataModelItem);
  const [formErrors, setFormErrors] = useState({});
  //others
  const [dpart_Options, setDpart_Options] = useState([]);
  const [fsyar_Options, setFsyar_Options] = useState([]);
  const [acprd_Options, setAcprd_Options] = useState([]);
  const [showModal, setShowModal] = useState({ show: false, modal: "" });
  const [modalTitle, setModalTitle] = useState({ title: "", subTitle: "" });

  const getAllJournals = async () => {
    try {
      setIsBusy(true);
      const resp = await journalAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllJournals();
  }, []);

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) return;
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllFiscalYears = async (id) => {
    try {
      const resp = await fsyarAPI.getCurrentByDepartment({ fsyar_dpart: id });
      const list = resp.data || [];
      setFsyar_Options(list);
    } catch (error) {}
  };

  const getAllAcPeriods = async (id) => {
    try {
      const resp = await acprdAPI.getCurrentByFy({ acprd_fsyar: id });
      const list = resp.data || [];
      setAcprd_Options(list);
    } catch (error) {}
  };

  // Dropdown options
  const [chtac_Options, setChtac_Options] = useState([]);
  const [party_Options, setParty_Options] = useState([]);

  const getAllCoa = async () => {
    if (chtac_Options.length > 0) return;
    try {
      const resp = await coaAPI.getAllActive({});
      const list = resp.data || [];
      setChtac_Options(list);
    } catch (error) {}
  };

  const getAllParties = async () => {
    if (party_Options.length > 0) return;
    try {
      const resp = await partyAPI.getAllActive({});
      const list = resp.data || [];
      setParty_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmtb_jrnlm);
    setFormErrors(newErrors);
    if (f === "jrnlm_dpart") {
      getAllFiscalYears(v);
    }
    setFormErrors(newErrors);
    if (f === "jrnlm_fsyar") {
      getAllAcPeriods(v);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadJournalDetails(rowData.id);
    getAllDepartments();
  };

  const loadJournalDetails = async (id) => {
    try {
      setIsBusy(true);
      const resp = await journalAPI.getDetail({ jrnlc_mjrnl: id });
      setListDataItems(resp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.jrnlm_actve;
    const dataName = rowData.jrnlm_narrt;
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
      const resp = await journalAPI.delete(rowData);
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
        getAllJournals();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllJournals();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    //pass BDT from localstorage
    setFormData({ ...dataModel, jrnlm_crncy: "BDT" });
    setReadOnly(false);
    setStopEdit(false);
    getAllDepartments();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmtb_jrnlm);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      if (listDataItems.length === 0) {
        showToast("At least 1 journal line is required", { type: "warning" });
        return;
      }

      // Validate that total debit equals total credit
      const totalDr = listDataItems.reduce(
        (sum, item) => sum + (Number(item.jrnlc_drval) || 0),
        0,
      );
      const totalCr = listDataItems.reduce(
        (sum, item) => sum + (Number(item.jrnlc_crval) || 0),
        0,
      );
      if (Math.abs(totalDr - totalCr) > 0.001) {
        showToast("Total Debit must equal Total Credit", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmtb_jrnlc: listDataItems,
      };

      setIsBusy(true);
      const resp = await journalAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllJournals();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Journal Items (lines) ----------

  const handleChangeItem = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmtb_jrnlc);
    setFormErrorsItem(newErrors);
  };

  const handleAddToList = () => {
    const newErrors = validate(formDataItem, tmtb_jrnlc);
    setFormErrorsItem(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Must have either debit or credit
    const drVal = Number(formDataItem.jrnlc_drval) || 0;
    const crVal = Number(formDataItem.jrnlc_crval) || 0;
    if (drVal === 0 && crVal === 0) {
      showToast("Either Debit or Credit amount is required", {
        type: "warning",
      });
      return;
    }
    if (drVal > 0 && crVal > 0) {
      showToast("A line cannot have both Debit and Credit amounts", {
        type: "warning",
      });
      return;
    }

    const chtac_cname = chtac_Options.find(
      (opt) => opt.id === formDataItem.jrnlc_chtac,
    );
    const party_cname = party_Options.find(
      (opt) => opt.id === formDataItem.jrnlc_party,
    );

    setListDataItems((prev) => [
      ...prev,
      {
        ...formDataItem,
        chtac_cname: chtac_cname?.chtac_cname || "Invalid Account",
        party_cname: party_cname?.party_cname || "",
        jrnlc_actve: true,
      },
    ]);
    setFormDataItem(dataModelItem);
    handleHideModal();
  };

  const handleEditItem = (rowData) => {
    setFormDataItem(rowData);
    setShowModal(true);
  };

  const handleDeleteItem = async (rowData) => {
    const dataName = rowData.chtac_cname || "Item";
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataItems((prev) =>
      prev.filter((item) => item.jrnlc_chtac !== rowData.jrnlc_chtac),
    );
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    setShowModal({ show: true, modal: modal });
    setModalTitle({
      title: "Add Journal Line",
      subTitle: "Journal Entry",
    });
  };
  const handleHideModal = () => {
    setShowModal({ show: false, modal: "" });
    setModalTitle({ title: "", subTitle: "" });
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
    //others
    dpart_Options,
    fsyar_Options,
    acprd_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //journal lines
    handleChangeItem,
    handleAddToList,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useJournal;
