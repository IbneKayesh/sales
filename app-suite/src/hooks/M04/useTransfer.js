import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid.js";
import { validNumber, divNumber } from "@/utils/misc.js";
import tmib_trndm from "@/models/M04/trns/tmib_trndm.json";
import tmib_trndc from "@/models/M04/trns/tmib_trndc.json";
import tmib_trncs from "@/models/M04/trns/tmib_trncs.json";
const dataModel = generateDataModel(tmib_trndm);
const dataModelItem = generateDataModel(tmib_trndc);
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { transferAPI } from "@/api/M04/transferAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";

const useTransfer = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M03-M0001");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [tcVisibleItem, setTcVisibleItem] = useState([]);
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
  const [allItems, setAllItems] = useState([]);

  //costing
  const [trncs_Options, settrncs_Options] = useState([]);
  const [listDataCost, setListDataCost] = useState([]);
  const [formDataCost, setFormDataCost] = useState({});

  //Table Columns
  const getTabColumns = async () => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByPage({
        tabcl_cname: "SYS_MRR_DIRECT",
      });
      const list = resp.data || [];
      //console.log("list", list);
      setTcVisibleItem(list);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- MRR Master ----------
  const getAllTransfer = async () => {
    try {
      setIsBusy(true);
      const resp = await transferAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getTabColumns();
    getAllTransfer();
  }, []);

  useEffect(() => {
    if (listDataItem.length > 0) {
      setStopEdit(true);
    } else {
      setStopEdit(false);
    }
  }, [listDataItem]);

  useEffect(() => {
    const addedItemIds = new Set(listDataItem.map((item) => item.trndc_refid));

    const availableItems = allItems.filter(
      (item) => !addedItemIds.has(item.stock_id),
    );

    setItems_Options(availableItems);
  }, [allItems, listDataItem]);

  function reCalculate(items, master, costList) {
    //console.log("items", items);

    // Clone
    let newItems = [...(items || [])];
    let newCosting = [...(costList || [])];
    setListDataCost(newCosting);

    //---------------------------------------------------
    // Totals
    //---------------------------------------------------
    const totalAmount = newItems.reduce(
      (sum, item) =>
        sum + validNumber(item.trndc_itrat) * validNumber(item.trndc_itqty),
      0,
    );

    const totalQty = newItems.reduce(
      (sum, item) => sum + validNumber(item.trndc_itqty),
      0,
    );

    const totalLine = newItems.length;

    //---------------------------------------------------
    // Cost Summary
    //---------------------------------------------------

    const sumCost = (csmod, clmod) =>
      newCosting
        .filter(
          (item) => item.trncs_csmod === csmod && item.trncs_clmod === clmod,
        )
        .reduce((sum, item) => sum + validNumber(item.trncs_value), 0);

    const incAmt = sumCost("Include", "By Amount");
    const incQty = sumCost("Include", "By Qty");
    const incLine = sumCost("Include", "By Line");

    const excAmt = sumCost("Exclude", "By Amount");
    const excQty = sumCost("Exclude", "By Qty");
    const excLine = sumCost("Exclude", "By Line");

    const incAmtRate = divNumber(incAmt, totalAmount);
    const incQtyRate = divNumber(incQty, totalQty);
    const incLineRate = divNumber(incLine, totalLine);

    const excAmtRate = divNumber(excAmt, totalAmount);
    const excQtyRate = divNumber(excQty, totalQty);
    const excLineRate = divNumber(excLine, totalLine);

    //---------------------------------------------------
    // 2. Calculate Item Values
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      const qty = validNumber(item.trndc_itqty);
      const rate = validNumber(item.trndc_itrat);

      const trndc_itamt = rate * qty;

      //---------------------------------------------------
      // Including Cost
      //---------------------------------------------------

      const iAmt = trndc_itamt * incAmtRate;
      const iQty = qty * incQtyRate;
      const iLine = incLineRate;

      //---------------------------------------------------
      // Excluding Cost
      //---------------------------------------------------

      const eAmt = trndc_itamt * excAmtRate;
      const eQty = qty * excQtyRate;
      const eLine = excLineRate;

      const trndc_icamt = iAmt + iQty + iLine;
      const trndc_ecamt = eAmt + eQty + eLine;

      //---------------------------------------------------
      // Amount
      //---------------------------------------------------

      const trndc_stamt = trndc_itamt + trndc_icamt + trndc_ecamt;

      const trndc_csrat = divNumber(
        trndc_itamt + trndc_icamt + trndc_ecamt,
        qty,
      );

      return {
        ...item,
        trndc_itamt,
        trndc_ecamt,
        trndc_stamt,
        trndc_csrat,
      };
    });

    setListDataItem(newItems);

    //---------------------------------------------------
    // Totals Master
    //---------------------------------------------------

    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + validNumber(item.trndc_itamt),
        ecamt: acc.ecamt + validNumber(item.trndc_ecamt),
        stamt: acc.stamt + validNumber(item.trndc_stamt),
        csamt:
          acc.csamt +
          validNumber(item.trndc_csrat) * validNumber(item.trndc_itqty),
      }),
      {
        tramt: 0,
        ecamt: 0,
        stamt: 0,
        csamt: 0,
      },
    );

    //---------------------------------------------------
    // Master
    //---------------------------------------------------

    //console.log("master", totals);

    setFormData({
      ...master,
      trndm_tramt: validNumber(totals.tramt),
      trndm_ecamt: validNumber(totals.ecamt),
      trndm_stamt: validNumber(totals.stamt),
      trndm_csamt: validNumber(totals.csamt),
    });
  }

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getTransfer({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getExpnPaym = async () => {
    // if (trncs_Options.length > 0) {
    //   return;
    //updated balance
    // }
    try {
      const resp = await coaNetworkAPI.getMrrDirectExpPaym({});
      const list = resp.data || [];
      const mrrcs = list.filter(
        (f) => f.chtrt_grpid === "SYS_LIB_LOCAL_VENDOR",
      );
      const mrrpy = list.filter((f) =>
        ["SYS_AST_PAYMENT", "SYS_NONE"].includes(f.chtrt_grpid),
      );
      //console.log("list",list)
      settrncs_Options(mrrcs);
      const listActive = mrrpy.filter((f) => validNumber(f.party_crbal) > 0);
      setMrrpy_Options(listActive);
    } catch (error) {}
  };

  const getPOExpnPaym = async (cntct_id, dpart_id) => {
    try {
      const resp = await coaNetworkAPI.getMrrDirectExpPaymPO({
        cntct_id: cntct_id,
        dpart_id: dpart_id,
      });
      const list = resp.data || [];
      const mrrcs = list.filter(
        (f) => f.chtrt_grpid === "SYS_LIB_LOCAL_VENDOR",
      );
      const mrrpy = list.filter((f) =>
        ["SYS_AST_SUPPLIER", "SYS_NONE"].includes(f.chtrt_grpid),
      );
      //console.log("list",list)
      settrncs_Options(mrrcs);
      const listActive = mrrpy.filter((f) => validNumber(f.party_crbal) > 0);
      setMrrpy_Options(listActive);
    } catch (error) {}
  };

  const getTransferItems = async (dpart_id) => {
    try {
      const resp = await itemsAPI.getTransferItems({
        dpart_id: dpart_id,
      });
      const list = resp.data || [];
      //setItems_Options(list);
      setAllItems(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_trndm);
    setFormErrors(newErrors);

    if (f === "trndm_dpart") {
      await getTransferItems(v);
      await getPOExpnPaym(v);
      //full off
      //reCalculate(listDataItem, formData, listDataCost);
    }

    if (
      (f === "trndm_dpart" && v === formData.trndm_dparz) ||
      (v === formData.trndm_dpart && f === "trndm_dparz")
    ) {
      showToast("Same WH can not make transfer", { type: "error" });
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getExpnPaym();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [dtResp, csResp] = await Promise.all([
        transferAPI.getDetailsByMasterId({ trndc_trndm: id }),
        transferAPI.getCostsByMasterId({ trncs_trndm: id }),
      ]);
      setListDataItem(dtResp.data || []);
      setListDataCost(csResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    if (rowData.trndm_ispst) {
      showToast("MRR is posted. Cannot delete.", { type: "warning" });
      return;
    }

    const isActive = rowData.trndm_actve;
    const dataName = rowData.trndm_trnno;
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
      const resp = await transferAPI.delete(rowData);
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
        getAllTransfer();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllTransfer();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      trndm_ttype: "Transfer IO",
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    setListDataCost([]);
    setItems_Options([]);
    getAllDepartments();
    getExpnPaym();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_trndm);
      setFormErrors(newErrors);
      //console.log(formData);
      //console.log(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (listDataItem.length === 0) {
        showToast("At least 1 item is required", { type: "warning" });
        return;
      }

      if (formData.trndm_dpart === formData.trndm_dparz) {
        showToast("Same WH can not make transfer", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmib_trndc: listDataItem,
        tmib_trncs: listDataCost,
      };

      //console.log(reqBody);
      //return;
      setIsBusy(true);
      const resp = await transferAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllTransfer();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Item Details ----------

  const handleChangeItem = async (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_trndc);
    setFormErrors(newErrors);
    if (f === "trndc_refid") {
      const stock_id = items_Options.find((opt) => opt.stock_id === v);
      //console.log("stock_id", stock_id);
      let defQty = stock_id?.stock_ohqty || 1;
      setFormDataItem((prev) => ({
        ...prev,
        trndc_items: stock_id?.stock_items,
        trndc_price: stock_id?.stock_price,
        trndc_units: stock_id?.items_runit,
        trndc_itrat: stock_id?.stock_cprat || 0,
        party_id: stock_id?.party_id || "-",
        chtac_id: stock_id?.chtac_id || "-",
        trndc_refid: stock_id?.stock_id || "-",
        refid_trnno: stock_id?.stock_trnno || "-",
        trndc_itqty: defQty,
        items_iname: stock_id?.items_iname || "Invalid Item",
        price_cname: stock_id?.price_cname || "Invalid Item",
        runit_cname: stock_id?.runit_cname || "Invalid Retail Unit",
        items_pkqty: stock_id?.items_pkqty || 1,
        punit_cname: stock_id?.punit_cname || "Invalid Pack Unit",
        items_szqty: stock_id?.items_szqty || 1,
        sunit_cname: stock_id?.sunit_cname || "Invalid Size Unit",
        sgrup_cname: stock_id?.sgrup_cname || "Invalid Sub Group",
        scatg_cname: stock_id?.scatg_cname || "Invalid Sub Category",
        brand_cname: stock_id?.brand_cname || "Invalid Brand",
        trndc_actve: true,
        stock_brcod: stock_id?.stock_brcod || "",
        stock_batch: stock_id?.stock_batch || "",
        stock_srial: stock_id?.stock_srial || "",
        stock_wrdat: stock_id?.stock_wrdat || "",
        stock_fgdat: stock_id?.stock_fgdat || "",
        stock_exdat: stock_id?.stock_exdat || "",
      }));
    }
  };

  const handleAddToListItem = (value) => {
    const newErrors = validate(formDataItem, tmib_trndc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (validNumber(formDataItem.trndc_itqty) <= 0.1) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }
    if (validNumber(formDataItem.trndc_itrat) <= 0) {
      showToast("Price is required", { type: "warning" });
      return;
    }

    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
    };

    const newItemList = [...listDataItem, newItem];
    reCalculate(newItemList, formData, listDataCost);
    setFormDataItem({});
    if (value === "CLOSE") {
      handleHideModal();
    }
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

    const newItemList = listDataItem.filter((item) => item.id !== rowData.id);
    reCalculate(newItemList, formData, listDataCost);
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- Costing Details ----------

  const handleChangeCost = (f, v) => {
    setFormDataCost((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataCost, [f]: v }, tmib_trncs);
    setFormErrors(newErrors);
    //console.log(f, v);
    if (f === "trncs_party") {
      const trncs_id = trncs_Options.find((opt) => opt.id === v);
      //console.log("trncs_id", trncs_id);
      setFormDataCost((prev) => ({
        ...prev,
        party_cname: trncs_id?.party_cname,
        trncs_party: v,
        chtac_chtno: trncs_id?.chtac_chtno,
        chtac_id: trncs_id?.party_chtac,
        party_id: v,
      }));
    }
  };

  const handleAddToListCost = () => {
    const newErrors = validate(formDataCost, tmib_trncs);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const isExists = listDataCost.find(
      (f) => f.party_id === formDataCost.trncs_party,
    );
    if (isExists) {
      showToast("This Cost is already added", { type: "warning" });
      return;
    }

    if (validNumber(formDataCost.trncs_value) < 0.01) {
      showToast("Amount is required", { type: "warning" });
      return;
    }

    const party_cname = trncs_Options.find(
      (opt) => opt.id === formDataCost.trncs_party,
    );

    //create new row
    const newItem = {
      ...formDataCost,
      id: generateGuid(),
      party_cname: party_cname?.party_cname || "Invalid Item",
      trncs_actve: true,
    };
    const newCostList = [...listDataCost, newItem];
    reCalculate(listDataItem, formData, newCostList);
    setFormDataCost({});
    handleHideModal();
  };

  const handleEditCost = (rowData) => {
    handleShowModal("COSTING");
    setFormDataCost(rowData);
  };

  const handleDeleteCost = async (rowData) => {
    const dataName = rowData.party_cname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataCost((prev) => prev.filter((item) => item.id !== rowData.id));
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "ITEM") {
      setFormDataItem(dataModelItem);
      setModalTitle({
        title: "Add Item",
        subTitle: "Item Details",
      });
    }

    if (modal === "COSTING") {
      setFormDataCost(dataModelItem);
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
    tcVisibleItem,
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
    trncs_Options,
    listDataCost,
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
    formDataCost,
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
export default useTransfer;
