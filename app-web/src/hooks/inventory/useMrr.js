import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmib_mrrmt from "@/models/inventory/tmib_mrrmt.json";
import tmib_mrrdt from "@/models/inventory/tmib_mrrdt.json";
import tmib_mrrcs from "@/models/inventory/tmib_mrrcs.json";
import tmib_mrrpy from "@/models/inventory/tmib_mrrpy.json";
const dataModel = generateDataModel(tmib_mrrmt);
const dataModelItems = generateDataModel(tmib_mrrdt);
const dataModelCosting = generateDataModel(tmib_mrrcs);
const dataModelPayment = generateDataModel(tmib_mrrpy);
import { itemsAPI } from "@/api/inventory/itemsAPI.js";
import { contactAPI } from "@/api/crm/contactAPI.js";
import { mrrAPI } from "@/api/inventory/mrrAPI.js";
import { autoJournalAPI } from "@/api/accounts/autoJournalAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const useMrr = () => {
  //hooks :: menuId M06-M04,
  //mnusr_extpr : export, mnusr_addpr : add, mnusr_edtpr : edit, mnusr_delpr : delete
  //form :: SYS_FRM_1, list :: SYS_LST_1, search :: SYS_SRC_1
  const { getPageAuth } = useAuth();
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } =
    useAppUI();
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [crTitle, setCrTitle] = useState("MRR List");
  const [crView, setCrView] = useState("SYS_LST_1");
  const [readOnly, setReadOnly] = useState(false);
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  //other states items
  const [mrrmt_cntct_Options, setMrrmt_cntct_Options] = useState([]);
  const [mrrdt_items_Options, setMrrdt_items_Options] = useState([]);
  const [dataListItems, setDataListItems] = useState([]);
  const [formDataItems, setFormDataItems] = useState(dataModelItems);
  //other states costing
  const [formDataCosting, setFormDataCosting] = useState(dataModelCosting);
  const [dataListCosting, setDataListCosting] = useState([]);
  const mrrcs_csmod_Options = [
    { label_text: "Include", value_text: "Include" },
    { label_text: "Exclude", value_text: "Exclude" },
  ];
  const mrrcs_clmod_Options = [
    { label_text: "By Value", value_text: "ByValue" },
    { label_text: "By Qty", value_text: "ByQty" },
    // { label_text: "By Weight", value_text: "ByWeight" },
    // { label_text: "Manual", value_text: "Manual" },
    // { label_text: "Equal Split", value_text: "EqualSplit" },
  ];
  const mrrcs_chead_Options = [
    { label_text: "Freight", value_text: "Freight" },
    { label_text: "Insurance", value_text: "Insurance" },
    { label_text: "Customs Duty", value_text: "CustomsDuty" },
    { label_text: "Other", value_text: "Other" },
  ];
  //other states payments
  //const [frmdataPymt, setFrmdataPymt] = useState(dataModelPymt);
  const [formDataPymt, setFormDataPymt] = useState(dataModelPayment);
  const [dataListPymt, setDataListPymt] = useState([]);
  const mrrpy_pmode_Options = [
    { label_text: "Cash", value_text: "Cash" },
    { label_text: "Bank", value_text: "Bank" },
    { label_text: "Wallet", value_text: "Wallet" },
  ];

  useEffect(() => {
    const perms = getPageAuth("M06-M04");
    setPageAuth(perms);
  }, [getPageAuth]);

  useEffect(() => {
    const loadAutoJournalByInterface = async () => {
      const resp = await autoJournalAPI.getByInterface({
        atujr_iface: "SYS_MRR_INV",
      });
      console.log("resp", resp.data || []);
    };
    loadAutoJournalByInterface();
  }, []);

  useEffect(() => {
    const items = Array.isArray(dataListItems) ? dataListItems : [];

    const mrrmt_tramt = items.reduce(
      (sum, item) => sum + Number(item.mrrdt_tramt || 0),
      0,
    );

    const mrrmt_itmds = items.reduce(
      (sum, item) => sum + Number(item.mrrdt_dsamt || 0),
      0,
    );

    // VAT amount per item
    const mrrmt_vtamt = items.reduce((sum, item) => {
      const amount = Number(item.mrrdt_tramt || 0);
      const vatPct = Number(item.mrrdt_sdvat || 0);

      return sum + (amount * vatPct) / 100;
    }, 0);

    // Tax amount per item
    const mrrmt_txamt = items.reduce((sum, item) => {
      const amount = Number(item.mrrdt_tramt || 0);
      const taxPct = Number(item.mrrdt_txpct || 0);

      return sum + (amount * taxPct) / 100;
    }, 0);

    const mrrmt_pyamt =
      mrrmt_tramt +
      Number(formData.mrrmt_icamt || 0) -
      (Number(mrrmt_itmds || 0) + Number(formData.mrrmt_invds || 0));

    setFormData((prev) => ({
      ...prev,
      mrrmt_tramt,
      mrrmt_itmds,
      mrrmt_vtamt,
      mrrmt_txamt,
      mrrmt_pyamt: mrrmt_pyamt,
      mrrmt_duamt: mrrmt_pyamt - Number(formData.mrrmt_pdamt || 0),
    }));
  }, [dataListItems]);

  useEffect(() => {
    //item costing
    const items = Array.isArray(dataListItems) ? dataListItems : [];

    const mrrdt_trqty = items.reduce(
      (sum, item) => sum + Number(item.mrrdt_trqty || 0),
      0,
    );
    const mrrdt_tramt = items.reduce(
      (sum, item) => sum + Number(item.mrrdt_tramt || 0),
      0,
    );

    const cost_qty_value = dataListCosting
      .filter((item) => item.mrrcs_clmod === "ByQty")
      .reduce((sum, item) => sum + Number(item.mrrcs_value || 0), 0);
    const cost_qty_rate = cost_qty_value / mrrdt_trqty;

    const cost_val_value = dataListCosting
      .filter((item) => item.mrrcs_clmod === "ByValue")
      .reduce((sum, item) => sum + Number(item.mrrcs_value || 0), 0);
    const cost_val_rate = cost_val_value / mrrdt_tramt;
    const mrrdt_otcst = cost_qty_rate + cost_val_rate;

    setDataListItems((prev) =>
      prev.map((item) => {
        const mrrdt_tramt = Number(item.mrrdt_tramt);
        const mrrdt_dsamt = Number(item.mrrdt_dsamt);
        const mrrdt_fxcst_amount =
          mrrdt_tramt * (Number(item.mrrdt_fxcst || 0) / 100);
        const mrrdt_csrat =
          (mrrdt_tramt + mrrdt_fxcst_amount - mrrdt_dsamt) /
          Number(item.mrrdt_trqty);

        return {
          ...item,
          mrrdt_otcst: mrrdt_otcst,
          mrrdt_csrat: mrrdt_csrat + mrrdt_otcst,
        };
      }),
    );

    //master costing
    const mrrmt_icamt = dataListCosting
      .filter((item) => item.mrrcs_csmod === "Include")
      .reduce((sum, item) => sum + Number(item.mrrcs_value || 0), 0);
    const mrrmt_ecamt = dataListCosting
      .filter((item) => item.mrrcs_csmod === "Exclude")
      .reduce((sum, item) => sum + Number(item.mrrcs_value || 0), 0);

    setFormData((prev) => ({
      ...prev,
      mrrmt_icamt: mrrmt_icamt,
      mrrmt_ecamt: mrrmt_ecamt,
    }));
  }, [dataListCosting]);

  useEffect(() => {
    // payment total
    const mrrpy_pdamt = dataListPymt.reduce(
      (sum, item) => sum + Number(item.mrrpy_pdamt || 0),
      0,
    );

    setFormData((prev) => ({
      ...prev,
      mrrmt_pdamt: mrrpy_pdamt,
      mrrmt_duamt: Number(prev.mrrmt_pyamt || 0) - mrrpy_pdamt,
    }));
  }, [dataListPymt]);

  //functions
  const loadMrr = async () => {
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getAll({ mrrmt_dpart: "dpart1" });
      //console.log("resp", resp);
      setDataList(resp.data || []);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_mrrmt);
    setErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit MRR");
    setCrView("SYS_FRM_1");
    setMrrmt_cntct_Options([
      { id: rowData.mrrmt_cntct, cntct_cntnm: rowData.cntct_cntnm },
    ]);

    setMrrdt_items_Options([]);

    setReadOnly(true);
    handleGetSavedItems(rowData.id);
    handleGetSavedCosting(rowData.id);
    handleGetSavedPayments(rowData.id);
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.price_actve ? "Deactivate" : "Activate"} this ${rowData.items_iname}?`,
      header: "Confirmation!",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        console.log("Operation is cancelled");
      },
    });
  };

  const onDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const resp = await mrrAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("MRR List");
        setCrView("list");
        loadMrr();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("MRR List");
    setCrView("SYS_LST_1");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search MRR");
    setCrView("SYS_LST_1");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("MRR List");
    setCrView("SYS_LST_1");
    loadMrr();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add MRR");
    setCrView("SYS_FRM_1");
    setFormData(dataModel);
    setFormDataItems(dataModelItems);
    setFormDataCosting(dataModelCosting);
    setFormDataPymt(dataModelPayment);
    setDataListItems([]);
    setDataListCosting([]);
    setDataListPymt([]);
    handleGetItems();
    handleGetSuppliers();
    setReadOnly(false);
    //console.log("handleSave: " , dataModel);
  };

  const handleSubmitClick = async () => {
    try {
      if (readOnly) {
        showToast("error", "Readonly", "Not allowed!");
        return;
      }
      const newErrors = validate(formData, tmib_mrrmt);
      setErrors(newErrors);
      //console.log("handleSave: ", newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (dataListItems.length === 0) {
        showToast("error", "MRR items missing", "No MRR items added yet!");
        return;
      }

      const reqBody = {
        ...formData,
        mrrmt_dpart: "dpart1",
        tmib_mrrdt: dataListItems,
        tmib_mrrpy: dataListPymt,
        tmib_mrrcs: dataListCosting,
      };

      //console.log("reqBody: ", dataListItems);
      setIsBusy(true);

      //fetch items name if not already present

      const resp = await mrrAPI.upsert(reqBody);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        //setCrTitle("MRR List");
        //setCrView("SYS_LST_1");
        //loadMrr();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //other function + items
  const handleGetSuppliers = async () => {
    // if (migrn_cntct_Options.length > 0) {
    //   return;
    // }
    try {
      setIsBusy(true);
      const resp = await contactAPI.getAllSuppliers();
      //console.log("resp", resp);
      setMrrmt_cntct_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };
  const handleGetItems = async () => {
    // if (price_items_Options.length > 0) {
    //   return;
    // }
    try {
      setIsBusy(true);
      const resp = await itemsAPI.getNewMrrItems();
      //console.log("resp", resp);
      setMrrdt_items_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeItems = (field, value) => {
    //console.log("handleChangeItems", field);
    if (value === undefined) return;
    setFormDataItems((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataItems, [field]: value },
      tmib_mrrdt,
    );
    setErrors(newErrors);

    //fill items entry fields from selected items
    if (field === "mrrdt_items") {
      const item_with_price = mrrdt_items_Options.find((item) => {
        return item.id === value;
      });
      //console.log("item_with_price", item_with_price);
      setFormDataItems((prev) => ({
        ...prev,
        mrrdt_price: item_with_price.price_id,
        sgrup_sname: item_with_price.sgrup_sname,
        items_icode: item_with_price.items_icode,
        items_iname: item_with_price.items_iname,
        runit_uname: item_with_price.runit_uname,
        punit_uname: item_with_price.punit_uname,
        items_pkqty: item_with_price.items_pkqty,
        mrrdt_trate: item_with_price.price_lprat,
        mrrdt_trqty: "",
        mrrdt_tramt: 0,
        mrrdt_dspct: item_with_price.price_dspct,
        mrrdt_dsamt: 0,
        mrrdt_sdvat: item_with_price.items_sdvat,
        mrrdt_txpct: 0,
        mrrdt_fxcst: item_with_price.items_fxcst,
        mrrdt_otcst: 0,
        mrrdt_ntamt: 0,
        mrrdt_csrat: 0,
      }));
    }
  };

  const handleAddItemsClick = async () => {
    try {
      const newErrors = validate(formDataItems, tmib_mrrdt);
      setErrors(newErrors);
      //console.log("handleSave: ", formDataItems);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const exists = dataListItems.some(
        (x) => x.mrrdt_items === formDataItems.mrrdt_items,
      );

      if (exists) {
        showToast("error", "Error", "Item already exists");
        return;
      }

      setIsBusy(true);
      const mrrdt_tramt =
        Number(formDataItems.mrrdt_trate) * Number(formDataItems.mrrdt_trqty);

      let mrrdt_dsamt = Number(formDataItems.mrrdt_dsamt || 0);
      if (Number(formDataItems.mrrdt_dspct) > 0) {
        mrrdt_dsamt = mrrdt_tramt * (Number(formDataItems.mrrdt_dspct) / 100);
      }

      //console.log("mrrdt_dsamt", mrrdt_dsamt);
      const mrrdt_fxcst_amount =
        mrrdt_tramt * (Number(formDataItems.mrrdt_fxcst || 0) / 100);

      //console.log("mrrdt_fxcst_amount", mrrdt_fxcst_amount);

      const mrrdt_csrat =
        (mrrdt_tramt + mrrdt_fxcst_amount - mrrdt_dsamt) /
        Number(formDataItems.mrrdt_trqty);

      //console.log("mrrdt_csrat", mrrdt_csrat);

      const itemBody = {
        ...formDataItems,
        mrrdt_tramt: mrrdt_tramt,
        mrrdt_dsamt: mrrdt_dsamt,
        mrrdt_csrat: mrrdt_csrat,
      };
      setDataListItems((prev) => [...prev, itemBody]);
      setFormDataItems(dataModelItems);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleRemoveItemsClick = (rowData) => {
    setDataListItems((prev) =>
      prev.filter((x) => x.mrrdt_items !== rowData.mrrdt_items),
    );
  };

  const handleGetSavedItems = async (id) => {
    setDataListItems([]);
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getMrrItems({ mrrdt_mrrmt: id });
      //console.log("resp", resp);
      setDataListItems(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetSavedCosting = async (id) => {
    setDataListCosting([]);
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getMrrCosting({ mrrcs_mrrmt: id });
      //console.log("resp", resp);
      setDataListCosting(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetSavedPayments = async (id) => {
    setDataListPymt([]);
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getMrrPayment({ mrrpy_mrrmt: id });
      //console.log("resp", resp);
      setDataListPymt(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //other function + costing

  const handleChangeCosting = (field, value) => {
    //console.log("handleChangeCosting", field);
    if (value === undefined) return;
    setFormDataCosting((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataCosting, [field]: value },
      tmib_mrrcs,
    );
    setErrors(newErrors);
  };

  const handleAddCostingClick = async () => {
    try {
      const newErrors = validate(formDataCosting, tmib_mrrcs);
      setErrors(newErrors);
      //console.log("handleSave: ", formDataItems);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const exists = dataListCosting.some(
        (x) => x.mrrcs_chead === formDataCosting.mrrcs_chead,
      );

      if (exists) {
        showToast("error", "Error", "Item already exists");
        return;
      }

      setIsBusy(true);

      const itemBody = {
        ...formDataCosting,
      };
      setDataListCosting((prev) => [...prev, itemBody]);
      setFormDataCosting(dataModelCosting);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleRemoveCostingClick = (rowData) => {
    setDataListCosting((prev) =>
      prev.filter((x) => x.mrrcs_chead !== rowData.mrrcs_chead),
    );
  };

  // other function + payments

  const handleChangePymt = (field, value) => {
    //console.log("handleChangePymt", field);
    if (value === undefined) return;
    setFormDataPymt((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formDataPymt, [field]: value }, tmib_mrrpy);
    setErrors(newErrors);
  };

  const handleAddPaymentClick = async () => {
    try {
      const newErrors = validate(formDataPymt, tmib_mrrpy);
      setErrors(newErrors);
      //console.log("handleSave: ", formDataItems);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const exists = dataListPymt.some(
        (x) => x.mrrpy_pmode === formDataPymt.mrrpy_pmode,
      );

      if (exists) {
        showToast("error", "Error", "Item already exists");
        return;
      }

      setIsBusy(true);

      const itemBody = {
        ...formDataPymt,
      };
      setDataListPymt((prev) => [...prev, itemBody]);
      setFormDataPymt(dataModelPayment);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleRemovePaymentClick = (rowData) => {
    setDataListPymt((prev) =>
      prev.filter((x) => x.mrrpy_pmode !== rowData.mrrpy_pmode),
    );
  };

  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    readOnly,
    formData,
    errors,
    dataList,
    //other states
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //other functions
    //entry forms + items
    mrrmt_cntct_Options,
    mrrdt_items_Options,
    dataListItems,
    formDataItems,
    handleChangeItems,
    handleAddItemsClick,
    handleRemoveItemsClick,
    //costing forms + costing items
    formDataCosting,
    dataListCosting,
    mrrcs_csmod_Options,
    mrrcs_clmod_Options,
    mrrcs_chead_Options,
    handleChangeCosting,
    handleAddCostingClick,
    handleRemoveCostingClick,
    //payment forms + payment items
    formDataPymt,
    dataListPymt,
    mrrpy_pmode_Options,
    handleChangePymt,
    handleAddPaymentClick,
    handleRemovePaymentClick,
  };
};
export default useMrr;
