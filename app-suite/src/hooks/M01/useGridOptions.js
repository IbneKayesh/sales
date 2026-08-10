import { useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { generateDataModel } from "@/models/validator";
import tmsb_tabcl from "@/models/M01/tmsb_tabcl.json";
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";

const dataModel = generateDataModel(tmsb_tabcl);

const useGridOptions = () => {
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
  const [listTablColumns, setListTablColumns] = useState([]);

  const handleChange = async (f, v) => {
    try {
      // Optimistically reflect the change in the open modal
      setListTablColumns((prev) =>
        prev.map((col) => (col.id === f ? { ...col, tabcl_visbu: v } : col)),
      );

      const reqBody = {
        id: f,
        tabcl_visbu: v,
      };
      setIsBusy(true);

      const resp = await tabColumnsAPI.update(reqBody);
      showToast(
        resp.success
          ? resp?.message || "Failed to update column settings"
          : resp?.message,
        {
          type: resp.success ? "info" : "error",
        },
      );
      if (resp.success) {
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getTabColumns = async (value) => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByTable({ tabcl_table: value });
      const list = resp.data || [];
      setListTablColumns(list);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  //modal
  const handleShowModal = async (modal, value) => {
    await getTabColumns(value);
    // setModalTitle({
    //   title: "MRR Items Column Settings",
    //   subTitle: "MRR Columns Settings",
    // });
    setShowModal({ show: true, modal: modal });
  };

  const handleHideModal = () => {
    setListTablColumns([]);
    setShowModal({ show: false, modal: "" });
    setModalTitle({ title: "", subTitle: "" });
  };

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    listTablColumns,
    //functions
    handleChange,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useGridOptions;
