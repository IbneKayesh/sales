import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmib_brand from "@/models/M04/tmib_brand.json";
const dataModel = generateDataModel(tmib_brand);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { dataProcessAPI } from "@/api/M01/dataProcessAPI.js";

const useDataProcess = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M0005");
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
  const [dpart_Options, setDpart_Options] = useState([]);

  //Table Columns
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

  useEffect(() => {
    getAllDepartments();
  }, []);

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
  };

  const handleEdit = async (row) => {};

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormDataItem(dataModel);
    setListDataItem([]);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async (rowData) => {
    try {
      const newErrors = !formData.dpart_id
        ? { dpart_id: "Department is required" }
        : {};

      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };

      setIsBusy(true);
      let resp = { success: false, message: "Data not found" };
      switch (rowData) {
        case "PRODUCT_AVG_COST":
          resp = await dataProcessAPI.avgProductCost(reqBody);
          break;
        case "SUB_LEDGER_CURRENT_BALANCE":
          resp = await dataProcessAPI.subLedgerCurrentBalance(reqBody);
          break;
        default:
          break;
      }
      if (resp.success) {
        showToast(resp.message, {
          type: resp.success ? "success" : "error",
        });
        setPgView("SYS_VW_LST_1");
      } else {
        alertBox({
          title: "Error",
          message: resp.message,
          variant: "danger",
          confirmText: "Close",
        });
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
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
    //functions
    handleChange,
    handleEdit,
    handleCancel,
    handleSubmit,
  };
};
export default useDataProcess;
