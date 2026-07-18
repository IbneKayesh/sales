import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { coaAPI } from "@/api/M08/coaAPI.js";

const useChartOfAccounts = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState({
    button: "SYS_BT_SRC_1",
    view: "SYS_VW_LST_1",
  });
  const [pgId, setPgId] = useState("M08-M01-M001");
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

  const getAllCoa = async () => {
    try {
      setIsBusy(true);
      const resp = await coaAPI.getAll({});
      //console.log("resp", resp);
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllCoa();
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
    //setPgView({ button: "SYS_BT_ADD_1", view: "SYS_VW_FRM_1" });
    //setFormData(rowData);
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
    handleSetView,
    handleEdit,
  };
};
export default useChartOfAccounts;
