import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid.js";
import { validNumber, divNumber } from "@/utils/misc.js";
import tmob_invcm from "@/models/M02/tmob_invcm.json";
import tmob_invcc from "@/models/M02/tmob_invcc.json";
import tmob_invcs from "@/models/M02/tmob_invcs.json";
import tmob_invpy from "@/models/M02/tmob_invpy.json";
const dataModel = generateDataModel(tmob_invcm);
const dataModelItem = generateDataModel(tmob_invcc);
const dataModelCost = generateDataModel(tmob_invcs);
const dataModelPayment = generateDataModel(tmob_invpy);
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { invoiceAPI } from "@/api/M02/invoiceAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";
import { partyNetworkAPI } from "@/api/M08/partyNetworkAPI.js";

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

  //costing
  const [invcs_Options, setInvcs_Options] = useState([]);
  const [listDataCost, setListDataCost] = useState([]);
  const [formDataCost, setFormDataCost] = useState({});

  //payment
  const [invpy_Options, setInvpy_Options] = useState([]);
  const [listDataPayment, setListDataPayment] = useState([]);
  const [formDataPayment, setFormDataPayment] = useState({});

  //Table Columns
  const getTabColumns = async () => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByPage({
        tabcl_cname: "SYS_SALES_INVOICE",
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
    getTabColumns();
    getAllInvoices();
  }, []);

  useEffect(() => {
    if (listDataItem.length > 0) {
      setStopEdit(true);
    } else {
      setStopEdit(false);
    }
  }, [listDataItem]);

  function reCalculate(items, master, costList, paymList) {
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
        sum + validNumber(item.invcc_itrat) * validNumber(item.invcc_itqty),
      0,
    );

    const totalQty = newItems.reduce(
      (sum, item) => sum + validNumber(item.invcc_itqty),
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
        .reduce((sum, item) => sum + validNumber(item.mrrcs_value), 0);

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
    // lines (invcc_edamt).
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
      const invcc_edamt = divNumber(
        validNumber(invoice_discount_amount) * validNumber(item.invcc_itqty),
        totalQty,
      );

      return {
        ...item,
        invcc_edamt: Number(invcc_edamt).toFixed(4),
      };
    });

    //---------------------------------------------------
    // 2. Calculate Item Values
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      const qty = validNumber(item.invcc_itqty);
      const rate = validNumber(item.invcc_itrat);

      const invcc_itamt = rate * qty;

      const invcc_dsamt = invcc_itamt * (validNumber(item.invcc_dspct) / 100);

      const afterDisc =
        invcc_itamt - (invcc_dsamt + validNumber(item.invcc_edamt));

      //AS BD NBR Rules
      let inclusive_vat = 0;
      let exclusive_vat = 0;
      if (item.invcc_vtype === "INCLUSIVE") {
        inclusive_vat = (afterDisc * validNumber(item.invcc_vtpct)) / 115;
      }

      if (item.invcc_vtype === "EXCLUSIVE") {
        exclusive_vat = (afterDisc * validNumber(item.invcc_vtpct)) / 100;
      }
      const invcc_vtamt = (
        Number(inclusive_vat || 0) + Number(exclusive_vat || 0)
      ).toFixed(4);

      //---------------------------------------------------
      // Including Cost
      //---------------------------------------------------

      const iAmtCust = afterDisc * incAmtRate;
      const iQty = qty * incQtyRate;
      const iLine = incLineRate;

      //---------------------------------------------------
      // Excluding Cost
      //---------------------------------------------------

      const eAmtCust = afterDisc * excAmtRate;
      const eQty = qty * excQtyRate;
      const eLine = excLineRate;

      const invcc_icamt = iAmtCust + iQty + iLine;
      const invcc_ecamt = eAmtCust + eQty + eLine;

      //---------------------------------------------------
      // Amount
      //---------------------------------------------------

      const invcc_pyamt = afterDisc + exclusive_vat + invcc_icamt;
      const invcc_stamt = afterDisc + exclusive_vat + invcc_icamt + invcc_ecamt;

      const invcc_nsrat = item.invcc_csrat + invcc_ecamt;

      return {
        ...item,
        invcc_itamt,
        invcc_dsamt,
        invcc_vtamt,
        invcc_icamt,
        invcc_ecamt,
        invcc_pyamt,
        invcc_stamt,
        invcc_nsrat,
      };
    });

    setListDataItem(newItems);

    //---------------------------------------------------
    // Totals Master
    //---------------------------------------------------

    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + validNumber(item.invcc_itamt),
        itmds: acc.itmds + validNumber(item.invcc_dsamt),
        vtamt: acc.vtamt + validNumber(item.invcc_vtamt),
        icamt: acc.icamt + validNumber(item.invcc_icamt),
        ecamt: acc.ecamt + validNumber(item.invcc_ecamt),
        pyamt:
          acc.pyamt +
          validNumber(item.invcc_pyamt) +
          Number(master?.invcm_lylds || 0),
        stamt: acc.stamt + validNumber(item.invcc_stamt),
        csamt: acc.csamt + validNumber(item.invcc_csamt),
        nsamt: acc.nsamt + validNumber(item.invcc_nsamt),
      }),
      {
        tramt: 0,
        itmds: 0,
        vtamt: 0,
        icamt: 0,
        ecamt: 0,
        pyamt: 0,
        stamt: 0,
        csamt: 0,
        nsamt: 0,
      },
    );

    //---------------------------------------------------
    // Payments
    //---------------------------------------------------

    const newPayments = [...(paymList || [])];

    const totalPayment = newPayments.reduce(
      (sum, item) => sum + validNumber(item.invpy_pdamt),
      0,
    );

    setListDataPayment(newPayments);

    //---------------------------------------------------
    // Master
    //---------------------------------------------------

    const duamt = totals.pyamt - totalPayment;

    setFormData({
      ...master,
      invcm_tramt: validNumber(totals.tramt).toFixed(4),
      invcm_itmds: validNumber(totals.itmds).toFixed(4),
      invcm_invds: invoice_discount_amount,
      invcm_vtamt: validNumber(totals.vtamt).toFixed(4),
      invcm_icamt: validNumber(totals.icamt).toFixed(4),
      invcm_ecamt: validNumber(totals.ecamt).toFixed(4),
      invcm_pyamt: validNumber(totals.pyamt).toFixed(4),
      invcm_pdamt: validNumber(totalPayment).toFixed(4),
      invcm_duamt: validNumber(duamt).toFixed(4),
      invcm_stamt: validNumber(totals.stamt).toFixed(4),
      invcm_csamt: validNumber(totals.csamt).toFixed(4),
      invcm_nsamt: validNumber(totals.nsamt).toFixed(4),
    });
  }

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getSales({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllContacts = async () => {
    if (cntct_Options.length > 0) {
      return;
    }
    try {
      const resp = await contactAPI.getCustomersSaleInvoice({});
      const list = resp.data || [];
      setCntct_Options(list);
    } catch (error) {}
  };

  const getExpnPaym = async () => {
    if (invcs_Options.length > 0) {
      return;
    }
    try {
      const resp = await partyNetworkAPI.getSalesInvoice({});
      const list = resp.data || [];
      const invcs = list.filter((f) => f.prtyn_ctype === "PAY_VENDOR");
      const invpy = list.filter((f) => f.prtyn_ctype === "PAY_CASH_BANK");
      setInvcs_Options(invcs);
      setInvpy_Options(invpy);
    } catch (error) {}
  };

  const getItemsByDepartment = async (id) => {
    try {
      const resp = await itemsAPI.getSalesInvoiceItemsByDpart({
        dpart_id: id,
      });
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
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
        party_id: cntct_id?.party_id,
        chtac_id: cntct_id?.chtac_id,
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

    if (f === "invcm_dpart") {
      setListDataItem([]);
      //if change department, then item list empty
      await getItemsByDepartment(v);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    getAllContacts();
    getExpnPaym();
    //await getItemsByDepartment(rowData.invcm_dpart);
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
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    setListDataCost([]);
    setListDataPayment([]);
    getAllContacts();
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
      const newErrors = validate(formData, tmob_invcm);
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

      const reqBody = {
        ...formData,
        tmob_invcc: listDataItem,
        tmob_invcs: listDataCost,
        tmob_invpy: listDataPayment,
      };

      //console.log("reqBody", reqBody);
      // return;
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
    if (f === "invcc_stock") {
      const stock_id = items_Options.find((opt) => opt.stock_id === v);
      //console.log('stock_id',stock_id)
      setFormDataItem((prev) => ({
        ...prev,
        invcc_items: stock_id?.items_id,
        invcc_price: stock_id?.price_id,
        invcc_units: stock_id?.items_runit,
        invcc_itrat: stock_id?.price_mrrat || 0,
        invcc_dspct: stock_id?.price_dspct || 0,
        invcc_vtpct: stock_id?.items_slvat || 0,
        invcc_vtype: stock_id?.items_stvat || "-",
        invcc_csrat: stock_id?.stock_cprat || 0,
        invcc_refid: stock_id?.stock_refid || 0,
        invcc_stock: stock_id?.stock_id,
        stock_ohqty: stock_id?.stock_ohqty,
        party_id: stock_id?.party_id || "-",
        chtac_id: stock_id?.chtac_id || "-",
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
    if (["", 0, "0", null, undefined].includes(formDataItem.invcc_itrat)) {
      showToast("Price is required", { type: "warning" });
      return;
    }
    const isExists = listDataItem.find(
      (f) => f.invcc_stock === formDataItem.invcc_stock,
    );
    if (isExists) {
      showToast("This stock is already added", { type: "warning" });
      return;
    }

    const qty = Number(formDataItem.invcc_itqty);
    const ohqty = Number(formDataItem.stock_ohqty);
    const stockDiff = ohqty - qty;
    if (stockDiff < 0) {
      showToast(`${stockDiff} Stock is not available`, { type: "warning" });
      return;
    }

    const items_iname = items_Options.find(
      (opt) => opt.stock_id === formDataItem.invcc_stock,
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
        party_chtac: invcs_id?.party_chtac,
        prtyn_ctype: invcs_id?.prtyn_ctype,
        prtyn_chtno: invcs_id?.prtyn_chtno,
        chtac_id: invcs_id?.party_chtac,
        party_id: v,
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
        party_chtac: invpy_id?.party_chtac,
        prtyn_ctype: invpy_id?.prtyn_ctype,
        prtyn_chtno: invpy_id?.prtyn_chtno,
        chtac_id_pay: invpy_id?.party_chtac,
        party_id_pay: invpy_id?.id,
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
    //setListDataPayment((prev) => prev.filter((item) => item.id !== rowData.id));

    const newPaymentList = listDataPayment.filter(
      (item) => item.id !== rowData.id,
    );
    reCalculate(listDataItem, formData, listDataCost, newPaymentList);
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
