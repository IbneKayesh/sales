import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { mrrAPI } from "@/api/M03/mrrAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmpb_mrrdm from "@/models/M03/tmpb_mrrdm.json";
const dataModel = generateDataModel(tmpb_mrrdm);
import tmpb_mrrdc from "@/models/M03/tmpb_mrrdc.json";
const dataModelItem = generateDataModel(tmpb_mrrdc);
import { generateGuid } from "@/utils/guid.js";
import tmpb_mrrpy from "@/models/M03/tmpb_mrrpy.json";
import { paymentAPI } from "@/api/M08/paymentAPI.js";

const useMRRPayments = () => {
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

  //costing
  const [mrrcs_Options, setMrrcs_Options] = useState([]);
  const [listDataCost, setListDataCost] = useState([]);

  //payment
  const [mrrpy_Options, setMrrpy_Options] = useState([]);
  const [listDataPayment, setListDataPayment] = useState([]);
  const [formDataPayment, setFormDataPayment] = useState({});

  // ---------- MRR Master ----------
  const getAllDueMRR = async () => {
    try {
      setIsBusy(true);
      const resp = await mrrAPI.getAllDueMRR({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllDueMRR();
  }, []);

  function reCalculate(master, paymList) {
    // Safe number conversion (handles null, undefined, NaN, "", etc.)
    const num = (value) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    };

    // Safe divide
    const div = (a, b) => (num(b) === 0 ? 0 : num(a) / num(b));

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

    const duamt = Number(master.mrrdm_pyamt) - totalPayment;

    setFormData({
      ...master,
      mrrdm_pdamt: num(totalPayment).toFixed(4),
      mrrdm_duamt: num(duamt).toFixed(4),
    });
  }

  const getExpnPaym = async () => {
    if (mrrcs_Options.length > 0) {
      return;
    }
    try {
      const resp = await mrrAPI.getExpensesPaymentsHeads({});
      const list = resp.data || [];
      const mrrcs = list.filter((f) => f.prtyn_ctype === "EXPENSES");
      const mrrpy = list.filter((f) => f.prtyn_ctype === "PAYMENTS");
      setMrrcs_Options(mrrcs);
      setMrrpy_Options(mrrpy);
    } catch (error) {}
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    //setReadOnly(true);
    setFormData(rowData);
    loadAllDetails(rowData.id);
    getExpnPaym();
  };

  const loadAllDetails = async (id) => {
    try {
      setIsBusy(true);
      const [pyResp] = await Promise.all([
        mrrAPI.getPaymentsByMasterId({ mrrpy_mrrdm: id }),
      ]);
      setListDataPayment(pyResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (rowData) => {
    
  };

  const handleSearch = async () => {
    getAllDueMRR();
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

      if (listDataPayment.filter((f) => f.mrrpy_mrrdm ==="SYS_NEW").length === 0) {
        showToast("At least 1 payment is required", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
        tmpb_mrrpy: listDataPayment,
      };

      // console.log(reqBody);
      // return;

      setIsBusy(true);
      const resp = await paymentAPI.mrrPayment(reqBody);
      //console.log(resp);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllDueMRR();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Payment Details ----------

  const handleChangePayment = (f, v) => {
    setFormDataPayment((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formDataPayment, [f]: v }, tmpb_mrrpy);
    setFormErrors(newErrors);
    if (f === "mrrcs_party") {
      const mrrpy_id = mrrpy_Options.find((opt) => opt.id === v);
      setFormDataPayment((prev) => ({
        ...prev,
        party_cname: mrrpy_id?.party_cname,
      }));
    }
  };

  const handleAddToListPayment = () => {
    const newErrors = validate(formDataPayment, tmpb_mrrpy);
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (["", 0, "0", null, undefined].includes(formDataPayment.mrrpy_pdamt)) {
      showToast("Amount is required", { type: "warning" });
      return;
    }

    const party_cname = mrrpy_Options.find(
      (opt) => opt.id === formDataPayment.mrrpy_party,
    );
    //console.log("party_cname",formDataPayment)

    //create new row
    const newItem = {
      ...formDataPayment,
      id: generateGuid(),
      mrrpy_mrrdm: "SYS_NEW",
      party_cname: party_cname?.party_cname || "Invalid Item",
      mrrpy_actve: true,
    };
    const newPaymentList = [...listDataPayment, newItem];
    reCalculate(formData, newPaymentList);
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
    readOnly,
    stopEdit,
    listData,
    formData,
    formErrors,
    //others
    mrrpy_Options,
    listDataPayment,
    //functions
    handleEdit,
    handleDelete,
    handleSearch,
    handleCancel,
    handleSubmit,
    //item
    //cost
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
export default useMRRPayments;
