import { useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { generateDataModel } from "@/models/validator";
import tmsb_tabcl from "@/models/M01/tmsb_tabcl.json";
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";

const dataModel = generateDataModel(tmsb_tabcl);

const useSetup = () => {
  const { showToast, isBusy, setIsBusy } = useUI();
  const [pgView] = useState("SYS_VW_LST_1");
  const [pageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly] = useState(false);
  const [stopEdit] = useState(false);
  const [listTablColumns, setListTablColumns] = useState([]);
  const [formData] = useState(dataModel);
  const [listDataItem] = useState([]);
  const [formDataItem] = useState({});
  const [formErrors] = useState({});
  //others
  const [showModal, setShowModal] = useState(false);

  const handleChange = (f, v) => {
    // Optimistically reflect the change in the open modal
    setListTablColumns((prev) =>
      prev.map((col) => (col.id === f ? { ...col, tabcl_visbu: v } : col)),
    );
    //call api tabColumnsAPI.update
    //body id : f, :tabcl_visbu : v/true/false
    tabColumnsAPI.update({ id: f, tabcl_visbu: v }).then((resp) => {
      if (resp?.success === false) {
        showToast(resp?.message || "Failed to update column settings", {
          type: "error",
        });
      }
    });
  };

  const getTabColumns = async (value) => {
    try {
      setIsBusy(true);
      const resp = await tabColumnsAPI.getByTable({ tabcl_table: value });
      const list = resp.data || [];
      setListTablColumns(list);
    } catch {
      /* ignore */
    } finally {
      setIsBusy(false);
    }
  };

  const handleOpenModal = async (value) => {
    if (value === "SYS_MRR_DIRECT_ITEMS") {
      await getTabColumns(value);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setListTablColumns([]);
    setShowModal(false);
  };

  return {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listTablColumns,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    showModal,
    //functions
    handleChange,
    handleOpenModal,
    handleCloseModal,
  };
};
export default useSetup;
