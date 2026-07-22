import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { bomAPI } from "@/api/M05/bomAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmmb_bommf from "@/models/M05/tmmb_bommf.json";
const dataModel = generateDataModel(tmmb_bommf);
import tmmb_borpm from "@/models/M05/tmmb_borpm.json";
const dataModelRM = generateDataModel(tmmb_borpm);
import tmmb_bofoh from "@/models/M05/tmmb_bofoh.json";
const dataModelFOH = generateDataModel(tmmb_bofoh);
import tmmb_bosfg from "@/models/M05/tmmb_bosfg.json";
const dataModelSFG = generateDataModel(tmmb_bosfg);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { productionAPI } from "@/api/M05/productionAPI.js";
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
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  //others
  const [showModal, setShowModal] = useState({ show: false, modal: "" });
  const [modalTitle, setModalTitle] = useState({ title: "", subTitle: "" });

  const [listDataRMPM, setListDataRMPM] = useState([]);
  const [formDataRMPM, setFormDataRMPM] = useState(dataModelRM);

  const [listDataFOH, setListDataFOH] = useState([]);
  const [formDataFOH, setFormDataFOH] = useState(dataModelFOH);

  const [listDataSFGFG, setListDataSFGFG] = useState([]);
  const [formDataSFGFG, setFormDataSFGFG] = useState(dataModelSFG);

  const [dpart_Options, setDpart_Options] = useState([]);
  const [prods_Options, setProds_Options] = useState([]);
  const [units_Options, setUnits_Options] = useState([]);
  const [items_Options, setItems_Options] = useState([]);
  const [items_store_Options, setItems_store_Options] = useState([]);

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
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllProductions = async () => {
    if (prods_Options.length > 0) {
      return;
    }
    try {
      const resp = await productionAPI.getAllActive({});
      const list = resp.data || [];
      setProds_Options(list);
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

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmmb_bommf);
    setFormErrors(newErrors);

    if (f === "bommf_prods") {
      const prods_cname = prods_Options.find((opt) => opt.id === v);
      setFormData((prev) => ({
        ...prev,
        bommf_cname: prods_cname?.prods_cname || "Process 1",
      }));
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);

    // setDpart_Options([
    //   {
    //     id: rowData.bommf_dpart,
    //     dpart_cname: rowData.dpart_cname,
    //   },
    // ]);
    getAllDepartments();

    // setProds_Options([
    //   {
    //     id: rowData.bommf_prods,
    //     prods_cname: rowData.prods_cname,
    //   },
    // ]);

    getAllProductions();

    // setUnits_Options([
    //   {
    //     id: rowData.bommf_units,
    //     units_cname: rowData.units_cname,
    //   },
    // ]);
    getAllUnits();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp] = await Promise.all([
        bomAPI.getRMPMbyBOMId({ borpm_bommf: id }),
        bomAPI.getFOHbyBOMId({ bofoh_bommf: id }),
        bomAPI.getSFGFGbyBOMId({ bosfg_bommf: id }),
      ]);
      // console.log("loadAllDetails", id);
      // console.log("rmResp", rmResp);
      // console.log("fohResp", fohResp);
      // console.log("sfgResp", sfgResp);
      setListDataRMPM(rmResp.data || []);
      setListDataFOH(fohResp.data || []);
      setListDataSFGFG(sfgResp.data || []);
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
    setReadOnly(false);
    setStopEdit(false);
    setListDataRMPM([]);
    setListDataFOH([]);
    setListDataSFGFG([]);
    getAllDepartments();
    getAllProductions();
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
        tmmb_borpm: listDataRMPM,
        tmmb_bofoh: listDataFOH,
        tmmb_bosfg: listDataSFGFG,
      };

      //console.log("reqBody", reqBody);
      //return;
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

  // ---------- RM / PM ----------

  const handleChangeRMPM = (f, v) => {
    setFormDataRMPM((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataRMPM, [f]: v }, tmmb_borpm);
    setFormErrors(newErrors);
    if (f === "borpm_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListRMPM = () => {
    const newErrors = validate(formDataRMPM, tmmb_borpm);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataRMPM.borpm_rmqty) &&
      ["", 0, "0", null, undefined].includes(formDataRMPM.borpm_rmrto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_Options.find(
      (opt) => opt.id === formDataRMPM.borpm_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataRMPM.borpm_units,
    );

    const borpm_rmval =
      (Number(formDataRMPM.borpm_rmqty) || 0) *
      (Number(formDataRMPM.borpm_rmrat) || 0);

    setListDataRMPM((prev) => [
      ...prev,
      {
        ...formDataRMPM,
        borpm_rmval: borpm_rmval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        borpm_actve: true,
      },
    ]);
    setFormDataRMPM({});
    handleHideModal();
  };

  const handleEditRMPM = (rowData) => {
    handleShowModal("RMPM");
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
      prev.filter((item) => item.borpm_items !== rowData.borpm_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- FACTORY OVERHEAD ----------

  const handleChangeFOH = (f, v) => {
    setFormDataFOH((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataFOH, [f]: v }, tmmb_bofoh);
    setFormErrors(newErrors);
    if (f === "bofoh_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListFOH = () => {
    const newErrors = validate(formDataFOH, tmmb_bofoh);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataFOH.bofoh_foqty) &&
      ["", 0, "0", null, undefined].includes(formDataFOH.bofoh_forto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataFOH.bofoh_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataFOH.bofoh_units,
    );

    const bofoh_foval =
      (Number(formDataFOH.bofoh_foqty) || 0) *
      (Number(formDataFOH.bofoh_forat) || 0);

    setListDataFOH((prev) => [
      ...prev,
      {
        ...formDataFOH,
        bofoh_foval: bofoh_foval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        bofoh_actve: true,
      },
    ]);
    setFormDataFOH({});
    handleHideModal();
  };

  const handleEditFOH = (rowData) => {
    handleShowModal("FOH");
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
      prev.filter((item) => item.bofoh_items !== rowData.bofoh_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- SFG /FG ----------

  const handleChangeSFG = (f, v) => {
    setFormDataSFGFG((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataSFGFG, [f]: v }, tmmb_bosfg);
    setFormErrors(newErrors);
    if (f === "bosfg_types") {
      const current_items = items_store_Options.filter(
        (item) => item.items_itype === v,
      );
      setItems_Options(current_items);
    }
  };

  const handleAddToListSFG = () => {
    const newErrors = validate(formDataSFGFG, tmmb_bosfg);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataSFGFG.bosfg_fgqty) &&
      ["", 0, "0", null, undefined].includes(formDataSFGFG.bosfg_fgrto)
    ) {
      showToast("Qty or Ratio both are Empty", { type: "warning" });
      return;
    }
    const items_iname = items_store_Options.find(
      (opt) => opt.id === formDataSFGFG.bosfg_items,
    );

    const units_cname = units_Options.find(
      (opt) => opt.id === formDataSFGFG.bosfg_units,
    );

    const bosfg_fgval =
      (Number(formDataSFGFG.bosfg_fgqty) || 0) *
      (Number(formDataSFGFG.bosfg_fgrat) || 0);

    setListDataSFGFG((prev) => [
      ...prev,
      {
        ...formDataSFGFG,
        bosfg_fgval: bosfg_fgval || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        units_cname: units_cname?.units_cname || "Invalid Unit",
        bosfg_actve: true,
      },
    ]);
    setFormDataSFGFG({});
    handleHideModal();
  };

  const handleEditSFG = (rowData) => {
    handleShowModal("SFG");
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
      prev.filter((item) => item.bosfg_items !== rowData.bosfg_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    // Reset form data based on modal type
    if (modal === "RMPM") {
      setFormDataRMPM(dataModelRM);
    } else if (modal === "FOH") {
      setFormDataFOH(dataModelFOH);
    } else if (modal === "SFG") {
      setFormDataSFGFG(dataModelSFG);
    }

    setShowModal({ show: true, modal: modal });
    switch (modal) {
      case "RMPM":
        setModalTitle({
          title: "Add RM/PM",
          subTitle: "Raw Material / Packing Material",
        });
        break;
      case "FOH":
        setModalTitle({
          title: "Add FOH",
          subTitle: "Factory Overhead",
        });
        break;
      case "SFG":
        setModalTitle({
          title: "Add SFG/FG",
          subTitle: "Semi-Finished / Finished Goods",
        });
        break;
      default:
        setModalTitle({ title: "", subTitle: "" });
    }
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
    listDataRMPM,
    formDataRMPM,
    listDataFOH,
    formDataFOH,
    listDataSFGFG,
    formDataSFGFG,
    dpart_Options,
    prods_Options,
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
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useBOM;
