import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { payablesAPI } from "@/api/M08/payablesAPI.js";
import { partyNetworkAPI } from "@/api/M08/partyNetworkAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmpb_mrrpy from "@/models/M03/tmpb_mrrpy.json";
const dataModel = generateDataModel(tmpb_mrrpy);
import { validNumber } from "@/utils/misc.js";

const usePayables = () => {
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

  const getAllPayables = async () => {
    try {
      setIsBusy(true);
      const resp = await payablesAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllPayables();
  }, []);

  const getMRRParty = async () => {
    try {
      setIsBusy(true);
      const resp = await partyNetworkAPI.getMrrDirect({});
      const list = resp.data || [];
      const mrrpy = list.filter((f) => f.prtyn_ctype === "PAY_CASH_BANK");
      setPartyOptions(mrrpy);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmpb_mrrpy);
    setFormErrors(newErrors);
    if (f === "mrrpy_party") {
      const party_id = party_Options.find((opt) => opt.id === v);
      //console.log(party_id);
      const newformData = {
        ...formData,
        mrrpy_party: v,
        party_id_pay: party_id?.id,
        chtac_id_pay: party_id?.party_chtac,
      };
      setFormData(newformData);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    await getMRRParty();
  };

  const handleDelete = async (rowData) => {};

  const handleSearch = async () => {
    getAllPayables();
  };
  const handleAddNew = () => {};

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmpb_mrrpy);
      setFormErrors(newErrors);
      //console.log("reqBody",newErrors)
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const duamt =
        validNumber(formData.mrrpy_duamt) - validNumber(formData.mrrpy_pdamt);
      if (duamt < 0) {
        showToast(duamt + " Overpayment is not valid", { type: "warning" });
        return;
      }

      if (validNumber(formData.mrrpy_pdamt) < 0.01) {
        showToast(formData.mrrpy_pdamt + " Payment is not valid", { type: "warning" });
        return;
      }
      const reqBody = {
        ...formData,
      };
      setIsBusy(true);
      //console.log("reqBody", reqBody);
      //return;
      const resp = await payablesAPI.create(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllPayables();
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
export default usePayables;
