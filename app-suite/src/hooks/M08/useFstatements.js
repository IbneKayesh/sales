import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { fsyarAPI } from "@/api/M08/fsyarAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import rpt_statements from "@/models/M08/rpt_statements.json";
const dataModel = generateDataModel(rpt_statements);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { acprdAPI } from "@/api/M08/acprdAPI.js";
import { reportsAPI } from "@/api/M08/reportsAPI.js";

const useFstatements = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M08-M0006");
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
  const reprt_Options = [
    {
      label: "Financial Statements > Trial Balance",
      value: "SYS_RPT_FS_TB",
    },
    {
      label: "Financial Statements > Balance Sheet",
      value: "SYS_RPT_FS_BS",
    },
    {
      label: "Financial Statements > Profit and Loss",
      value: "SYS_RPT_FS_PNL",
    },
    {
      label: "Financial Statements > Cash Flow",
      value: "SYS_RPT_FS_CF",
    },
    {
      label: "Ledger Reports > General Ledger",
      value: "SYS_RPT_LR_GL",
    },
    {
      label: "Ledger Reports > Journal Register",
      value: "SYS_RPT_LR_GR",
    },
    {
      label: "Ledger Reports > Account Ledger",
      value: "SYS_RPT_LR_AL",
    },
    {
      label: "Ledger Reports > Sub Ledger",
      value: "SYS_RPT_LR_SL",
    },
    {
      label: "Receivable & Payable > AR Aging",
      value: "SYS_RPT_RP_ARA",
    },
    {
      label: "Receivable & Payable > AP Aging",
      value: "SYS_RPT_RP_APA",
    },
    {
      label: "Receivable & Payable > Outstanding",
      value: "SYS_RPT_RP_OST",
    },
    {
      label: "Banking & Cash > Bank Reconciliation",
      value: "SYS_RPT_BC_BR",
    },
    {
      label: "Banking & Cash > Cash Book",
      value: "SYS_RPT_BC_CB",
    },
  ];
  const [dpart_Options, setDpart_Options] = useState([]);
  const [fsyar_Options, setFsyar_Options] = useState([]);
  const [acprd_Options, setAcprd_Options] = useState([]);

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

  const getAllFiscalYears = async (id) => {
    try {
      const resp = await fsyarAPI.getCurrentByDepartment({ fsyar_dpart: id });
      const list = resp.data || [];
      setFsyar_Options(list);
    } catch (error) {}
  };

  const getAllAcPeriods = async (id) => {
    try {
      const resp = await acprdAPI.getCurrentByFy({ acprd_fsyar: id });
      const list = resp.data || [];
      setAcprd_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, rpt_statements);
    setFormErrors(newErrors);
    if (f === "jrnlm_dpart") {
      await getAllFiscalYears(v);
    }
    if (f === "jrnlm_fsyar") {
      await getAllAcPeriods(v);
    }
  };

  const handleSubmit = async () => {
    try {
      setListData([]);
      const newErrors = validate(formData, rpt_statements);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      const reqBody = {
        user_d: formData.jrnlm_dpart,
        fsyar: formData.jrnlm_fsyar,
        acprd: formData.jrnlm_acprd,
      };
      setIsBusy(true);
      const resp = await reportsAPI.getJournalData(reqBody);
      //console.log(resp);
      if (resp.success) {
        setListData(resp.data);
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
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    reprt_Options,
    dpart_Options,
    fsyar_Options,
    acprd_Options,
    //functions
    handleChange,
    handleSubmit,
  };
};
export default useFstatements;
