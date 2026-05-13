import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmtb_mjrnl_rpt from "@/models/accounts/tmtb_mjrnl_rpt.json";
const dataModel = generateDataModel(tmtb_mjrnl_rpt);
import { journalAPI } from "@/api/accounts/journalAPI.js";
import { reportsAPI } from "@/api/accounts/reportsAPI.js";
import { departmentsAPI } from "@/api/settings/departmentsAPI.js";
import { fiscalYearAPI } from "@/api/accounts/fiscalYearAPI.js";
import { acPeriodAPI } from "@/api/accounts/acPeriodAPI.js";
import { coaAPI } from "@/api/accounts/coaAPI.js";
import { partiesAPI } from "@/api/accounts/partiesAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import { buildCoaTree, findCoaTree } from "@/utils/jsonParser.js";

const useReports = () => {
  //hooks :: menuId M05-M03-001,
  //mnusr_extpr : export, mnusr_addpr : add, mnusr_edtpr : edit, mnusr_delpr : delete
  //SYS_FIND_1 :: Search, SYS_LIST_1 :: List, SYS_FORM_1 :: Entry Form,
  const { getPageAuth } = useAuth();
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } =
    useAppUI();
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [crTitle, setCrTitle] = useState("Reports");
  const [crView, setCrView] = useState("SYS_LIST_1");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);
  const [mjrnl_dpart_Options, setMjrnl_dpart_Options] = useState([]);
  const [mjrnl_fsyar_Options, setMjrnl_fsyar_Options] = useState([]);
  const [mjrnl_acprd_Options, setMjrnl_acprd_Options] = useState([]);

  //SYS_SB_1 :: search box
  const report_Options = [
    {
      label: "Trial Balance",
      value: "SYS_TB1",
    },
    {
      label: "Profit & Loss",
      value: "SYS_PL1",
    },
    {
      label: "Balance Sheet",
      value: "SYS_BS1",
    },
    {
      label: "Cash Flow Statement",
      value: "SYS_CFS1",
    },
  ];

  //other states items
  const [djrnl_chtac_Options, setDjrnl_chtac_Options] = useState([]);
  const [djrnl_party_Options, setDjrnl_party_Options] = useState([]);
  useEffect(() => {
    const perms = getPageAuth("M05-M03-001");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_mjrnl_rpt);
    setErrors(newErrors);

    if (field === "mjrnl_fsyar") {
      handleGetAccountPeriod(value);
    }
    if (field === "djrnl_chtac") {
      handleGetPartyCoa(value);
    }
  };



  const loadTrialBalance = async () => {
    try {
      const newErrors = validate(formData, tmtb_mjrnl_rpt);
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const resp = await reportsAPI.getLedgerData(formData);
      //console.log("resp", resp);
      setDataList(resp.data || []);
      showToastError(resp);

      setCrView("SYS_LIST_1");
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };



  const handleSearchClick = async () => {
    setCrTitle("Search Journal");
    setCrView("SYS_FIND_1");
    //alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
    // await loadTrialBalance();
    handleGetDepartment();
    handleGetFiscalYear();
    handleGetCOA();
  };


  const handleQueryClick = async () => {
    if (formData.report_type === "SYS_TB1"){      
      await loadTrialBalance();
    }
  };

  //other functions
  const handleGetDepartment = async () => {
    if (mjrnl_dpart_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await departmentsAPI.getAllActive();
      //console.log("resp", resp);
      setMjrnl_dpart_Options(resp.data);
      showToastError(resp);
      if (resp.data.length === 1) {
        setFormData((prev) => ({
          ...prev,
          mjrnl_dpart: resp.data[0].id,
        }));
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetFiscalYear = async () => {
    if (mjrnl_fsyar_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await fiscalYearAPI.getAllYear();
      //console.log("resp1", resp);
      setMjrnl_fsyar_Options(resp.data);
      showToastError(resp);
      // if (resp.data.length === 1) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     mjrnl_fsyar: resp.data[0].id,
      //   }));
      // }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };
  const handleGetAccountPeriod = async (id) => {
    // if (mjrnl_acprd_Options.length > 0) {
    //   return;
    // }
    setMjrnl_acprd_Options([]);
    try {
      setIsBusy(true);
      const resp = await acPeriodAPI.getAllPeriod({ acprd_fsyar: id });
      //console.log("resp", resp);
      setMjrnl_acprd_Options(resp.data);
      showToastError(resp);
      if (resp.data.length === 1) {
        setFormData((prev) => ({
          ...prev,
          mjrnl_acprd: resp.data[0].id,
        }));
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCOA = async () => {
    if (mjrnl_fsyar_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      //const resp = await coaAPI.getCoaPosting();
      const resp = await coaAPI.getWithPartyCount();
      //console.log("resp1", resp);
      // setDjrnl_chtac_Options(ddlData);
      const list = resp.data.map((item) => ({
        ...item,
        chtac_cname:
          item.party_count > 0
            ? item.chtac_cname + " / " + item.party_count
            : item.chtac_cname,
      }));
      const coaTree = buildCoaTree(list);
      setDjrnl_chtac_Options(coaTree);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetPartyCoa = async (value) => {
    try {
      setIsBusy(true);
      const resp = await partiesAPI.getByCoa({ party_chtac: value });
      //console.log("resp1", resp);

      const ddlData = (resp?.data || []).map((item) => ({
        value_text: item.id,
        label_text:
          item.party_pname +
          " | " +
          item.party_ptype +
          " | " +
          item.party_pcode,
      }));

      setDjrnl_party_Options(ddlData);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };


  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    report_Options,
    mjrnl_dpart_Options,
    mjrnl_fsyar_Options,
    mjrnl_acprd_Options,
    djrnl_chtac_Options,
    djrnl_party_Options,
    //functions
    handleChange,
    handleSearchClick,
    handleQueryClick,
    //other functions
  };
};
export default useReports;
