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

  //report lists
  const rptList_Options = [
    {
      value: "SYS_RPT_PENDING_MRR",
      label: "Purchase (M03) / Purchase Order / Pending MRR Items",
    },
    {
      value: "SYS_RPT_PENDING_MRR2",
      label: "Purchase (M03) / Purchase Order / Pending MRR",
    },
    {
      value: "SYS_RPT_PENDING_MRR3",
      label: "Purchase (M03) / Purchase Order / Pending MRR",
    },
  ];

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_units);
    setFormErrors(newErrors);
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
  };
};
export default useStandard;
