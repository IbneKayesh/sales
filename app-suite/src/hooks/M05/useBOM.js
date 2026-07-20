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
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState(dataModel);
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});
  //others
  const [listDataRMPM, setListDataRMPM] = useState([]);
  const [formDataRMPM, setFormDataRMPM] = useState({});

  const [listDataFOH, setListDataFOH] = useState([]);
  const [formDataFOH, setFormDataFOH] = useState({});

  const [listDataSFGFG, setListDataSFGFG] = useState([]);
  const [formDataSFGFG, setFormDataSFGFG] = useState({});

  const [dpart_Options, setDpart_Options] = useState([]);
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
    try {
      const resp = await departmentAPI.getAllActive({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllUnits = async () => {
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
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    loadAllDetails(rowData.id);
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [rmResp, fohResp, sfgResp] = await Promise.all([
        rawMaterialAPI.getAll({ borpm_bommf: id }),
        bofohAPI.getAll({ bofoh_bommf: id }),
        bosfgAPI.getAll({ bosfg_bommf: id }),
      ]);
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
        showToast("At least 1 item is required", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmmb_borpm: formDataRMPM,
        tmmb_bofoh: listDataFOH,
        tmmb_bosfg: listDataSFGFG,
      };

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
      prev.filter((item) => item.borpm_items !== rowData.borpm_items),
    );
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- FACTORY OVERHEAD ----------

  
  // ---------- SFG /FG ----------

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
    listDataSFGFG,
    formDataSFGFG,
    dpart_Options,
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
  };
};
export default useBOM;
