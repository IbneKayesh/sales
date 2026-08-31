import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUI } from "@/context/AppUIContext.jsx";
import { bundleAPI } from "@/api/M04/bundleAPI.js";
import { priceAPI } from "@/api/M04/priceAPI.js";
import { generateGuid } from "@/utils/guid.js";
import validate, { generateDataModel } from "@/models/validator";
import { validNumber, divNumber } from "@/utils/misc.js";
import tmib_bndlm from "@/models/M04/tmib_bndlm.json";
import tmib_bndlc from "@/models/M04/tmib_bndlc.json";
const dataModel = generateDataModel(tmib_bndlm);
const dataModelItem = generateDataModel(tmib_bndlc);

const useItemBundle = () => {
  const location = useLocation();
  const selectedItemPrice = location.state?.rowData;

  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M02-M002");
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

  const [items_Options, setItems_Options] = useState([]);

  const getAllBundle = async () => {
    try {
      setIsBusy(true);
      const resp = await bundleAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    //retrive from hidden URL
    if (selectedItemPrice) {
      //console.log("selectedItemPrice", selectedItemPrice);
      const newData = {
        bndlm_dpart: selectedItemPrice.price_dpart,
        bndlm_items: selectedItemPrice.price_items,
        bndlm_price: selectedItemPrice.id,
        bndlm_itqty: 1,
        bndlm_itrat: selectedItemPrice.price_mrrat,
        dpart_cname: selectedItemPrice.dpart_cname,
        price_cname: selectedItemPrice.price_cname,
      };
      setFormData(newData);
      setPgView("SYS_VW_FRM_1");
      getItemsByDepartment(selectedItemPrice.price_dpart);
    }
    getAllBundle();
  }, [selectedItemPrice]);

  const getItemsByDepartment = async (id) => {
    try {
      const resp = await priceAPI.getByDepartmentBundleItem({
        price_dpart: id,
      });
      const list = resp.data || [];
      setItems_Options(list);
    } catch (error) {}
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_bndlm);
    setFormErrors(newErrors);
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.units_actve;
    const dataName = rowData.units_cname;
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
      const resp = await bundleAPI.delete(rowData);
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
        getAllBundle();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllBundle();
  };
  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_bndlm);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
        tmib_bndlc: listDataItem,
      };
      setIsBusy(true);

      //console.log(newErrors)

      const resp = await bundleAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllBundle();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Item Details ----------

  const handleChangeItem = (f, v) => {
    setFormDataItem((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataItem, [f]: v }, tmib_bndlc);
    setFormErrors(newErrors);
    if (f === "bndlc_price") {
      const price_id = items_Options.find((opt) => opt.id === v);
      //console.log('stock_id',stock_id)
      setFormDataItem((prev) => ({
        ...prev,
        bndlc_items: price_id?.price_items,
        bndlc_price: price_id?.id,
        bndlc_itrat: price_id?.price_mrrat,
        price_cname: price_id?.price_cname,
        price_ccode: price_id?.price_ccode,
        runit_cname: price_id?.runit_cname,
        items_icode: price_id?.items_icode,
        items_iname: price_id?.items_iname,
      }));
    }
  };

  const handleAddToListItem = (value) => {
    const newErrors = validate(formDataItem, tmib_bndlc);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (validNumber(formDataItem.bndlc_itqty) <= 0.01) {
      showToast("Quantity is required", { type: "warning" });
      return;
    }
    if (validNumber(formDataItem.bndlc_itrat) <= 0) {
      showToast("Price is required", { type: "warning" });
      return;
    }

    const isExists = listDataItem.find(
      (f) => f.bndlc_price === formDataItem.bndlc_price,
    );
    if (isExists) {
      showToast("This price is already added", { type: "warning" });
      return;
    }
    //console.log("formDataItem", formDataItem);
    //create new row
    const newItem = {
      ...formDataItem,
      id: generateGuid(),
      bndlc_itamt:
        validNumber(formDataItem.bndlc_itqty) *
        validNumber(formDataItem.bndlc_itrat),
      bndlc_actve: true,
    };

    setListDataItem((prev) => [...prev, newItem]);

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

  //modal
  const handleShowModal = (modal) => {
    if (modal === "ITEM") {
      setFormDataItem(dataModelItem);
      setModalTitle({
        title: "Add Item",
        subTitle: "Bundle Item Details",
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
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //item
    items_Options,
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
export default useItemBundle;
