import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { invoiceAPI } from "@/api/M02/invoiceAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmob_invcm from "@/models/M02/tmob_invcm.json";
const dataModel = generateDataModel(tmob_invcm);
import tmob_invcc from "@/models/M02/tmob_invcc.json";
const dataModelItem = generateDataModel(tmob_invcc);
import tmob_invcs from "@/models/M02/tmob_invcs.json";
const dataModelCost = generateDataModel(tmob_invcs);
import tmob_invpy from "@/models/M02/tmob_invpy.json";
const dataModelPayment = generateDataModel(tmob_invpy);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { generateGuid } from "@/utils/guid.js";

const useInvoice = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M02-M0001");
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

  //costing
  const [invcs_Options, setInvcs_Options] = useState([]);
  const [listDataCost, setListDataCost] = useState([]);
  const [formDataCost, setFormDataCost] = useState({});

  //payment
  const [invpy_Options, setInvpy_Options] = useState([]);
  const [listDataPayment, setListDataPayment] = useState([]);
  const [formDataPayment, setFormDataPayment] = useState({});

  // ---------- Invoice Master ----------
  const getAllInvoices = async () => {
    try {
      setIsBusy(true);
      const resp = await invoiceAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, []);

  function reCalculate(items, master, costList, paymList) {
    //console.log("items", items);

    // Safe number conversion (handles null, undefined, NaN, "", etc.)
    const num = (value) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    };

    // Safe divide
    const div = (a, b) => (num(b) === 0 ? 0 : num(a) / num(b));

    // Clone
    let newItems = [...(items || [])];
    let newCosting = [...(costList || [])];
    setListDataCost(newCosting);

    //---------------------------------------------------
    // Totals
    //---------------------------------------------------
    const totalAmount = newItems.reduce(
      (sum, item) => sum + num(item.mrrdc_itrat) * num(item.mrrdc_itqty),
      0,
    );

    const totalQty = newItems.reduce(
      (sum, item) => sum + num(item.mrrdc_itqty),
      0,
    );

    const totalLine = newItems.length;

    //---------------------------------------------------
    // Cost Summary
    //---------------------------------------------------

    const sumCost = (csmod, clmod) =>
      newCosting
        .filter(
          (item) => item.mrrcs_csmod === csmod && item.mrrcs_clmod === clmod,
        )
        .reduce((sum, item) => sum + num(item.mrrcs_value), 0);

    const incAmt = sumCost("Include", "By Amount");
    const incQty = sumCost("Include", "By Qty");
    const incLine = sumCost("Include", "By Line");

    const excAmt = sumCost("Exclude", "By Amount");
    const excQty = sumCost("Exclude", "By Qty");
    const excLine = sumCost("Exclude", "By Line");

    const incAmtRate = div(incAmt, totalAmount);
    const incQtyRate = div(incQty, totalQty);
    const incLineRate = div(incLine, totalLine);

    const excAmtRate = div(excAmt, totalAmount);
    const excQtyRate = div(excQty, totalQty);
    const excLineRate = div(excLine, totalLine);

    //---------------------------------------------------
    // 1. Split Invoice Discount
    //---------------------------------------------------
    // Invoice discount has two input modes:
    //   A) Percentage mode (invcm_dspct > 0): the % is auto-filled from the supplier
    //      (cntct_dspct) when invcm_cntct changes, or entered directly. The amount is
    //      DERIVED from it: amount = totalAmount * pct / 100, and invcm_invds is a
    //      read-only display value (the field is disabled in the form while pct > 0).
    //   B) Amount mode (invcm_dspct === 0): the user types the discount amount directly
    //      into invcm_invds. The value is used as-is (kept raw, never reformatted),
    //      because re-formatting it to 4 decimals mid-typing would break the input.
    // The effective amount computed here is then split proportionally across the item
    // lines (mrrdc_edamt).
    // write the effective discount amount back: computed (formatted) in % mode,
    // or the raw user-typed value (unformatted, so typing stays usable) in amount mode
    const invoice_discount_pct = Number(master?.invcm_dspct || 0);
    let invoice_discount_amount = 0;
    if (invoice_discount_pct > 0) {
      invoice_discount_amount = (totalAmount * invoice_discount_pct) / 100;
    } else {
      invoice_discount_amount = master?.invcm_invds;
    }

    newItems = newItems.map((item) => {
      const mrrdc_edamt = div(
        num(invoice_discount_amount) * num(item.mrrdc_itqty),
        totalQty,
      );

      return {
        ...item,
        mrrdc_edamt,
      };
    });

    //---------------------------------------------------
    // 2. Calculate Item Values
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      const qty = num(item.mrrdc_itqty);
      const rate = num(item.mrrdc_itrat);

      const mrrdc_itamt = rate * qty;

      const mrrdc_dsamt = mrrdc_itamt * (num(item.mrrdc_dspct) / 100);

      const afterDisc = mrrdc_itamt - (mrrdc_dsamt + num(item.mrrdc_edamt));

      const mrrdc_ivamt = afterDisc * (num(item.mrrdc_ivpct) / 100);

      const mrrdc_vtamt = afterDisc * (num(item.mrrdc_vtpct) / 100);

      const mrrdc_txamt = afterDisc * (num(item.mrrdc_txpct) / 100);

      //---------------------------------------------------
      // Freight
      //---------------------------------------------------

      let mrrdc_fcpct = num(item.mrrdc_fcpct);
      let mrrdc_fcamt = num(item.mrrdc_fcamt);

      if (mrrdc_fcpct > 0) {
        mrrdc_fcamt = Number((afterDisc * (mrrdc_fcpct / 100)).toFixed(4));
      } else if (mrrdc_fcamt > 0) {
        mrrdc_fcpct = Number((div(mrrdc_fcamt, afterDisc) * 100).toFixed(4));
      }

      //---------------------------------------------------
      // Including Cost
      //---------------------------------------------------

      const iAmt = mrrdc_itamt * incAmtRate;
      const iQty = qty * incQtyRate;
      const iLine = incLineRate;

      //---------------------------------------------------
      // Excluding Cost
      //---------------------------------------------------

      const eAmt = mrrdc_itamt * excAmtRate;
      const eQty = qty * excQtyRate;
      const eLine = excLineRate;

      const mrrdc_icamt = iAmt + iQty + iLine;
      const mrrdc_ecamt = eAmt + eQty + eLine;

      //---------------------------------------------------
      // Net Amount
      //---------------------------------------------------

      const mrrdc_ntamt = afterDisc + mrrdc_vtamt + mrrdc_icamt - mrrdc_ivamt;

      const mrrdc_csrat = div(
        afterDisc + mrrdc_fcamt + mrrdc_icamt + mrrdc_ecamt - mrrdc_ivamt,
        qty,
      );

      return {
        ...item,
        mrrdc_itamt,
        mrrdc_dsamt,
        mrrdc_ivamt,
        mrrdc_vtamt,
        mrrdc_txamt,
        mrrdc_fcpct,
        mrrdc_fcamt,
        mrrdc_icamt,
        mrrdc_ecamt,
        mrrdc_ntamt,
        mrrdc_csrat,
      };
    });

    setListDataItem(newItems);

    //---------------------------------------------------
    // Totals
    //---------------------------------------------------

    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + num(item.mrrdc_itamt),
        itmds: acc.itmds + num(item.mrrdc_dsamt),
        ivtmt: acc.ivtmt + num(item.mrrdc_ivamt),
        vtamt: acc.vtamt + num(item.mrrdc_vtamt),
        txamt: acc.txamt + num(item.mrrdc_txamt),
        fcamt: acc.fcamt + num(item.mrrdc_fcamt),
        icamt: acc.icamt + num(item.mrrdc_icamt),
        ecamt: acc.ecamt + num(item.mrrdc_ecamt),
        ntamt: acc.ntamt + num(item.mrrdc_ntamt),
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

    //---------------------------------------------------
    // Payments
    //---------------------------------------------------

    const newPayments = [...(paymList || [])];

    const totalPayment = newPayments.reduce(
      (sum, item) => sum + num(item.mrrpy_pdamt),
      0,
    );

    setListDataPayment(newPayments);

    //---------------------------------------------------
    // Master
    //---------------------------------------------------

    const duamt = totals.ntamt - totalPayment;

    setFormData({
      ...master,
      invcm_tramt: num(totals.tramt).toFixed(4),
      invcm_itmds: num(totals.itmds).toFixed(4),
      invcm_invds: invoice_discount_amount,
      invcm_ivtmt: num(totals.ivtmt).toFixed(4),
      invcm_vtamt: num(totals.vtamt).toFixed(4),
      invcm_txamt: num(totals.txamt).toFixed(4),
      invcm_fcamt: num(totals.fcamt).toFixed(4),
      invcm_icamt: num(totals.icamt).toFixed(4),
      invcm_ecamt: num(totals.ecamt).toFixed(4),
      invcm_pyamt: num(totals.ntamt).toFixed(4),
      invcm_pdamt: num(totalPayment).toFixed(4),
      invcm_duamt: num(duamt).toFixed(4),
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
      const resp = await contactAPI.getCustomers({});
      const list = resp.data || [];
      setCntct_Options(list);
    } catch (error) {}
  };

  const getExpnPaym = async () => {
    if (invcs_Options.length > 0) {
      return;
    }
    try {
      const resp = await invoiceAPI.getExpensesPaymentsHeads({});
      const list = resp.data || [];
      const invcs = list.filter((f) => f.prtyn_ctype === "EXPENSES");
      const invpy = list.filter((f) => f.prtyn_ctype === "PAYMENTS");
      setInvcs_Options(invcs);
      setInvpy_Options(invpy);
    } catch (error) {}
  };

  const getItems = async () => {
    try {
      const resp = await itemsAPI.getSalesInvoiceItems();
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmob_invcm);
    setFormErrors(newErrors);

    if (f === "invcm_cntct") {
      const cntct_id = cntct_Options.find((opt) => opt.id === v);
      const dspct = cntct_id?.cntct_dspct || 0;
      const newformData = {
        ...formData,
        invcm_cntct: v,
        invcm_dspct: dspct,
        // new supplier has no discount % -> clear any stale computed amount
        ...(dspct === 0 ? { invcm_invds: 0 } : {}),
      };
      reCalculate(listDataItem, newformData, listDataCost, listDataPayment);
    }
    if (f === "invcm_invds" || f === "invcm_dspct") {
      const newformData = {
        ...formData,
        [f]: v,
        // % cleared -> also clear the derived/stale amount
        ...(f === "invcm_dspct" && Number(v) === 0 ? { invcm_invds: 0 } : {}),
      };
      reCalculate(listDataItem, newformData, listDataCost, listDataPayment);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getAllContacts();
    getItems();
    getExpnPaym();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [dtResp, csResp, pyResp] = await Promise.all([
        invoiceAPI.getDetailsByMasterId({ invcc_invcm: id }),
        invoiceAPI.getCostsByMasterId({ invcs_invcm: id }),
        invoiceAPI.getPaymentsByMasterId({ invpy_invcm: id }),
      ]);
      setListDataItem(dtResp.data || []);
      setListDataCost(csResp.data || []);
      setListDataPayment(pyResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    if (rowData.invcm_ispst) {
      showToast("Invoice is posted. Cannot delete.", { type: "warning" });
      return;
    }

    const isActive = rowData.invcm_actve;
    const dataName = rowData.invcm_trnno;
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
      const resp = await invoiceAPI.delete(rowData);
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
        getAllInvoices();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllInvoices();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      invcm_ttype: "Sales Invoice",
      invcm_crncy: "BDT",
      invcm_exrat: 1,
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    setListDataCost([]);
    setListDataPayment([]);

    getAllDepartments();
    getAllContacts();
    getExpnPaym();
    getItems();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmob_invcm);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (listDataItem.length === 0) {
        showToast("At least 1 item is required", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmob_invcc: listDataItem,
        tmob_invcs: listDataCost,
        tmob_invpy: listDataPayment,
      };

      setIsBusy(true);
      const resp = await invoiceAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllInvoices();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Item Details ----------

  const handleChangeItem = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmob_invcc);
    setFormErrors(newErrors);
    if (f === "invcc_price") {
      const price_id = items_Options.find((opt) => opt.price_id === v);
      setFormDataItem((prev) => ({
        ...prev,
        invcc_items: price_id?.id,
        invcc_price: v,
        invcc_units: price_id?.items_runit,
        invcc_itrat: price_id?.price_lprat || 0,
      }));
    }
  };

  const handleAddToListItem = (value) => {
    const newErrors = validate(formDataItem, tmob_invcc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (["", 0, "0", null, undefined].includes(formDataItem.invcc_itqty)) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }

    const items_iname = items_Options.find(
      (opt) => opt.price_id === formDataItem.invcc_price,
    );
    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      items_iname: items_iname?.price_cname || "Invalid Item",
      runit_uname: items_iname?.runit_uname || "Invalid Unit",
      sunit_cname: items_iname?.sunit_cname || "Invalid Unit",
      items_szqty: items_iname?.items_szqty || "0",
      invcc_actve: true,
    };
    const newItemList = [...listDataItem, newItem];
    reCalculate(newItemList, formData, listDataCost, listDataPayment);
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
    reCalculate(newItemList, formData, listDataCost, listDataPayment);
    showToast("Removed successfully", { type: "success" });
  };

  // ---------- Costing Details ----------

  const handleChangeCost = (f, v) => {
    setFormDataCost((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataCost, [f]: v }, tmob_invcs);
    setFormErrors(newErrors);
    if (f === "invcs_party") {
      const invcs_id = invcs_Options.find((opt) => opt.id === v);
      setFormDataCost((prev) => ({
        ...prev,
        party_cname: invcs_id?.party_cname,
      }));
    }
  };

  const handleAddToListCost = () => {
    const newErrors = validate(formDataCost, tmob_invcs);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (["", 0, "0", null, undefined].includes(formDataCost.invcs_value)) {
      showToast("Amount is required", { type: "warning" });
      return;
    }

    const party_cname = invcs_Options.find(
      (opt) => opt.id === formDataCost.invcs_party,
    );

    //create new row
    const newItem = {
      ...formDataCost,
      id: generateGuid(),
      party_cname: party_cname?.party_cname || "Invalid Item",
      invcs_actve: true,
    };
    const newCostList = [...listDataCost, newItem];
    reCalculate(listDataItem, formData, newCostList, listDataPayment);
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

  // ---------- Payment Details ----------

  const handleChangePayment = (f, v) => {
    setFormDataPayment((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataPayment, [f]: v }, tmob_invpy);
    setFormErrors(newErrors);
    if (f === "invpy_party") {
      const invpy_id = invpy_Options.find((opt) => opt.id === v);
      setFormDataPayment((prev) => ({
        ...prev,
        party_cname: invpy_id?.party_cname,
      }));
    }
  };

  const handleAddToListPayment = () => {
    const newErrors = validate(formDataPayment, tmob_invpy);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (["", 0, "0", null, undefined].includes(formDataPayment.invpy_pdamt)) {
      showToast("Amount is required", { type: "warning" });
      return;
    }

    const party_cname = invpy_Options.find(
      (opt) => opt.id === formDataPayment.invpy_party,
    );

    //create new row
    const newItem = {
      ...formDataPayment,
      id: generateGuid(),
      party_cname: party_cname?.party_cname || "Invalid Item",
      invpy_actve: true,
    };
    const newPaymentList = [...listDataPayment, newItem];
    reCalculate(listDataItem, formData, listDataCost, newPaymentList);
    setFormDataPayment({});
    handleHideModal();
  };

  const handleEditPayment = (rowData) => {
    handleShowModal("PAYMENT");
    setFormDataPayment(rowData);
  };

  const handleDeletePayment = async (rowData) => {
    const dataName = rowData.party_cname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    setListDataPayment((prev) => prev.filter((item) => item.id !== rowData.id));
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "ITEM") {
      setFormDataItem(dataModelItem);
      setModalTitle({
        title: "Add Item",
        subTitle: "Invoice Item Details",
      });
    }
    if (modal === "COSTING") {
      setFormDataCost(dataModelCost);
      setModalTitle({
        title: "Add Costing",
        subTitle: "Invoice Costing Details",
      });
    }
    if (modal === "PAYMENT") {
      setFormDataPayment(dataModelPayment);
      setModalTitle({
        title: "Add Payment",
        subTitle: "Invoice Payment Details",
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
    invcs_Options,
    listDataCost,
    invpy_Options,
    listDataPayment,
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
    //payment
    formDataPayment,
    handleChangePayment,
    handleAddToListPayment,
    handleEditPayment,
    handleDeletePayment,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useInvoice;
