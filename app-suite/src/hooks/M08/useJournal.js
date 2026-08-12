import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { journalAPI } from "@/api/M08/journalAPI.js";
import { partyAPI } from "@/api/M08/partyAPI.js";
import { acprdAPI } from "@/api/M08/acprdAPI.js";
import { fsyarAPI } from "@/api/M08/fsyarAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_jrnlm from "@/models/M08/tmtb_jrnlm.json";
const dataModel = generateDataModel(tmtb_jrnlm);
import tmtb_jrnlc from "@/models/M08/tmtb_jrnlc.json";
const dataModelItem = generateDataModel(tmtb_jrnlc);
import { coaAPI } from "@/api/M08/coaAPI.js";
import { buildPaths } from "@/utils/pathBuilder.js";
import { generateGuid } from "@/utils/guid.js";
import { printReport } from "@/utils/export.js";
import { validNumber } from "@/utils/misc.js";

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

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmtb_jrnlm);
    setFormErrors(newErrors);
    if (f === "jrnlm_dpart") {
      getAllFiscalYears(v);
    }
    if (f === "jrnlm_fsyar") {
      getAllAcPeriods(v);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    setFsyar_Options([
      { id: rowData.jrnlm_fsyar, fsyar_cname: rowData.fsyar_cname },
    ]);
    setAcprd_Options([
      { id: rowData.jrnlm_acprd, acprd_cname: rowData.acprd_cname },
    ]);
    loadJournalDetails(rowData.id);
    getAllDepartments();
  };

  const loadJournalDetails = async (id) => {
    try {
      setListDataItem([]);
      setIsBusy(true);
      const resp = await journalAPI.getChild({ jrnlc_jrnlm: id });
      setListDataItem(resp.data || []);
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
    setFormData({ ...dataModel, jrnlm_crncy: "BDT", jrnlm_stats: "Posted" });
    setReadOnly(false);
    setStopEdit(false);
    getAllDepartments();
    //lines
    getCoaChildOnly();
    setListDataItem([]);
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
      if (listDataItem.length === 0) {
        showToast("At least 1 journal line is required", { type: "warning" });
        return;
      }

      // Validate that total debit equals total credit
      const totalDr = listDataItem.reduce(
        (sum, item) => sum + (Number(item.jrnlc_drval) || 0),
        0,
      );
      const totalCr = listDataItem.reduce(
        (sum, item) => sum + (Number(item.jrnlc_crval) || 0),
        0,
      );
      if (Math.abs(totalDr - totalCr) > 0.001) {
        showToast("Total Debit must equal Total Credit", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmtb_jrnlc: listDataItem,
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
  function reCalculate(items, master) {
    //console.log("items", items);
    // Clone
    let newItems = [...(items || [])];
    //---------------------------------------------------
    // Totals
    //---------------------------------------------------
    const totalDr = newItems.reduce(
      (sum, item) => sum + validNumber(item.jrnlc_drval),
      0,
    );

    const totalCr = newItems.reduce(
      (sum, item) => sum + validNumber(item.jrnlc_crval),
      0,
    );

    setListDataItem(newItems);

    //---------------------------------------------------
    // Master
    //---------------------------------------------------

    setFormData({
      ...master,
      jrnlm_drval: totalDr,
      jrnlm_crval: totalCr,
    });
  }

  const [chtac_Options, setChtac_Options] = useState([]);
  const [party_Options, setParty_Options] = useState([]);

  const getCoaChildOnly = async () => {
    if (chtac_Options.length > 0) return;
    try {
      const resp = await coaAPI.getJournalCoa({});
      const list = resp.data || [];
      //filter posted only
      const listActive = list.map((item) => ({
        id: item.id,
        name: item.chtac_cname,
        parent_id: item.chtac_chtac,
        active: item.chtac_ispst,
      }));
      //build path for all
      const buildPathsList = buildPaths(listActive);
      //console.log("buildPathsList", list);
      //apply filter and set state
      setChtac_Options(buildPathsList.filter((item) => item.active));
    } catch (error) {}
  };

  const getPartyByCoa = async (id) => {
    try {
      const resp = await partyAPI.getByCoa({ party_chtac: id });
      const list = resp.data || [];
      const listActive = list.map((item) => ({
        id: item.id,
        name: item.party_ptype + " - " + item.party_cname,
      }));
      setParty_Options(listActive);
    } catch (error) {}
  };

  const handleChangeItem = async (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmtb_jrnlc);
    setFormErrors(newErrors);
    if (f === "jrnlc_chtac") {
      getPartyByCoa(v);
    }
  };

  const handleAddToList = (value) => {
    const newErrors = validate(formDataItem, tmtb_jrnlc);
    setFormErrors(newErrors);
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

    // console.log("chtac_cname",chtac_cname);
    // console.log("party_cname",party_cname);

    // setListDataItem((prev) => [
    //   ...prev,
    //   {
    //     ...formDataItem,
    //     id: generateGuid(),
    //     chtac_cname: chtac_cname?.name || "Invalid GL",
    //     party_cname: party_cname?.name || "Invalid SGL",
    //     jrnlc_actve: true,
    //   },
    // ]);
    // setFormDataItem(dataModelItem);

    // console.log("s")
    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      chtac_cname: chtac_cname?.name || "Invalid GL",
      party_cname: party_cname?.name || "Invalid SGL",
      jrnlc_actve: true,
    };
    const newItemList = [...listDataItem, newItem];
    reCalculate(newItemList, formData);

    if (value === "CLOSE") {
      handleHideModal();
    }
  };

  const handleEditItem = (rowData) => {
    setFormDataItem(rowData);
    handleShowModal("ITEMS");
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
    //setListDataItem((prev) => prev.filter((item) => item.id !== rowData.id));
    const newItemList = listDataItem.filter((item) => item.id !== rowData.id);
    reCalculate(newItemList, formData);
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    setShowModal({ show: true, modal: modal });
    if (modal === "ITEM") {
      setFormDataItem(dataModelItem);
      setModalTitle({
        title: "Add Journal Line",
        subTitle: "Journal Entry",
      });
    }
  };

  const handleHideModal = () => {
    setShowModal({ show: false, modal: "" });
    setModalTitle({ title: "", subTitle: "" });
  };

  const handleAutoJournal = async () => {
    try {
      const newErrors = !formData.jrnlm_dpart
        ? { jrnlm_dpart: "Department is required" }
        : {};

      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };

      setIsBusy(true);
      const resp = await journalAPI.createAutoJournal(reqBody);
      console.log("resp", resp);
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

  const handlePrintJournal = () => {
    if (!formData?.id) {
      showToast("Save the journal before printing", { type: "warning" });
      return;
    }
    const label =
      formData.jrnlm_trnno ||
      formData.jrnlm_refno ||
      formData.jrnlm_narrt ||
      "";
    printReport(`Journal Voucher${label ? ` - ${label}` : ""}`, "journal");
  };

  const handlePrintInvoice = () => {
    if (!formData?.id) {
      showToast("Save the invoice before printing", { type: "warning" });
      return;
    }
    const label =
      formData.jrnlm_trnno ||
      formData.jrnlm_refno ||
      formData.jrnlm_narrt ||
      "";
    printReport(
      `${formData.jrnlm_trtyp || "Invoice"}${label ? ` - ${label}` : ""}`,
      "invoice",
    );
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
    //lines
    chtac_Options,
    party_Options,
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
    handleEditItem,
    handleDeleteItem,
    handleAutoJournal,
    handlePrintJournal,
    handlePrintInvoice,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useJournal;
