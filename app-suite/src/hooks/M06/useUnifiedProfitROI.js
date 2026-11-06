import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmcb_cntct from "@/models/M06/tmcb_cntct.json";
import tmcb_cntad from "@/models/M06/tmcb_cntad.json";
const dataModel = generateDataModel(tmcb_cntct);
const dataModelAddress = generateDataModel(tmcb_cntad);
import { contactAPI } from "@/api/M06/contactAPI.js";
import { partyAPI } from "@/api/M08/partyAPI.js";
import { districtZoneAPI } from "@/api/M06/districtZoneAPI.js";
import { thanaAreaAPI } from "@/api/M06/thanaAreaAPI.js";
import { territoryAPI } from "@/api/M06/territoryAPI.js";
import { reportsAPI } from "@/api/M08/reportsAPI.js";

const useUnifiedProfitROI = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M06-M01-M001");
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

  useEffect(() => {
  }, []);


  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmcb_cntct);
    setFormErrors(newErrors);
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
  };

  const handleSearch = async () => {
  };
  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

//CalculatorForm.jsx have js codes move to this hook

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
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
  };
};
export default useUnifiedProfitROI;
