import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { mrrAPI } from "@/api/M03/mrrAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmpb_mrrdm from "@/models/M03/tmpb_mrrdm.json";
const dataModel = generateDataModel(tmpb_mrrdm);
import tmpb_mrrdc from "@/models/M03/tmpb_mrrdc.json";
const dataModelItem = generateDataModel(tmpb_mrrdc);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { unitsAPI } from "@/api/M04/unitsAPI.js";
import { generateGuid } from "@/utils/guid.js";

const useMRR = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M03-M0001");
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

  const [dpart_Options, setDpart_Options] = useState([]);
  const [cntct_Options, setCntct_Options] = useState([]);
  const [items_Options, setItems_Options] = useState([]);
  const [units_Options, setUnits_Options] = useState([]);

  // ---------- MRR Master ----------
  const getAllMRR = async () => {
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllMRR();
  }, []);

  useEffect(() => {
    setFormData((prev) => {
      // Single reduce pass: calculate all item totals at once
      const totals = listDataItem.reduce(
        (acc, item) => ({
          tramt: acc.tramt + (Number(item.mrrdc_itamt) || 0),
          itmds: acc.itmds + (Number(item.mrrdc_dsamt) || 0),
          ivtmt: acc.ivtmt + (Number(item.mrrdc_ivamt) || 0),
          vtamt: acc.vtamt + (Number(item.mrrdc_vtamt) || 0),
          txamt: acc.txamt + (Number(item.mrrdc_txamt) || 0),
          fcamt: acc.fcamt + (Number(item.mrrdc_fcamt) || 0),
          ocamt: acc.ocamt + (Number(item.mrrdc_ocamt) || 0),
        }),
        {
          tramt: 0,
          itmds: 0,
          ivtmt: 0,
          vtamt: 0,
          txamt: 0,
          fcamt: 0,
          ocamt: 0,
        },
      );

      const invds = Number(prev.mrrdm_invds) || 0;
      const pdamt = Number(prev.mrrdm_pdamt) || 0;

      //total item amount - ( item discount + include vat / withhold vat + invoice discount)
      const pyamt = totals.tramt - (totals.itmds + totals.ivtmt + invds);
      const duamt = pyamt - pdamt;
      //item wise cost + other cost
      const mrrdm_ecamt = totals.fcamt + totals.ocamt;

      return {
        ...prev,
        mrrdm_tramt: Number(totals.tramt).toFixed(4),
        mrrdm_itmds: Number(totals.itmds).toFixed(4),
        mrrdm_ivtmt: Number(totals.ivtmt).toFixed(4),
        mrrdm_vtamt: Number(totals.vtamt).toFixed(4),
        mrrdm_txamt: Number(totals.txamt).toFixed(4),
        mrrdm_ecamt: Number(mrrdm_ecamt).toFixed(4),
        mrrdm_pyamt: Number(pyamt).toFixed(4),
        mrrdm_duamt: Number(duamt).toFixed(4),
      };
    });
  }, [
    listDataItem,
    formData.mrrdm_invds,
    formData.mrrdm_icamt,
    formData.mrrdm_pdamt,
  ]);

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

  const getAllContacts = async () => {
    if (cntct_Options.length > 0) {
      return;
    }
    try {
      const resp = await contactAPI.getSuppliers({});
      const list = resp.data || [];
      setCntct_Options(list);
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

  const getMrrItems = async () => {
    try {
      const resp = await itemsAPI.getMrrItems();
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmpb_mrrdm);
    setFormErrors(newErrors);

    if (f === "mrrdm_dpart") {
      //const dpart_cname = dpart_Options.find((opt) => opt.id === v);
      //could auto-fill dept name if needed
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getAllContacts();
    getAllUnits();
    getMrrItems();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getDetailsByMasterId({ mrrdc_mrrdm: id });
      setListDataItem(resp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.mrrdm_actve;
    const dataName = rowData.mrrdm_trnno;
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
      const resp = await mrrAPI.delete(rowData);
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
        getAllMRR();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllMRR();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      mrrdm_ttype: "Material Receipt Report",
      mrrdm_crncy: "BDT",
      mrrdm_exrat: 1,
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    getAllDepartments();
    getAllContacts();
    getAllUnits();
    getMrrItems();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmpb_mrrdm);
      setFormErrors(newErrors);
      console.log(formData)
      console.log(newErrors)
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (listDataItem.length === 0) {
        showToast("At least 1 item is required", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmpb_mrrdc: listDataItem,
      };

      //console.log(reqBody);
      //return;

      setIsBusy(true);
      const resp = await mrrAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllMRR();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Item Details ----------

  const handleChangeItem = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmpb_mrrdc);
    setFormErrors(newErrors);
    if (f === "mrrdc_items") {
      const price_id = items_Options.find((opt) => opt.id === v);
      setFormDataItem((prev) => ({
        ...prev,
        mrrdc_price: price_id?.price_id,
        mrrdc_units: price_id?.items_runit,
        mrrdc_itrat: price_id?.price_lprat,
        mrrdc_fcpct: price_id?.items_fxcst,
      }));
    }
  };

  const handleAddToListItem = () => {
    const newErrors = validate(formDataItem, tmpb_mrrdc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (["", 0, "0", null, undefined].includes(formDataItem.mrrdc_itqty)) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }

    const items_iname = items_Options.find(
      (opt) => opt.id === formDataItem.mrrdc_items,
    );

    // Calculate amount
    const mrrdc_itamt =
      (Number(formDataItem.mrrdc_itrat) || 0) *
      (Number(formDataItem.mrrdc_itqty) || 0);

    // Calculate discount amount
    const mrrdc_dsamt =
      mrrdc_itamt * ((Number(formDataItem.mrrdc_dspct) || 0) / 100);

    // Calculate net amount
    const afterDisc = mrrdc_itamt - mrrdc_dsamt;

    const mrrdc_ivamt =
      afterDisc * ((Number(formDataItem.mrrdc_ivpct) || 0) / 100);
    const mrrdc_vtamt =
      afterDisc * ((Number(formDataItem.mrrdc_vtpct) || 0) / 100);
    const mrrdc_txamt =
      afterDisc * ((Number(formDataItem.mrrdc_txpct) || 0) / 100);
    const mrrdc_fcamt =
      afterDisc * ((Number(formDataItem.mrrdc_fcpct) || 0) / 100);

    //pay to supplier is - mrrdc_ntamt : afterDisc
    const mrrdc_ntamt = afterDisc;

    //inventory rate is mrrdc_csrat = afterDisc + mrrdc_vtamt + mrrdc_txamt + mrrdc_fcamt + (Number(formDataItem.mrrdc_ocamt) || 0);
    const subTotal =
      afterDisc +
      mrrdc_vtamt +
      mrrdc_txamt +
      mrrdc_fcamt +
      (Number(formDataItem.mrrdc_ocamt) || 0);
    const mrrdc_csrat = subTotal / (Number(formDataItem.mrrdc_itqty) || 0);

    setListDataItem((prev) => [
      ...prev,
      {
        ...formDataItem,
        id: generateGuid(),
        mrrdc_itamt: Number(mrrdc_itamt).toFixed(4) || 0,
        mrrdc_dsamt: Number(mrrdc_dsamt).toFixed(4) || 0,
        mrrdc_ivamt: Number(mrrdc_ivamt).toFixed(4) || 0,
        mrrdc_vtamt: Number(mrrdc_vtamt).toFixed(4) || 0,
        mrrdc_txamt: Number(mrrdc_txamt).toFixed(4) || 0,
        mrrdc_fcamt: Number(mrrdc_fcamt).toFixed(4) || 0,
        mrrdc_ntamt: Number(mrrdc_ntamt).toFixed(4) || 0,
        mrrdc_csrat: Number(mrrdc_csrat).toFixed(4) || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
        runit_uname: items_iname?.runit_uname || "Invalid Unit",
        sunit_cname: items_iname?.sunit_cname || "Invalid Unit",
        items_szqty: items_iname?.items_szqty || "0",
        mrrdc_actve: true,
      },
    ]);
    setFormDataItem({});
    handleHideModal();
  };

  const handleEditItem = (rowData) => {
    handleShowModal("ITEM");
    setFormDataItem(rowData);
  };

  const handleDeleteItem = async (rowData) => {
    const dataName = rowData.items_iname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataItem((prev) => prev.filter((item) => item.id !== rowData.id));
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "ITEM") {
      setFormDataItem(dataModelItem);
    }
    setShowModal({ show: true, modal: modal });
    setModalTitle({
      title: "Add Item",
      subTitle: "MRR Item Details",
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
    cntct_Options,
    items_Options,
    units_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //item
    handleChangeItem,
    handleAddToListItem,
    handleEditItem,
    handleDeleteItem,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useMRR;
