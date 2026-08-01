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

  //costing
  const [party_Options, setParty_Options] = useState([]);
  const [listDataCost, setListDataCost] = useState([]);
  const [formDataCost, setFormDataCost] = useState({});

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

  function reCalculate(items, master) {
    //clone items
    let newItems = [...items];
    //---------------------------------------------------
    // 1. Split Invoice Discount
    //---------------------------------------------------
    const totalQty = newItems.reduce(
      (sum, item) => sum + Number(item.mrrdc_itqty),
      0,
    );

    newItems = newItems.map((item) => {
      const mrrdc_edamt = totalQty
        ? ((Number(master.mrrdm_invds) || 0) * Number(item.mrrdc_itqty)) /
          totalQty
        : 0;

      return {
        ...item,
        mrrdc_edamt,
      };
    });

    //---------------------------------------------------
    // 2. Calculate item discount & VAT
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      // Calculate amount
      const mrrdc_itamt =
        (Number(item.mrrdc_itrat) || 0) * (Number(item.mrrdc_itqty) || 0);

      // Calculate discount amount
      const mrrdc_dsamt = mrrdc_itamt * ((Number(item.mrrdc_dspct) || 0) / 100);

      // Calculate after discount
      const afterDisc = mrrdc_itamt - (mrrdc_dsamt + item.mrrdc_edamt);
      const mrrdc_ivamt = afterDisc * ((Number(item.mrrdc_ivpct) || 0) / 100);
      const mrrdc_vtamt = afterDisc * ((Number(item.mrrdc_vtpct) || 0) / 100);
      const mrrdc_txamt = afterDisc * ((Number(item.mrrdc_txpct) || 0) / 100);

      let mrrdc_fcpct = Number(item.mrrdc_fcpct) || 0;
      let mrrdc_fcamt = Number(item.mrrdc_fcamt) || 0;
      if (mrrdc_fcpct > 0) {
        // User entered percentage -> calculate amount
        mrrdc_fcamt = Number((afterDisc * (mrrdc_fcpct / 100)).toFixed(4));
      } else if (mrrdc_fcamt > 0) {
        // User entered amount -> calculate percentage
        mrrdc_fcpct = afterDisc
          ? Number(((mrrdc_fcamt / afterDisc) * 100).toFixed(4))
          : 0;
      }

      const mrrdc_icamt = 0;
      const mrrdc_ecamt = 0;
      const mrrdc_ntamt = afterDisc + mrrdc_vtamt + mrrdc_icamt - mrrdc_ivamt;
      const mrrdc_csrat =
        (afterDisc + mrrdc_fcamt + mrrdc_icamt + mrrdc_ecamt) /
        Number(item.mrrdc_itqty);

      return {
        ...item,
        mrrdc_itamt,
        mrrdc_dsamt,
        mrrdc_ivamt,
        mrrdc_vtamt,
        mrrdc_txamt,
        mrrdc_fcpct,
        mrrdc_fcamt,
        mrrdc_ntamt,
        mrrdc_csrat,
      };
    });

    setListDataItem(newItems);

    // Single reduce pass: calculate all item totals at once
    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + (Number(item.mrrdc_itamt) || 0),
        itmds: acc.itmds + (Number(item.mrrdc_dsamt) || 0),
        ivtmt: acc.ivtmt + (Number(item.mrrdc_ivamt) || 0),
        vtamt: acc.vtamt + (Number(item.mrrdc_vtamt) || 0),
        txamt: acc.txamt + (Number(item.mrrdc_txamt) || 0),
        fcamt: acc.fcamt + (Number(item.mrrdc_fcamt) || 0),
        icamt: acc.icamt + (Number(item.mrrdc_icamt) || 0),
        ecamt: acc.ecamt + (Number(item.mrrdc_ecamt) || 0),
        ntamt: acc.ntamt + (Number(item.mrrdc_ntamt) || 0),
      }),
      {
        tramt: 0,
        itmds: 0,
        ivtmt: 0,
        vtamt: 0,
        txamt: 0,
        fcamt: 0,
        icamt: 0,
        ecamt: 0,
        ntamt: 0,
      },
    );

    //clone master
    let newMaster = { ...master };
    const pdamt = Number(newMaster.mrrdm_pdamt) || 0;
    const duamt = totals.ntamt - pdamt;

    setFormData({
      ...newMaster,
      mrrdm_tramt: Number(totals.tramt).toFixed(4),
      mrrdm_itmds: Number(totals.itmds).toFixed(4),
      mrrdm_ivtmt: Number(totals.ivtmt).toFixed(4),
      mrrdm_vtamt: Number(totals.vtamt).toFixed(4),
      mrrdm_txamt: Number(totals.txamt).toFixed(4),
      mrrdm_fcamt: Number(totals.fcamt).toFixed(4),
      mrrdm_icamt: Number(totals.icamt).toFixed(4),
      mrrdm_ecamt: Number(totals.ecamt).toFixed(4),
      mrrdm_pyamt: Number(totals.ntamt).toFixed(4),
      mrrdm_duamt: Number(duamt).toFixed(4),
    });
  }

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

    if (f === "mrrdm_invds") {
      const newformData = { ...formData, [f]: v };
      reCalculate(listDataItem, newformData);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getAllContacts();
    //getAllUnits();
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
    //getAllUnits();
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
      console.log(formData);
      console.log(newErrors);
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
        mrrdc_itrat: price_id?.price_lprat || 0,
        mrrdc_fcpct: price_id?.items_fxcst || 0,
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

    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      items_iname: items_iname?.items_iname || "Invalid Item",
      runit_uname: items_iname?.runit_uname || "Invalid Unit",
      sunit_cname: items_iname?.sunit_cname || "Invalid Unit",
      items_szqty: items_iname?.items_szqty || "0",
      mrrdc_actve: true,
    };
    const newItemList = [...listDataItem, newItem];
    reCalculate(newItemList, formData);
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

  // ---------- Costing Details ----------

  const handleChangeCost = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmpb_mrrdc);
    setFormErrors(newErrors);
    if (f === "mrrdc_items") {
      const price_id = items_Options.find((opt) => opt.id === v);
      setFormDataItem((prev) => ({
        ...prev,
        mrrdc_price: price_id?.price_id,
        mrrdc_units: price_id?.items_runit,
        mrrdc_itrat: price_id?.price_lprat || 0,
        mrrdc_fcpct: price_id?.items_fxcst || 0,
      }));
    }
  };

  const handleAddToListCost = () => {
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

    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      items_iname: items_iname?.items_iname || "Invalid Item",
      runit_uname: items_iname?.runit_uname || "Invalid Unit",
      sunit_cname: items_iname?.sunit_cname || "Invalid Unit",
      items_szqty: items_iname?.items_szqty || "0",
      mrrdc_actve: true,
    };
    const newItemList = [...listDataItem, newItem];
    reCalculate(newItemList, formData);
    setFormDataItem({});
    handleHideModal();
  };

  const handleEditCost = (rowData) => {
    handleShowModal("ITEM");
    setFormDataItem(rowData);
  };

  const handleDeleteCost = async (rowData) => {
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
      setModalTitle({
        title: "Add Item",
        subTitle: "MRR Item Details",
      });
    }
    if (modal === "COSTING") {
      setFormDataItem(dataModelItem);
      setModalTitle({
        title: "Add Costing",
        subTitle: "MRR Costing Details",
      });
    }

    setShowModal({ show: true, modal: modal });
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
    party_Options,
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
    //cost
    handleChangeCost,
    handleAddToListCost,
    handleEditCost,
    handleDeleteCost,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useMRR;
