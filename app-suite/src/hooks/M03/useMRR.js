import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid.js";
import { validNumber, divNumber } from "@/utils/misc.js";
import tmpb_mrrdm from "@/models/M03/tmpb_mrrdm.json";
import tmpb_mrrdc from "@/models/M03/tmpb_mrrdc.json";
import tmpb_mrrcs from "@/models/M03/tmpb_mrrcs.json";
import tmpb_mrrpy from "@/models/M03/tmpb_mrrpy.json";
const dataModel = generateDataModel(tmpb_mrrdm);
const dataModelItem = generateDataModel(tmpb_mrrdc);
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { mrrAPI } from "@/api/M03/mrrAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { bundleAPI } from "@/api/M04/bundleAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";

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
  const [mrrcs_Options, setMrrcs_Options] = useState([]);
  const [listDataCost, setListDataCost] = useState([]);
  const [formDataCost, setFormDataCost] = useState({});

  //payment
  const [mrrpy_Options, setMrrpy_Options] = useState([]);
  const [listDataPayment, setListDataPayment] = useState([]);
  const [formDataPayment, setFormDataPayment] = useState({});

  //bundle
  const [listDataBundle, setListDataBundle] = useState([]);

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
  const getAllMRR = async () => {
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getAll({});
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
    getAllMRR();
  }, []);

  useEffect(() => {
    if (listDataItem.length > 0) {
      setStopEdit(true);
    } else {
      setStopEdit(false);
    }
  }, [listDataItem]);

  const getBundleItem = async (items) => {
    try {
      // 1. Accumulate quantity by item + price
      const grouped = new Map();
      for (const item of items) {
        const key = `${item.mrrdc_items}_${item.mrrdc_price}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            items_id: item.mrrdc_items,
            price_id: item.mrrdc_price,
            order_itqty: 0,
          });
        }

        grouped.get(key).order_itqty += Number(item.mrrdc_itqty || 0);
      }

      const retResp = [...grouped.values()];
      //console.log("retResp", retResp);
      //return;

      // 2. Call API
      const resp = await bundleAPI.getBundlePurchaseByItemId({
        bndlm_dpart: formData.mrrdm_dpart,
        bndlc_items: retResp,
      });
      const list = resp.data || [];
      //console.log("bundle definitions", list);

      // 3. Apply bundle logic
      const bundleList = list
        .map((bundle) => {
          // Find accumulated cart quantity for this bundle
          const cartItem = retResp.find(
            (item) =>
              item.items_id === bundle.mrrdf_itemm &&
              item.price_id === bundle.mrrdf_pricm,
          );
          //console.log("cartItem", cartItem);
          //console.log("bundle", bundle);

          if (!cartItem) {
            return null;
          }

          const purchasedQty = Number(cartItem.order_itqty || 0);
          const requiredQty = Number(bundle.mrrdf_bnqty || 0);
          const freeQtyPerBundle = Number(bundle.mrrdf_pkqty || 0);

          // Prevent division by zero
          if (requiredQty <= 0 || freeQtyPerBundle <= 0) {
            return null;
          }

          // How many times the customer qualifies
          const offerCount = Math.floor(purchasedQty / requiredQty);

          // Customer doesn't qualify
          if (offerCount <= 0) {
            return null;
          }

          // Total free quantity
          const offerPackQty = offerCount * freeQtyPerBundle;

          return {
            ...bundle,

            // Cart quantity accumulated for this item/variant
            //purchased_qty: purchasedQty,
            mrrdf_trqty: purchasedQty,

            // Example: buy 2, customer buys 5 => 2 offer groups
            mrrdf_ofcnt: offerCount,

            // Example: 2 groups × 1 free = 2 free
            mrrdf_ofqty: offerPackQty,
          };
        })
        .filter(Boolean);
      //console.log("bundleList", bundleList);
      setListDataBundle(bundleList);
    } catch (error) {
      console.error("getBundleItem error:", error);
      setListDataBundle([]);
    }
  };

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
        sum + validNumber(item.mrrdc_itrat) * validNumber(item.mrrdc_itqty),
      0,
    );

    const totalQty = newItems.reduce(
      (sum, item) => sum + validNumber(item.mrrdc_itqty),
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
    //   A) Percentage mode (mrrdm_dspct > 0): the % is auto-filled from the supplier
    //      (cntct_dspct) when mrrdm_cntct changes, or entered directly. The amount is
    //      DERIVED from it: amount = totalAmount * pct / 100, and mrrdm_invds is a
    //      read-only display value (the field is disabled in the form while pct > 0).
    //   B) Amount mode (mrrdm_dspct === 0): the user types the discount amount directly
    //      into mrrdm_invds. The value is used as-is (kept raw, never reformatted),
    //      because re-formatting it to 4 decimals mid-typing would break the input.
    // The effective amount computed here is then split proportionally across the item
    // lines (mrrdc_edamt).
    // write the effective discount amount back: computed (formatted) in % mode,
    // or the raw user-typed value (unformatted, so typing stays usable) in amount mode
    const invoice_discount_pct = Number(master?.mrrdm_dspct || 0);
    let invoice_discount_amount = 0;
    if (invoice_discount_pct > 0) {
      invoice_discount_amount = (totalAmount * invoice_discount_pct) / 100;
    } else {
      invoice_discount_amount = master?.mrrdm_invds;
    }

    newItems = newItems.map((item) => {
      const mrrdc_edamt = divNumber(
        validNumber(invoice_discount_amount) * validNumber(item.mrrdc_itqty),
        totalQty,
      );

      return {
        ...item,
        mrrdc_edamt: Number(mrrdc_edamt).toFixed(4),
      };
    });

    //---------------------------------------------------
    // 2. Calculate Item Values
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      const qty = validNumber(item.mrrdc_itqty);
      const rate = validNumber(item.mrrdc_itrat);

      const mrrdc_itamt = rate * qty;

      const mrrdc_dsamt = mrrdc_itamt * (validNumber(item.mrrdc_dspct) / 100);

      const afterDisc =
        mrrdc_itamt - (mrrdc_dsamt + validNumber(item.mrrdc_edamt));

      //AS BD NBR Rules
      let inclusive_vat = 0;
      let exclusive_vat = 0;
      if (item.mrrdc_vtype === "INCLUSIVE") {
        inclusive_vat = (afterDisc * validNumber(item.mrrdc_vtpct)) / 115;
      }

      if (item.mrrdc_vtype === "EXCLUSIVE") {
        exclusive_vat = (afterDisc * validNumber(item.mrrdc_vtpct)) / 100;
      }
      const mrrdc_vtamt = (
        Number(inclusive_vat || 0) + Number(exclusive_vat || 0)
      ).toFixed(4);

      //---------------------------------------------------
      // Including Cost
      //---------------------------------------------------

      const iAmt = afterDisc * incAmtRate;
      const iQty = qty * incQtyRate;
      const iLine = incLineRate;

      //---------------------------------------------------
      // Excluding Cost
      //---------------------------------------------------

      const eAmt = afterDisc * excAmtRate;
      const eQty = qty * excQtyRate;
      const eLine = excLineRate;

      const mrrdc_icamt = iAmt + iQty + iLine;
      const mrrdc_ecamt = eAmt + eQty + eLine;

      //---------------------------------------------------
      // Amount
      //---------------------------------------------------

      const mrrdc_pyamt = afterDisc + exclusive_vat + mrrdc_icamt;
      const mrrdc_stamt = afterDisc + exclusive_vat + mrrdc_icamt + mrrdc_ecamt;

      const mrrdc_csrat = divNumber(
        afterDisc - inclusive_vat + mrrdc_icamt + mrrdc_ecamt,
        qty,
      );

      return {
        ...item,
        mrrdc_itamt,
        mrrdc_dsamt,
        mrrdc_vtamt,
        mrrdc_icamt,
        mrrdc_ecamt,
        mrrdc_pyamt,
        mrrdc_stamt,
        mrrdc_csrat,
      };
    });

    setListDataItem(newItems);

    //---------------------------------------------------
    // Totals Master
    //---------------------------------------------------

    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + validNumber(item.mrrdc_itamt),
        itmds: acc.itmds + validNumber(item.mrrdc_dsamt),
        vtamt: acc.vtamt + validNumber(item.mrrdc_vtamt),
        icamt: acc.icamt + validNumber(item.mrrdc_icamt),
        ecamt: acc.ecamt + validNumber(item.mrrdc_ecamt),
        pyamt: acc.pyamt + validNumber(item.mrrdc_pyamt),
        stamt: acc.stamt + validNumber(item.mrrdc_stamt),
        csamt:
          acc.csamt +
          validNumber(item.mrrdc_csrat) * validNumber(item.mrrdc_itqty),
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
      },
    );

    //---------------------------------------------------
    // Payments
    //---------------------------------------------------

    const newPayments = [...(paymList || [])];

    const totalPayment = newPayments.reduce(
      (sum, item) => sum + validNumber(item.mrrpy_pdamt),
      0,
    );

    setListDataPayment(newPayments);

    //---------------------------------------------------
    // Master
    //---------------------------------------------------

    const duamt = totals.pyamt - totalPayment;

    setFormData({
      ...master,
      mrrdm_tramt: validNumber(totals.tramt).toFixed(4),
      mrrdm_itmds: validNumber(totals.itmds).toFixed(4),
      mrrdm_invds: invoice_discount_amount,
      mrrdm_vtamt: validNumber(totals.vtamt).toFixed(4),
      mrrdm_icamt: validNumber(totals.icamt).toFixed(4),
      mrrdm_ecamt: validNumber(totals.ecamt).toFixed(4),
      mrrdm_pyamt: validNumber(totals.pyamt).toFixed(4),
      mrrdm_pdamt: validNumber(totalPayment).toFixed(4),
      mrrdm_duamt: validNumber(duamt).toFixed(4),
      mrrdm_stamt: validNumber(totals.stamt).toFixed(4),
      mrrdm_csamt: validNumber(totals.csamt).toFixed(4),
    });

    //find bundle items
    getBundleItem(newItems);
  }

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getPurchase({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getAllContacts = async () => {
    if (cntct_Options.length > 0) {
      return;
    }
    try {
      const resp = await contactAPI.getSuppliersMrr();
      const list = resp.data || [];
      setCntct_Options(list);
    } catch (error) {}
  };

  const getExpnPaym = async () => {
    if (mrrcs_Options.length > 0) {
      return;
    }
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
      setMrrcs_Options(mrrcs);
      const listActive = mrrpy.filter((f) => validNumber(f.party_crbal) > 0);
      setMrrpy_Options(listActive);
    } catch (error) {}
  };

  const getMrrItems = async (id, dpart_id) => {
    try {
      const resp = await itemsAPI.getMrrItems({
        cntct_id: id,
        price_dpart: dpart_id,
      });
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmpb_mrrdm);
    setFormErrors(newErrors);

    if (f === "mrrdm_cntct") {
      const cntct_id = cntct_Options.find((opt) => opt.id === v);
      const dspct = cntct_id?.cntct_dspct || 0;
      const newformData = {
        ...formData,
        mrrdm_cntct: v,
        mrrdm_dspct: dspct,
        party_id: cntct_id?.party_id,
        chtac_id: cntct_id?.chtac_id,
        // new supplier has no discount % -> clear any stale computed amount
        ...(dspct === 0 ? { mrrdm_invds: 0 } : {}),
      };
      reCalculate(listDataItem, newformData, listDataCost, listDataPayment);
      await getMrrItems(v, formData.mrrdm_dpart);
    }
    if (f === "mrrdm_invds" || f === "mrrdm_dspct") {
      const newformData = {
        ...formData,
        [f]: v,
        // % cleared -> also clear the derived/stale amount
        ...(f === "mrrdm_dspct" && Number(v) === 0 ? { mrrdm_invds: 0 } : {}),
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
    getExpnPaym();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [dtResp, csResp, pyResp, dtOfr] = await Promise.all([
        mrrAPI.getDetailsByMasterId({ mrrdc_mrrdm: id }),
        mrrAPI.getCostsByMasterId({ mrrcs_mrrdm: id }),
        mrrAPI.getPaymentsByMasterId({ mrrpy_mrrdm: id }),
        mrrAPI.getBundlesByMasterId({ mrrdf_mrrdm: id }),
      ]);
      setListDataItem(dtResp.data || []);
      setListDataCost(csResp.data || []);
      setListDataPayment(pyResp.data || []);
      setListDataBundle(dtOfr.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    if (rowData.mrrdm_ispst) {
      showToast("MRR is posted. Cannot delete.", { type: "warning" });
      return;
    }

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
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    setListDataCost([]);
    setListDataPayment([]);
    setListDataBundle([]);
    getAllContacts();
    getAllDepartments();
    getExpnPaym();
    //getMrrItems();
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
      //console.log(formData);
      //console.log(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (listDataItem.length === 0) {
        showToast("At least 1 item is required", { type: "warning" });
        return;
      }

      if (validNumber(formData.mrrdm_duamt) < 0) {
        showToast(`${formData.mrrdm_duamt} Overpaid is not valid`, {
          type: "warning",
        });
        return;
      }

      const reqBody = {
        ...formData,
        tmpb_mrrdc: listDataItem,
        tmpb_mrrcs: listDataCost,
        tmpb_mrrpy: listDataPayment,
        tmpb_mrrdf: listDataBundle,
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

  const handleChangeItem = async (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmpb_mrrdc);
    setFormErrors(newErrors);
    if (f === "mrrdc_price") {
      const price_id = items_Options.find((opt) => opt.price_id === v);
      //console.log("mrrdc_price", price_id);
      setFormDataItem((prev) => ({
        ...prev,
        mrrdc_items: price_id?.id,
        mrrdc_price: v,
        mrrdc_units: price_id?.items_runit,
        mrrdc_itrat: price_id?.price_lprat || 0,
        mrrdc_vtpct: price_id?.items_prvat || 0,
        mrrdc_vtype: price_id?.items_ptvat || "-",
        party_id: price_id?.party_id || "-",
        chtac_id: price_id?.chtac_id || "-",
      }));
    }
  };

  const handleAddToListItem = (value) => {
    const newErrors = validate(formDataItem, tmpb_mrrdc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (validNumber(formDataItem.mrrdc_itqty) <= 0.1) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }
    if (validNumber(formDataItem.mrrdc_itrat) <= 0) {
      showToast("Price is required", { type: "warning" });
      return;
    }

    if (formDataItem.mrrdc_vtype === "EXEMPT") {
      if (validNumber(formDataItem.mrrdc_vtpct) !== 0) {
        showToast("Purchase VAT % must be 0 for EXEMPT", { type: "danger" });
        return;
      }
    } else {
      if (validNumber(formDataItem.mrrdc_vtpct) === 0) {
        showToast("Purchase VAT % must not be 0", { type: "danger" });
        return;
      }
    }

    const items_iname = items_Options.find(
      (opt) => opt.price_id === formDataItem.mrrdc_price,
    );
    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      items_iname: items_iname?.price_cname || "Invalid Item",
      runit_uname: items_iname?.runit_uname || "Invalid Unit",
      sunit_cname: items_iname?.sunit_cname || "Invalid Unit",
      items_szqty: items_iname?.items_szqty || "0",
      mrrdc_actve: true,
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
    const newErrors = validate({ ...formDataCost, [f]: v }, tmpb_mrrcs);
    setFormErrors(newErrors);
    //console.log(f, v);
    if (f === "mrrcs_party") {
      const mrrcs_id = mrrcs_Options.find((opt) => opt.id === v);
      //console.log("mrrcs_id", mrrcs_id);
      setFormDataCost((prev) => ({
        ...prev,
        party_cname: mrrcs_id?.party_cname,
        mrrcs_party: v,
        chtac_chtno: mrrcs_id?.chtac_chtno,
        chtac_id: mrrcs_id?.party_chtac,
        party_id: v,
      }));
    }
  };

  const handleAddToListCost = () => {
    const newErrors = validate(formDataCost, tmpb_mrrcs);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const isExists = listDataCost.find(
      (f) => f.party_id === formDataCost.mrrcs_party,
    );
    if (isExists) {
      showToast("This Cost is already added", { type: "warning" });
      return;
    }

    if (validNumber(formDataCost.mrrcs_value) < 0.01) {
      showToast("Amount is required", { type: "warning" });
      return;
    }

    const party_cname = mrrcs_Options.find(
      (opt) => opt.id === formDataCost.mrrcs_party,
    );

    //create new row
    const newItem = {
      ...formDataCost,
      id: generateGuid(),
      party_cname: party_cname?.party_cname || "Invalid Item",
      mrrcs_actve: true,
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
    const newErrors = validate({ ...formDataPayment, [f]: v }, tmpb_mrrpy);
    setFormErrors(newErrors);
    if (f === "mrrpy_party") {
      const mrrpy_id = mrrpy_Options.find((opt) => opt.id === v);
      //console.log("mrrpy_id", mrrpy_id);
      setFormDataPayment((prev) => ({
        ...prev,
        party_cname: mrrpy_id?.party_cname,
        party_crbal: mrrpy_id?.party_crbal,
        mrrpy_pdamt: formData.mrrdm_duamt, //too optional
        mrrpy_party: v,
        chtac_chtno: mrrpy_id?.chtac_chtno,
        chtac_id: mrrpy_id?.party_chtac,
        party_id: v,
      }));
    }
  };

  const handleAddToListPayment = () => {
    const newErrors = validate(formDataPayment, tmpb_mrrpy);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    const isExists = listDataPayment.find(
      (f) => f.party_id_pay === formDataPayment.party_id_pay,
    );
    if (isExists) {
      showToast("This payment is already added", { type: "warning" });
      return;
    }
    if (validNumber(formDataPayment.mrrpy_pdamt) < 0.01) {
      showToast("Amount is required", { type: "warning" });
      return;
    }
    const party_cname = mrrpy_Options.find(
      (opt) => opt.id === formDataPayment.mrrpy_party,
    );
    //console.log("party_cname", party_cname);

    const overpaidAmount =
      validNumber(formDataPayment.mrrpy_pdamt) -
      validNumber(party_cname.party_crbal);
    if (overpaidAmount > 0) {
      showToast(`${overpaidAmount} Overpaid is not valid`, { type: "warning" });
      return;
    }

    //create new row
    const newItem = {
      ...formDataPayment,
      id: generateGuid(),
      party_cname: party_cname?.party_cname || "Invalid Item",
      mrrpy_actve: true,
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
        subTitle: "MRR Item Details",
      });
    }
    if (modal === "COSTING") {
      setFormDataCost(dataModelItem);
      setModalTitle({
        title: "Add Costing",
        subTitle: "MRR Costing Details",
      });
    }
    if (modal === "PAYMENT") {
      setFormDataPayment(dataModelItem);
      setModalTitle({
        title: "Add Payment",
        subTitle: "MRR Payment Details",
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
    mrrcs_Options,
    listDataCost,
    mrrpy_Options,
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
    //bundle
    listDataBundle,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useMRR;
