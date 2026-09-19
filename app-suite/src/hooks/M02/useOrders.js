import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid.js";
import { validNumber, divNumber } from "@/utils/misc.js";
import tmob_odrdm from "@/models/M02/orders/tmob_odrdm.json";
import tmob_odrdc from "@/models/M02/orders/tmob_odrdc.json";
import tmob_odrcs from "@/models/M02/orders/tmob_odrcs.json";
import tmob_odrpy from "@/models/M02/orders/tmob_odrpy.json";
const dataModel = generateDataModel(tmob_odrdm);
const dataModelItem = generateDataModel(tmob_odrdc);
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { ordersAPI } from "@/api/M02/ordersAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { bundleAPI } from "@/api/M04/bundleAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";

const useOrders = () => {
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
  const [emply_Options, setEmply_Options] = useState([]);

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

  //from PO
  const [fromPO, setFormPO] = useState(false);

  //Table Columns
  const getTabColumns = async () => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByPage({
        tabcl_cname: "SYS_SALES_ORDER",
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
      const resp = await ordersAPI.getAll({});
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

  useEffect(() => {
    if (fromPO) {
      const addedItemIds = new Set(
        listDataItem.map((item) => item.odrdc_refid),
      );

      const availableItems = allItems.filter(
        (item) => !addedItemIds.has(item.price_refid),
      );

      setItems_Options(availableItems);
    }
  }, [allItems, listDataItem]);

  const getBundleItem = async (items) => {
    try {
      // 1. Accumulate quantity by item + price
      const grouped = new Map();
      for (const item of items) {
        const key = `${item.odrdc_items}_${item.odrdc_price}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            items_id: item.odrdc_items,
            price_id: item.odrdc_price,
            order_itqty: 0,
          });
        }

        grouped.get(key).order_itqty += Number(item.odrdc_itqty || 0);
      }

      const retResp = [...grouped.values()];
      //console.log("retResp", retResp);
      //return;

      // 2. Call API
      const resp = await bundleAPI.getBundlePurchaseByItemId({
        bndlm_dpart: formData.odrdm_dpart,
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
        sum + validNumber(item.odrdc_itrat) * validNumber(item.odrdc_itqty),
      0,
    );

    const totalQty = newItems.reduce(
      (sum, item) => sum + validNumber(item.odrdc_itqty),
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
    //   A) Percentage mode (odrdm_dspct > 0): the % is auto-filled from the supplier
    //      (cntct_dspct) when odrdm_cntct changes, or entered directly. The amount is
    //      DERIVED from it: amount = totalAmount * pct / 100, and odrdm_invds is a
    //      read-only display value (the field is disabled in the form while pct > 0).
    //   B) Amount mode (odrdm_dspct === 0): the user types the discount amount directly
    //      into odrdm_invds. The value is used as-is (kept raw, never reformatted),
    //      because re-formatting it to 4 decimals mid-typing would break the input.
    // The effective amount computed here is then split proportionally across the item
    // lines (odrdc_edamt).
    // write the effective discount amount back: computed (formatted) in % mode,
    // or the raw user-typed value (unformatted, so typing stays usable) in amount mode
    const invoice_discount_pct = Number(master?.odrdm_dspct || 0);
    let invoice_discount_amount = 0;
    if (invoice_discount_pct > 0) {
      invoice_discount_amount = (totalAmount * invoice_discount_pct) / 100;
    } else {
      invoice_discount_amount = master?.odrdm_invds;
    }

    newItems = newItems.map((item) => {
      const odrdc_edamt = divNumber(
        validNumber(invoice_discount_amount) * validNumber(item.odrdc_itqty),
        totalQty,
      );

      return {
        ...item,
        odrdc_edamt: Number(odrdc_edamt).toFixed(4),
      };
    });

    //---------------------------------------------------
    // 2. Calculate Item Values
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      const qty = validNumber(item.odrdc_itqty);
      const rate = validNumber(item.odrdc_itrat);

      const odrdc_itamt = rate * qty;

      const odrdc_dsamt = odrdc_itamt * (validNumber(item.odrdc_dspct) / 100);

      const afterDisc =
        odrdc_itamt - (odrdc_dsamt + validNumber(item.odrdc_edamt));

      //AS BD NBR Rules
      let inclusive_vat = 0;
      let exclusive_vat = 0;
      if (item.odrdc_vtype === "INCLUSIVE") {
        inclusive_vat = (afterDisc * validNumber(item.odrdc_vtpct)) / 115;
      }

      if (item.odrdc_vtype === "EXCLUSIVE") {
        exclusive_vat = (afterDisc * validNumber(item.odrdc_vtpct)) / 100;
      }
      const odrdc_vtamt = (
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

      const odrdc_icamt = iAmt + iQty + iLine;
      const odrdc_ecamt = eAmt + eQty + eLine;

      //---------------------------------------------------
      // Amount
      //---------------------------------------------------

      const odrdc_pyamt = afterDisc + exclusive_vat + odrdc_icamt;
      const odrdc_stamt = afterDisc + exclusive_vat + odrdc_icamt + odrdc_ecamt;

      const odrdc_csrat = divNumber(
        afterDisc - inclusive_vat + odrdc_icamt + odrdc_ecamt,
        qty,
      );

      return {
        ...item,
        odrdc_itamt,
        odrdc_dsamt,
        odrdc_vtamt,
        odrdc_icamt,
        odrdc_ecamt,
        odrdc_pyamt,
        odrdc_stamt,
        odrdc_csrat,
      };
    });

    setListDataItem(newItems);

    //---------------------------------------------------
    // Totals Master
    //---------------------------------------------------

    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + validNumber(item.odrdc_itamt),
        itmds: acc.itmds + validNumber(item.odrdc_dsamt),
        vtamt: acc.vtamt + validNumber(item.odrdc_vtamt),
        icamt: acc.icamt + validNumber(item.odrdc_icamt),
        ecamt: acc.ecamt + validNumber(item.odrdc_ecamt),
        pyamt: acc.pyamt + validNumber(item.odrdc_pyamt),
        stamt: acc.stamt + validNumber(item.odrdc_stamt),
        csamt:
          acc.csamt +
          validNumber(item.odrdc_csrat) * validNumber(item.odrdc_itqty),
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
      odrdm_tramt: validNumber(totals.tramt).toFixed(4),
      odrdm_itmds: validNumber(totals.itmds).toFixed(4),
      odrdm_invds: invoice_discount_amount,
      odrdm_vtamt: validNumber(totals.vtamt).toFixed(4),
      odrdm_icamt: validNumber(totals.icamt).toFixed(4),
      odrdm_ecamt: validNumber(totals.ecamt).toFixed(4),
      odrdm_pyamt: validNumber(totals.pyamt).toFixed(4),
      odrdm_pdamt: validNumber(totalPayment).toFixed(4),
      odrdm_duamt: validNumber(duamt).toFixed(4),
      odrdm_stamt: validNumber(totals.stamt).toFixed(4),
      odrdm_csamt: validNumber(totals.csamt).toFixed(4),
    });

    //find bundle items
    getBundleItem(newItems);
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
      const resp = await contactAPI.getCustomersSalesOrder();
      const list = resp.data || [];
      setCntct_Options(list);
    } catch (error) {}
  };

  const getPostEmployee = async () => {
    if (emply_Options.length > 0) {
      return;
    }
    try {
      const resp = await coaNetworkAPI.getSalesOrderPostedBy({});
      const list = resp.data || [];
      setEmply_Options(list);
      //console.log("list",list)
    } catch (error) {}
  };

  const getExpnPaym = async () => {
    // if (mrrcs_Options.length > 0) {
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
      setMrrcs_Options(mrrcs);
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
      setMrrcs_Options(mrrcs);
      const listActive = mrrpy.filter((f) => validNumber(f.party_crbal) > 0);
      setMrrpy_Options(listActive);
    } catch (error) {}
  };

  const getItemsByDepartment = async (id) => {
    try {
      const resp = await itemsAPI.getSalesOrderItems({
        dpart_id: id,
      });
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmob_odrdm);
    setFormErrors(newErrors);

    if (f === "odrdm_cntct") {
      const cntct_id = cntct_Options.find((opt) => opt.id === v);
      const dspct = cntct_id?.cntct_dspct || 0;
      const newformData = {
        ...formData,
        odrdm_cntct: v,
        odrdm_dspct: dspct,
        party_id: cntct_id?.party_id,
        chtac_id: cntct_id?.chtac_id,
        // new supplier has no discount % -> clear any stale computed amount
        ...(dspct === 0 ? { odrdm_invds: 0 } : {}),
      };
      reCalculate(listDataItem, newformData, listDataCost, listDataPayment);
      await getPOExpnPaym(v, formData.odrdm_dpart);
    }
    if (f === "odrdm_invds" || f === "odrdm_dspct") {
      const newformData = {
        ...formData,
        [f]: v,
        // % cleared -> also clear the derived/stale amount
        ...(f === "odrdm_dspct" && Number(v) === 0 ? { odrdm_invds: 0 } : {}),
      };
      reCalculate(listDataItem, newformData, listDataCost, listDataPayment);
    }
    if (f === "odrdm_dpart") {
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
    setFormPO(false);
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [dtResp, csResp, pyResp, dtOfr] = await Promise.all([
        ordersAPI.getDetailsByMasterId({ odrdc_odrdm: id }),
        ordersAPI.getCostsByMasterId({ mrrcs_odrdm: id }),
        ordersAPI.getPaymentsByMasterId({ mrrpy_odrdm: id }),
        ordersAPI.getBundlesByMasterId({ mrrdf_odrdm: id }),
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
    if (rowData.odrdm_ispst) {
      showToast("MRR is posted. Cannot delete.", { type: "warning" });
      return;
    }

    const isActive = rowData.odrdm_actve;
    const dataName = rowData.odrdm_trnno;
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
      const resp = await ordersAPI.delete(rowData);
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
      odrdm_ttype: "Sales Order",
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    setListDataCost([]);
    setListDataPayment([]);
    setListDataBundle([]);
    setItems_Options([]);
    getAllContacts();
    getAllDepartments();
    getExpnPaym();
    getPostEmployee();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setFormPO(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmob_odrdm);
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

      if (validNumber(formData.odrdm_duamt) < 0) {
        showToast(`${formData.odrdm_duamt} Overpaid is not valid`, {
          type: "warning",
        });
        return;
      }

      if (fromPO && validNumber(formData.odrdm_pdamt) < 0.1) {
        const confirmation = await confirmBox({
          title: "With PO → MRR without payment",
          message: `This MRR has no payment or adjust with Supplier advance. Are you want to continue?`,
          confirmText: "Continue",
          variant: "danger",
        });
        if (!confirmation) return;
      }

      const reqBody = {
        ...formData,
        fromPO,
        tmob_odrdc: listDataItem,
        tmob_odrcs: listDataCost,
        tmob_odrpy: listDataPayment,
        tmob_odrdf: listDataBundle,
      };

      // console.log(reqBody);
      // return;
      setIsBusy(true);
      const resp = await ordersAPI.upsert(reqBody);
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
    const newErrors = validate({ ...formDataItem, [f]: v }, tmob_odrdc);
    setFormErrors(newErrors);
    if (f === "odrdc_stock") {
      const price_id = items_Options.find((opt) => opt.stock_id === v);
      //console.log("price_id", price_id);
      let defQty = 1;
      setFormDataItem((prev) => ({
        ...prev,
        odrdc_items: price_id?.items_id,
        odrdc_price: price_id?.price_id,
        odrdc_units: price_id?.items_runit,
        odrdc_itrat: price_id?.price_mrrat || 0,
        odrdc_vtpct: price_id?.items_slvat || 0,
        odrdc_vtype: price_id?.items_stvat || "-",
        party_id: price_id?.party_id || "-",
        chtac_id: price_id?.chtac_id || "-",
        odrdc_refid: price_id?.stock_id || "-",
        refid_trnno: price_id?.stock_trnno || "-",
        odrdc_itqty: defQty,
        items_iname: price_id?.items_iname || "Invalid Item",
        price_cname: price_id?.price_cname || "Invalid Item",
        runit_cname: price_id?.runit_cname || "Invalid Retail Unit",
        items_pkqty: price_id?.items_pkqty || 1,
        punit_cname: price_id?.punit_cname || "Invalid Pack Unit",
        items_szqty: price_id?.items_szqty || 1,
        sunit_cname: price_id?.sunit_cname || "Invalid Size Unit",
        sgrup_cname: price_id?.sgrup_cname || "Invalid Sub Group",
        scatg_cname: price_id?.scatg_cname || "Invalid Sub Category",
        brand_cname: price_id?.brand_cname || "Invalid Brand",
        odrdc_actve: true,
      }));
    }
  };

  const handleAddToListItem = (value) => {
    const newErrors = validate(formDataItem, tmob_odrdc);
    setFormErrors(newErrors);
    console.log("newErrors", newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (validNumber(formDataItem.odrdc_itqty) <= 0.1) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }
    if (validNumber(formDataItem.odrdc_itrat) <= 0) {
      showToast("Price is required", { type: "warning" });
      return;
    }

    if (formDataItem.odrdc_vtype === "EXEMPT") {
      if (validNumber(formDataItem.odrdc_vtpct) !== 0) {
        showToast("Purchase VAT % must be 0 for EXEMPT", { type: "danger" });
        return;
      }
    } else {
      if (validNumber(formDataItem.odrdc_vtpct) === 0) {
        showToast("Purchase VAT % must not be 0", { type: "danger" });
        return;
      }
    }

    // const items_iname = items_Options.find(
    //   (opt) => opt.price_refid === formDataItem.odrdc_refid,
    // );
    //console.log("items_iname", items_iname);
    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
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
    const newErrors = validate({ ...formDataCost, [f]: v }, tmob_odrcs);
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
    const newErrors = validate(formDataCost, tmob_odrcs);
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
    const newErrors = validate({ ...formDataPayment, [f]: v }, tmob_odrpy);
    setFormErrors(newErrors);
    if (f === "mrrpy_party") {
      const mrrpy_id = mrrpy_Options.find((opt) => opt.id === v);
      //console.log("mrrpy_id", mrrpy_id);
      setFormDataPayment((prev) => ({
        ...prev,
        party_cname: mrrpy_id?.party_cname,
        party_crbal: mrrpy_id?.party_crbal,
        mrrpy_pdamt: formData.odrdm_duamt, //too optional
        mrrpy_party: v,
        chtac_chtno: mrrpy_id?.chtac_chtno,
        chtac_id: mrrpy_id?.party_chtac,
        party_id: v,
      }));
    }
  };

  const handleAddToListPayment = () => {
    const newErrors = validate(formDataPayment, tmob_odrpy);
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

  //from PO
  const handleAddFromPO = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData({
      ...dataModel,
      odrdm_ttype: "Material Receipt Report",
    });
    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    setListDataCost([]);
    setListDataPayment([]);
    setListDataBundle([]);
    setItems_Options([]);
    //getAllContacts();
    getAllDepartments();
    //getExpnPaym();
    setFormPO(true);
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
    emply_Options,
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
    //from PO
    handleAddFromPO,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useOrders;
