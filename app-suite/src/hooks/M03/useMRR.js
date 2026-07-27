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
  const [contact_Options, setContact_Options] = useState([]);
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
    if (contact_Options.length > 0) {
      return;
    }
    try {
      const resp = await contactAPI.getAllActive({});
      const list = resp.data || [];
      setContact_Options(list);
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

  const getAllItems = async () => {
    try {
      const resp = await itemsAPI.getAllActive();
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmpb_mrrdm);
    setFormErrors(newErrors);

    if (f === "mrrdm_dpart") {
      const dpart_cname = dpart_Options.find((opt) => opt.id === v);
      // could auto-fill dept name if needed
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
    getAllItems();
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
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    getAllDepartments();
    getAllContacts();
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
      const newErrors = validate(formData, tmpb_mrrdm);
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
        tmpb_mrrdc: listDataItem,
      };

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
  };

  const handleAddToListItem = () => {
    const newErrors = validate(formDataItem, tmpb_mrrdc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (
      ["", 0, "0", null, undefined].includes(formDataItem.mrrdc_trqty)
    ) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }

    const items_iname = items_Options.find(
      (opt) => opt.id === formDataItem.mrrdc_items,
    );

    // Calculate amount
    const mrrdc_tramt =
      (Number(formDataItem.mrrdc_trate) || 0) *
      (Number(formDataItem.mrrdc_trqty) || 0);

    // Calculate discount amount
    const mrrdc_dsamt =
      (Number(formDataItem.mrrdc_tramt) || mrrdc_tramt) *
      ((Number(formDataItem.mrrdc_dspct) || 0) / 100);

    // Calculate net amount
    const afterDisc = (Number(formDataItem.mrrdc_tramt) || mrrdc_tramt) - (Number(formDataItem.mrrdc_dsamt) || mrrdc_dsamt);
    const vatAmt = afterDisc * ((Number(formDataItem.mrrdc_sdvat) || 0) / 100);
    const taxAmt = afterDisc * ((Number(formDataItem.mrrdc_txpct) || 0) / 100);
    const mrrdc_ntamt = afterDisc + vatAmt + taxAmt + (Number(formDataItem.mrrdc_otcst) || 0);

    setListDataItem((prev) => [
      ...prev,
      {
        ...formDataItem,
        mrrdc_tramt: mrrdc_tramt || 0,
        mrrdc_dsamt: mrrdc_dsamt || 0,
        mrrdc_ntamt: mrrdc_ntamt || 0,
        items_iname: items_iname?.items_iname || "Invalid Item",
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
    setListDataItem((prev) =>
      prev.filter((item) => item.mrrdc_items !== rowData.mrrdc_items),
    );
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
    contact_Options,
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
