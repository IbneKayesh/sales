import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid.js";
import { validNumber, divNumber } from "@/utils/misc.js";
import tmib_adjsm from "@/models/M04/tmib_adjsm.json";
import tmib_adjsc from "@/models/M04/tmib_adjsc.json";
const dataModel = generateDataModel(tmib_adjsm);
const dataModelItem = generateDataModel(tmib_adjsc);
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { itemsAPI } from "@/api/M04/itemsAPI.js";
import { adjustmentsAPI } from "@/api/M04/adjustmentsAPI.js";

const useAdjustment = () => {
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
  const [items_Options, setItems_Options] = useState([]);

  //Table Columns
  const getTabColumns = async () => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByPage({
        tabcl_cname: "SYS_INVENTORY_ADJUSTMENT",
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
      const resp = await adjustmentsAPI.getAll({});
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

  function reCalculate(items, master) {
    //console.log("items", items);

    // Clone
    let newItems = [...(items || [])];

    //---------------------------------------------------
    // Totals
    //---------------------------------------------------
    const totalAmount = newItems.reduce(
      (sum, item) =>
        sum + validNumber(item.adjsc_itrat) * validNumber(item.adjsc_itqty),
      0,
    );

    const totalQty = newItems.reduce(
      (sum, item) => sum + validNumber(item.adjsc_itqty),
      0,
    );

    const totalLine = newItems.length;

    //---------------------------------------------------
    // 2. Calculate Item Values
    //---------------------------------------------------

    newItems = newItems.map((item) => {
      const qty = validNumber(item.adjsc_itqty);
      const rate = validNumber(item.adjsc_itrat);

      const adjsc_itamt = rate * qty;

      return {
        ...item,
        adjsc_itamt,
      };
    });

    setListDataItem(newItems);

    //---------------------------------------------------
    // Totals Master
    //---------------------------------------------------

    const totals = newItems.reduce(
      (acc, item) => ({
        tramt: acc.tramt + validNumber(item.adjsc_itamt),
      }),
      {
        tramt: 0,
      },
    );

    //console.log("totals", totals);
    //---------------------------------------------------
    // Master
    //-----------------------------------------------

    setFormData({
      ...master,
      adjsm_tramt: validNumber(totals.tramt).toFixed(4),
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

  const getItemsByDepartment = async (v1, v2) => {
    try {
      const resp = await itemsAPI.getAdjustmentInOutItems({
        dpart_id: v1,
        ttype_id: v2,
      });
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_adjsm);
    setFormErrors(newErrors);
    if (f === "adjsm_dpart" || f === "adjsm_ttype") {
      setListDataItem([]);
      //if change department, then item list empty
      const v1 = f === "adjsm_dpart" ? v : formData.adjsm_dpart;
      const v2 = f === "adjsm_ttype" ? v : formData.adjsm_ttype;

      await getItemsByDepartment(v1, v2);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getAllDepartments();
    //await getItemsByDepartment(rowData.invcm_dpart);
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [dtResp, csResp, pyResp] = await Promise.all([
        adjustmentsAPI.getDetailsByMasterId({ adjsc_adjsm: id }),
      ]);
      setListDataItem(dtResp.data || []);
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
      const resp = await adjustmentsAPI.delete(rowData);
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
    });

    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    getAllDepartments();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_adjsm);
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

      if (validNumber(formData.invcm_duamt) < 0) {
        showToast(`${formData.invcm_duamt} Overpaid is not valid`, {
          type: "warning",
        });
        return;
      }

      const stockShortage = listDataItem.find(
        (f) => validNumber(f.invcf_ofqty) > validNumber(f.stock_ohqty),
      );
      if (stockShortage) {
        showToast(
          `${stockShortage.bndlm_cname} > ${stockShortage.price_cname} > Stock shortage ${validNumber(stockShortage.invcf_ofqty) - validNumber(stockShortage.stock_ohqty)} ${stockShortage.units_cname}`,
          { type: "warning" },
        );
        return;
      }

      //return;

      const reqBody = {
        ...formData,
        tmib_adjsc: listDataItem,
      };

      //console.log("reqBody", reqBody);
      // return;
      setIsBusy(true);
      const resp = await adjustmentsAPI.upsert(reqBody);
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
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_adjsc);
    setFormErrors(newErrors);
    if (f === "adjsc_refid") {
      const stock_id = items_Options.find((opt) => opt.stock_id === v);
      console.log("stock_id", stock_id);
      setFormDataItem((prev) => ({
        ...prev,
        adjsc_price: stock_id?.stock_price,
        adjsc_items: stock_id?.stock_items,
        adjsc_units: stock_id?.items_runit,
        adjsc_itrat: stock_id?.stock_cprat || 0,
        //adjsc_itqty: stock_id?.price_dspct || 0,
        adjsc_itamt: stock_id?.stock_cprat || 0 * 1,
        adjsc_refid: stock_id?.stock_id || 0,
        stock_ohqty: stock_id?.stock_ohqty,
        party_id: stock_id?.party_id,
        chtac_id: stock_id?.chtac_id,
      }));
    }
  };

  const handleAddToListItem = (value) => {
    const newErrors = validate(formDataItem, tmib_adjsc);
    setFormErrors(newErrors);
    console.log("newErrors", newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (validNumber(formDataItem.adjsc_itqty) <= 0.01) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }
    if (validNumber(formDataItem.adjsc_itrat) <= 0) {
      showToast("Price is required", { type: "warning" });
      return;
    }

    const isExists = listDataItem.find(
      (f) => f.adjsc_refid === formDataItem.adjsc_refid,
    );
    if (isExists) {
      showToast("This stock is already added", { type: "warning" });
      return;
    }

    const qty = validNumber(formDataItem.adjsc_itqty);
    const ohqty = validNumber(formDataItem.stock_ohqty);
    const stockDiff = ohqty - qty;
    if (stockDiff < 0) {
      showToast(`${stockDiff} Stock is not available`, { type: "warning" });
      return;
    }

    const items_iname = items_Options.find(
      (opt) => opt.stock_id === formDataItem.adjsc_refid,
    );
    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      items_iname: items_iname?.items_iname || "Invalid Item",
      price_cname: items_iname?.price_cname || "Invalid Unit",
      units_cname: items_iname?.units_cname || "Invalid Unit",
      adjsc_actve: true,
    };
    const newItemList = [...listDataItem, newItem];
    reCalculate(newItemList, formData);
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
    const dataName = rowData.price_cname;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;

    const newItemList = listDataItem.filter((item) => item.id !== rowData.id);
    reCalculate(newItemList, formData);
    showToast("Removed successfully", { type: "success" });
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "ITEM") {
      setFormDataItem(dataModelItem);
      setModalTitle({
        title: "Add Item",
        subTitle: "Adjustment Item Details",
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
    items_Options,
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
export default useAdjustment;
