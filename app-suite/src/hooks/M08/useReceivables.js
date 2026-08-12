import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { receivablesAPI } from "@/api/M08/receivablesAPI.js";
import { partyNetworkAPI } from "@/api/M08/partyNetworkAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmob_invpy from "@/models/M02/tmob_invpy.json";
const dataModel = generateDataModel(tmob_invpy);
import { validNumber } from "@/utils/misc.js";

const useReceivables = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M04-M0005");
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
  const [party_Options, setPartyOptions] = useState([]);

  const getAllReceivables = async () => {
    try {
      setIsBusy(true);
      const resp = await receivablesAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllReceivables();
  }, []);

  const getSalesInvoiceParty = async () => {
    try {
      setIsBusy(true);
      //AND ptn.prtyn_ctype = 'PAYMENTS'
      const resp = await partyNetworkAPI.getSalesInvoice({});
      const list = resp.data || [];
      const invpy = list.filter((f) => f.prtyn_ctype === "PAYMENTS");
      setPartyOptions(invpy);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmob_invpy);
    setFormErrors(newErrors);
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    await getSalesInvoiceParty();
  };

  const handleDelete = async (rowData) => {
  };

  const handleSearch = async () => {
    getAllReceivables();
  };
  const handleAddNew = () => {
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmob_invpy);
      setFormErrors(newErrors);
      //console.log("reqBody",newErrors)
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const duamt =
        validNumber(formData.invpy_duamt) - validNumber(formData.invpy_pdamt);
      if (duamt < 0) {
        showToast(duamt + " Overpayment is not valid", { type: "warning" });
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);
      //console.log("reqBody", reqBody);
      //return;

      const resp = await receivablesAPI.create(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllReceivables();
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
    party_Options,
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
export default useReceivables;
