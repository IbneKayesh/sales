import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { processAPI } from "@/api/M05/processAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmmb_promf from "@/models/M05/M05M01/tmmb_promf.json";
const dataModel = generateDataModel(tmmb_promf);
import tmmb_prrpm from "@/models/M05/M05M01/tmmb_prrpm.json";
const dataModelRM = generateDataModel(tmmb_prrpm);
import tmmb_prfoh from "@/models/M05/M05M01/tmmb_prfoh.json";
const dataModelFOH = generateDataModel(tmmb_prfoh);
import tmmb_prsfg from "@/models/M05/M05M01/tmmb_prsfg.json";
const dataModelSFG = generateDataModel(tmmb_prsfg);
import tmmb_prbtc from "@/models/M05/M05M01/tmmb_prbtc.json";
const dataModelBatch = generateDataModel(tmmb_prbtc);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { bomAPI } from "@/api/M05/bomAPI.js";
import { unitsAPI } from "@/api/M04/unitsAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";

const useProcess = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M05-M02-M001");
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
  const [listDataRMPM, setListDataRMPM] = useState([]);
  const [formDataRMPM, setFormDataRMPM] = useState(dataModelRM);

  const [listDataFOH, setListDataFOH] = useState([]);
  const [formDataFOH, setFormDataFOH] = useState(dataModelFOH);

  const [listDataSFGFG, setListDataSFGFG] = useState([]);
  const [formDataSFGFG, setFormDataSFGFG] = useState(dataModelSFG);

  const [listDataBatch, setListDataBatch] = useState([]);
  const [formDataBatch, setFormDataBatch] = useState(dataModelBatch);

  const [dpart_Options, setDpart_Options] = useState([]);
  const [bom_Options, setBom_Options] = useState([]);
  const [units_Options, setUnits_Options] = useState([]);
  const [items_Options, setItems_Options] = useState([]);
  const [items_store_Options, setItems_store_Options] = useState([]);

  // ---------- Process Master ----------
  const getAllProcess = async () => {
    try {
      setIsBusy(true);
      const resp = await processAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllProcess();
  }, []);

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllBOMByDepartment = async (id) => {
    try {
      const resp = await bomAPI.getByDepartment({ bommf_dpart: id });
      const list = resp.data || [];
      setBom_Options(list);
    } catch (error) {}
  };

  const getAllUnits = async () => {
    if (units_Options.length > 0) {
      return;
    }
    try {
      const resp = await unitsAPI.getAllActive({});
      const list = resp.data || [];
      setUnits_Options(list);
    } catch (error) {}
  };

  const getAllItems = async () => {
    try {
      const resp = await itemsAPI.getAllActive();
      const list = resp.data || [];
      setItems_store_Options(list);
    } catch (error) {}
  };

  const loadAllDetailsBOM = async (id) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp] = await Promise.all([
        bomAPI.getRMPMbyBOMForProcess({ borpm_bommf: id }),
        bomAPI.getFOHbyBOMId({ bofoh_bommf: id }),
        bomAPI.getSFGFGbyBOMId({ bosfg_bommf: id }),
      ]);
      setListDataRMPM(rmResp.data || []);
      // setListDataFOH(fohResp.data || []);
      // setListDataSFGFG(sfgResp.data || []);

      console.log("rmResp", rmResp.data);
      console.log("fohResp", fohResp.data);
      console.log("sfgResp", sfgResp.data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmmb_promf);
    setFormErrors(newErrors);

    if (f === "promf_dpart") {
      getAllBOMByDepartment(v);
    }

    if (f === "promf_bommf") {
      const bom = bom_Options.find((opt) => opt.id === v);

      setFormData((prev) => ({
        ...prev,
        promf_cname: bom?.bommf_cname || "Process 1",
        promf_prono: bom?.bommf_prono || 1,
        promf_units: bom?.bommf_units || "",
        promf_bmqty: bom?.bommf_bmqty || 0,
        promf_bmval: bom.bommf_bmval || 0,
      }));
      loadAllDetailsBOM(v);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getAllBOMs();
    getAllUnits();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp, batchResp] = await Promise.all([
        processAPI.getRMPMbyProcessId({ prrpm_promf: id }),
        processAPI.getFOHbyProcessId({ prfoh_promf: id }),
        processAPI.getSFGFGbyProcessId({ prsfg_promf: id }),
        processAPI.getBatchbyProcessId({ prbtc_promf: id }),
      ]);
      setListDataRMPM(rmResp.data || []);
      setListDataFOH(fohResp.data || []);
      setListDataSFGFG(sfgResp.data || []);
      setListDataBatch(batchResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.promf_actve;
    const dataName = rowData.promf_cname;
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
      const resp = await processAPI.delete(rowData);
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
        getAllProcess();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllProcess();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setListDataRMPM([]);
    setListDataFOH([]);
    setListDataSFGFG([]);
    setListDataBatch([]);
    getAllDepartments();
    //getAllBOMs();
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
      const newErrors = validate(formData, tmmb_promf);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      if (listDataRMPM.length === 0) {
        showToast("At least 1 Raw Material is required", { type: "warning" });
        return;
      }
      if (listDataFOH.length === 0) {
        showToast("At least 1 Factory Overhead is required", {
          type: "warning",
        });
        return;
      }
      if (listDataSFGFG.length === 0) {
        showToast("At least 1 SFG/FG is required", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmmb_prrpm: listDataRMPM,
        tmmb_prfoh: listDataFOH,
        tmmb_prsfg: listDataSFGFG,
        tmmb_prbtc: listDataBatch,
      };

      setIsBusy(true);
      const resp = await processAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllProcess();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- RM / PM ----------

  const handleChangeRMPM = (f, v) => {
    setFormDataRMPM((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataRMPM, [f]: v }, tmmb_prrpm);
    setFormErrors(newErrors);
    if (f === "prrpm_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListRMPM = () => {
    const newErrors = validate(formDataRMPM, tmmb_prrpm);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataRMPM.prrpm_rmqty) &&
      ["", 0, "0", null, undefined].includes(formDataRMPM.prrpm_rmrto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_Options.find(
      (opt) => opt.id === formDataRMPM.prrpm_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataRMPM.prrpm_units,
    );

    const prrpm_rmval =
      (Number(formDataRMPM.prrpm_rmqty) || 0) *
      (Number(formDataRMPM.prrpm_rmrat) || 0);

    setListDataRMPM((prev) => [
      ...prev,
      {
        ...formDataRMPM,
        prrpm_rmval: prrpm_rmval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prrpm_actve: true,
      },
    ]);
    setFormDataRMPM({});
  };

  const handleEditRMPM = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormDataRMPM(rowData);
  };

  const handleDeleteRMPM = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataRMPM((prev) =>
      prev.filter((item) => item.prrpm_items !== rowData.prrpm_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- FACTORY OVERHEAD ----------

  const handleChangeFOH = (f, v) => {
    setFormDataFOH((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataFOH, [f]: v }, tmmb_prfoh);
    setFormErrors(newErrors);
    if (f === "prfoh_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListFOH = () => {
    const newErrors = validate(formDataFOH, tmmb_prfoh);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataFOH.prfoh_foqty) &&
      ["", 0, "0", null, undefined].includes(formDataFOH.prfoh_forto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataFOH.prfoh_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataFOH.prfoh_units,
    );

    const prfoh_foval =
      (Number(formDataFOH.prfoh_foqty) || 0) *
      (Number(formDataFOH.prfoh_forat) || 0);

    setListDataFOH((prev) => [
      ...prev,
      {
        ...formDataFOH,
        prfoh_foval: prfoh_foval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prfoh_actve: true,
      },
    ]);
    setFormDataFOH({});
  };

  const handleEditFOH = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormDataFOH(rowData);
  };

  const handleDeleteFOH = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataFOH((prev) =>
      prev.filter((item) => item.prfoh_items !== rowData.prfoh_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- SFG /FG ----------

  const handleChangeSFG = (f, v) => {
    setFormDataSFGFG((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataSFGFG, [f]: v }, tmmb_prsfg);
    setFormErrors(newErrors);
    if (f === "prsfg_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListSFG = () => {
    const newErrors = validate(formDataSFGFG, tmmb_prsfg);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataSFGFG.prsfg_fgqty) &&
      ["", 0, "0", null, undefined].includes(formDataSFGFG.prsfg_fgrto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataSFGFG.prsfg_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataSFGFG.prsfg_units,
    );

    const prsfg_fgval =
      (Number(formDataSFGFG.prsfg_fgqty) || 0) *
      (Number(formDataSFGFG.prsfg_fgrat) || 0);

    setListDataSFGFG((prev) => [
      ...prev,
      {
        ...formDataSFGFG,
        prsfg_fgval: prsfg_fgval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prsfg_actve: true,
      },
    ]);
    setFormDataSFGFG({});
  };

  const handleEditSFG = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormDataSFGFG(rowData);
  };

  const handleDeleteSFG = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataSFGFG((prev) =>
      prev.filter((item) => item.prsfg_items !== rowData.prsfg_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- BATCH ----------

  const handleChangeBatch = (f, v) => {
    setFormDataBatch((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataBatch, [f]: v }, tmmb_prbtc);
    setFormErrors(newErrors);
    if (f === "prbtc_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListBatch = () => {
    const newErrors = validate(formDataBatch, tmmb_prbtc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataBatch.prbtc_gaqty) &&
      ["", 0, "0", null, undefined].includes(formDataBatch.prbtc_gbqty)
    ) {
      showToast("At least one Good Quantity is required", {
        type: "warning",
      });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataBatch.prbtc_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataBatch.prbtc_units,
    );

    const prbtc_pbval =
      ((Number(formDataBatch.prbtc_gaqty) || 0) +
        (Number(formDataBatch.prbtc_gbqty) || 0)) *
      (Number(formDataBatch.prbtc_pbrat) || 0);

    setListDataBatch((prev) => [
      ...prev,
      {
        ...formDataBatch,
        prbtc_pbval: prbtc_pbval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        prbtc_actve: true,
      },
    ]);
    setFormDataBatch({});
  };

  const handleEditBatch = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormDataBatch(rowData);
  };

  const handleDeleteBatch = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataBatch((prev) =>
      prev.filter((item) => item.prbtc_items !== rowData.prbtc_items),
    );
    showToast("Removed successfully", { type: "success" });
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
    listDataRMPM,
    formDataRMPM,
    listDataFOH,
    formDataFOH,
    listDataSFGFG,
    formDataSFGFG,
    listDataBatch,
    formDataBatch,
    dpart_Options,
    bom_Options,
    units_Options,
    items_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //other
    handleChangeRMPM,
    handleAddToListRMPM,
    handleEditRMPM,
    handleDeleteRMPM,
    //foh
    handleChangeFOH,
    handleAddToListFOH,
    handleEditFOH,
    handleDeleteFOH,
    //sfg
    handleChangeSFG,
    handleAddToListSFG,
    handleEditSFG,
    handleDeleteSFG,
    //batch
    handleChangeBatch,
    handleAddToListBatch,
    handleEditBatch,
    handleDeleteBatch,
  };
};
export default useProcess;
