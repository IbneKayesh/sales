import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { productionAPI } from "@/api/M05/productionAPI.js";

const useProduction = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState({
    button: "SYS_BT_SRC_1",
    view: "SYS_VW_LST_1",
  });
  const [pgId, setPgId] = useState("M05-M01-M001");
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [formData, setFormData] = useState({});
  const [listDataItem, setListDataItem] = useState([]);
  const [formDataItem, setFormDataItem] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const getAllProduction = async () => {
    try {
      setIsBusy(true);
      const resp = await productionAPI.getAll({});
      //console.log("resp", resp);
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllProduction();
  }, []);

  const handleSetView = (btn) => {
    if (btn === "SYS_BT_SRC_1") {
      setPgView({ button: btn, view: "SYS_VW_LST_1" });
    } else if (btn === "SYS_BT_ADD_1") {
      setPgView({ button: btn, view: "SYS_VW_FRM_1" });
    } else if (btn === "SYS_BT_CNL_1") {
      setPgView({ button: btn, view: "SYS_VW_LST_1" });
    } else {
      //do nothing
    }
  };

  const handleEdit = (rowData) => {
    setPgView({ button: "SYS_BT_ADD_1", view: "SYS_VW_FRM_1" });
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const confirmation = await confirmBox({
      title: "Delete",
      message: `Are you sure you want to delete "${rowData.prods_cname}"? This action cannot be undone and will permanently remove the user from the system.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmation) return;
    // await alertBox({
    //   title: "Deleted",
    //   message: `"${rowData.prods_cname}" has been permanently removed from the system.`,
    //   variant: "success",
    //   confirmText: "Done",
    // });
    showToast(`"${rowData.prods_cname}" deleted successfully!`, {
      type: "success",
    });
  };

  const handleChange = (f, v) => {};
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
    handleSetView,
    handleEdit,
    handleDelete,
    handleChange,
  };
};
export default useProduction;
