import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { bomAPI } from "@/api/M05/bomAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmmb_bommf from "@/models/M05/tmmb_bommf.json";
const dataModel = generateDataModel(tmmb_bommf);
import { rawMaterialAPI } from "@/api/M05/rawMaterialAPI.js";
import tmmb_borpm from "@/models/M05/tmmb_borpm.json";
const dataModelRM = generateDataModel(tmmb_borpm);
import { bofohAPI } from "@/api/M05/bofohAPI.js";
import tmmb_bofoh from "@/models/M05/tmmb_bofoh.json";
const dataModelFOH = generateDataModel(tmmb_bofoh);
import { bosfgAPI } from "@/api/M05/bosfgAPI.js";
import tmmb_bosfg from "@/models/M05/tmmb_bosfg.json";
const dataModelSFG = generateDataModel(tmmb_bosfg);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { unitsAPI } from "@/api/M04/unitsAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";

const useBOM = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M05-M01-M002");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  //BOM master
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [formErrors, setFormErrors] = useState({});
  //sub-section tab
  const [activeTab, setActiveTab] = useState("raw-materials");
  const [showSubForm, setShowSubForm] = useState(false);
  //raw materials
  const [listDataRM, setListDataRM] = useState([]);
  const [formDataRM, setFormDataRM] = useState({});
  const [formErrorsRM, setFormErrorsRM] = useState({});
  //factory overhead
  const [listDataFOH, setListDataFOH] = useState([]);
  const [formDataFOH, setFormDataFOH] = useState({});
  const [formErrorsFOH, setFormErrorsFOH] = useState({});
  //output SFG
  const [listDataSFG, setListDataSFG] = useState([]);
  const [formDataSFG, setFormDataSFG] = useState({});
  const [formErrorsSFG, setFormErrorsSFG] = useState({});
  //other
  const [dpart_Options, setDpart_Options] = useState([]);
  const [units_Options, setUnits_Options] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  //current BOM id for sub-section queries
  const [currentBOMId, setCurrentBOMId] = useState("");

  // ---------- BOM Master ----------
  const getAllBOM = async () => {
    try {
      setIsBusy(true);
      const resp = await bomAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllBOM();
  }, []);

  const getAllDepartments = async () => {
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {
    }
  };

  const getAllUnits = async () => {
    try {
      const resp = await unitsAPI.getAllActive({});
      const list = resp.data || [];
      setUnits_Options(list);
    } catch (error) {
    }
  };

  const getAllItems = async () => {
    try {
      const resp = await itemsAPI.getAllActive({});
      const list = resp.data || [];
      setItemOptions(list);
    } catch (error) {
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmmb_bommf);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    setCurrentBOMId(rowData.id);
    setActiveTab("raw-materials");
    setShowSubForm(false);
    getAllDepartments();
    getAllUnits();
    getAllItems();
    loadAllSubSections(rowData.id);
  };

  const loadAllSubSections = async (bomId) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp] = await Promise.all([
        rawMaterialAPI.getAll({ borpm_bommf: bomId }),
        bofohAPI.getAll({ bofoh_bommf: bomId }),
        bosfgAPI.getAll({ bosfg_bommf: bomId }),
      ]);
      setListDataRM(rmResp.data || []);
      setListDataFOH(fohResp.data || []);
      setListDataSFG(sfgResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.bommf_actve;
    const dataName = rowData.bommf_cname;
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
      const resp = await bomAPI.delete(rowData);
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
        getAllBOM();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllBOM();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setCurrentBOMId("");
    setReadOnly(false);
    setStopEdit(false);
    setActiveTab("raw-materials");
    setShowSubForm(false);
    setListDataRM([]);
    setListDataFOH([]);
    setListDataSFG([]);
    getAllDepartments();
    getAllUnits();
    getAllItems();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmmb_bommf);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const reqBody = { ...formData };
      setIsBusy(true);
      const resp = await bomAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllBOM();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Tab Switching ----------
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowSubForm(false);
  };

  // ---------- Raw Materials ----------
  const handleAddRM = () => {
    setFormDataRM({ ...dataModelRM, borpm_bommf: currentBOMId });
    setFormErrorsRM({});
    setShowSubForm(true);
    getAllItems();
  };

  const handleEditRM = (rowData) => {
    setFormDataRM(rowData);
    setFormErrorsRM({});
    setShowSubForm(true);
    getAllItems();
  };

  const handleChangeRM = (f, v) => {
    setFormDataRM((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataRM, [f]: v }, tmmb_borpm);
    setFormErrorsRM(newErrors);
  };

  const handleCancelRM = () => {
    setShowSubForm(false);
    setFormDataRM({});
    setFormErrorsRM({});
  };

  const handleSubmitRM = async () => {
    try {
      const newErrors = validate(formDataRM, tmmb_borpm);
      setFormErrorsRM(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      setIsBusy(true);
      const resp = await rawMaterialAPI.upsert({ ...formDataRM });
      alertBox({
        title: resp.success ? (formDataRM.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setShowSubForm(false);
        setFormDataRM({});
        loadAllSubSections(currentBOMId);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteRM = async (rowData) => {
    const isActive = rowData.borpm_actve;
    const dataName = rowData.borpm_items;
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
      const resp = await rawMaterialAPI.delete(rowData);
      alertBox({
        title: resp.success ? (isActive ? "Deactivated" : "Activated") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) loadAllSubSections(currentBOMId);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Factory Overhead ----------
  const handleAddFOH = () => {
    setFormDataFOH({ ...dataModelFOH, bofoh_bommf: currentBOMId });
    setFormErrorsFOH({});
    setShowSubForm(true);
    getAllItems();
  };

  const handleEditFOH = (rowData) => {
    setFormDataFOH(rowData);
    setFormErrorsFOH({});
    setShowSubForm(true);
    getAllItems();
  };

  const handleChangeFOH = (f, v) => {
    setFormDataFOH((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataFOH, [f]: v }, tmmb_bofoh);
    setFormErrorsFOH(newErrors);
  };

  const handleCancelFOH = () => {
    setShowSubForm(false);
    setFormDataFOH({});
    setFormErrorsFOH({});
  };

  const handleSubmitFOH = async () => {
    try {
      const newErrors = validate(formDataFOH, tmmb_bofoh);
      setFormErrorsFOH(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      setIsBusy(true);
      const resp = await bofohAPI.upsert({ ...formDataFOH });
      alertBox({
        title: resp.success ? (formDataFOH.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setShowSubForm(false);
        setFormDataFOH({});
        loadAllSubSections(currentBOMId);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteFOH = async (rowData) => {
    const isActive = rowData.bofoh_actve;
    const dataName = rowData.bofoh_items;
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
      const resp = await bofohAPI.delete(rowData);
      alertBox({
        title: resp.success ? (isActive ? "Deactivated" : "Activated") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) loadAllSubSections(currentBOMId);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Output SFG/FG ----------
  const handleAddSFG = () => {
    setFormDataSFG({ ...dataModelSFG, bosfg_bommf: currentBOMId });
    setFormErrorsSFG({});
    setShowSubForm(true);
    getAllItems();
  };

  const handleEditSFG = (rowData) => {
    setFormDataSFG(rowData);
    setFormErrorsSFG({});
    setShowSubForm(true);
    getAllItems();
  };

  const handleChangeSFG = (f, v) => {
    setFormDataSFG((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataSFG, [f]: v }, tmmb_bosfg);
    setFormErrorsSFG(newErrors);
  };

  const handleCancelSFG = () => {
    setShowSubForm(false);
    setFormDataSFG({});
    setFormErrorsSFG({});
  };

  const handleSubmitSFG = async () => {
    try {
      const newErrors = validate(formDataSFG, tmmb_bosfg);
      setFormErrorsSFG(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      setIsBusy(true);
      const resp = await bosfgAPI.upsert({ ...formDataSFG });
      alertBox({
        title: resp.success ? (formDataSFG.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setShowSubForm(false);
        setFormDataSFG({});
        loadAllSubSections(currentBOMId);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteSFG = async (rowData) => {
    const isActive = rowData.bosfg_actve;
    const dataName = rowData.bosfg_items;
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
      const resp = await bosfgAPI.delete(rowData);
      alertBox({
        title: resp.success ? (isActive ? "Deactivated" : "Activated") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) loadAllSubSections(currentBOMId);
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
    formErrors,
    activeTab,
    showSubForm,
    currentBOMId,
    //raw materials
    listDataRM,
    formDataRM,
    formErrorsRM,
    //factory overhead
    listDataFOH,
    formDataFOH,
    formErrorsFOH,
    //output SFG
    listDataSFG,
    formDataSFG,
    formErrorsSFG,
    //other
    dpart_Options,
    units_Options,
    itemOptions,
    //BOM master
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //tab
    handleTabChange,
    //raw materials
    handleAddRM,
    handleEditRM,
    handleChangeRM,
    handleCancelRM,
    handleSubmitRM,
    handleDeleteRM,
    //factory overhead
    handleAddFOH,
    handleEditFOH,
    handleChangeFOH,
    handleCancelFOH,
    handleSubmitFOH,
    handleDeleteFOH,
    //output SFG
    handleAddSFG,
    handleEditSFG,
    handleChangeSFG,
    handleCancelSFG,
    handleSubmitSFG,
    handleDeleteSFG,
  };
};
export default useBOM;
