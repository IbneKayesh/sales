import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { unitsAPI } from "@/api/M04/unitsAPI.js";
import { standardAPI } from "@/api/M09/standardAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmib_units from "@/models/M04/tmib_units.json";
const dataModel = generateDataModel(tmib_units);

const useStandard = () => {
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
  const [formDataReport, setFormDataReport] = useState({});

  //report lists
  const rptList_Options = [
    {
      value: "SYS_RPT_PENDING_MRR_ITEMS",
      label: "Purchase (M03) / Purchase Order / Pending MRR Items / (Undelivered)",
      params: [
        {
          type: "text",
          label: "Supplier Code",
          value: "cntct_ccode",
          required: false,
        },
      ],
    },
    {
      value: "SYS_RPT_PO_SUMMARY",
      label: "Purchase (M03) / Purchase Order / Summary",
      params: [
        {
          type: "text",
          label: "Supplier Code",
          value: "cntct_ccode",
          required: false,
        },
      ],
    },
    {
      value: "SYS_RPT_CUSTOMER_SALES_SUMMARY",
      label: "Contact (M06) / Customer / Sales Summary",
      params: [
        {
          type: "text",
          label: "Customer Code",
          value: "cntct_ccode",
          required: true,
        },
      ],
    },
    {
      value: "SYS_RPT_SUPPLIER_MRR_SUMMARY",
      label: "Contact (M06) / Supplier / MRR Summary",
      params: [
        {
          type: "text",
          label: "Supplier Code",
          value: "cntct_ccode",
          required: false,
        },
      ],
    },
  ];

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_units);
    setFormErrors(newErrors);
    if (f === "rpt_name") {
      const rpt_id = rptList_Options.find((opt) => opt.value === v);
      setFormDataReport(rpt_id);
    }
  };

  const handleSubmit = async () => {
    try {
      // const newErrors = validate(formData, tmib_units);
      // setFormErrors(newErrors);
      // if (Object.keys(newErrors).length > 0) {
      //   return;
      // }
      setListData([]);
      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await standardAPI.getStandardReport(reqBody);
      const list = resp.data || [];
      setListData(list);
      if (!resp.success) {
        showToast(resp.message, { type: "error" });
        return;
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
    rptList_Options,
    //functions
    handleChange,
    handleSubmit,
    //others
    formDataReport,
  };
};
export default useStandard;
