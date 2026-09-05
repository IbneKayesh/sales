import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { payLocalAPI } from "@/api/M08/payLocalAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import local_pay from "@/models/M08/local_pay.json";
const dataModel = generateDataModel(local_pay);
import { validNumber } from "@/utils/misc.js";
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";


const usePayLocal = () => {
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
      const resp = await payLocalAPI.getAll({});
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
      const resp = await coaNetworkAPI.getLocalPayment({});
      const list = resp.data || [];
      //const mrrpy = list.filter((f) => f.prtyn_ctype === "PAY_CASH_BANK");
      const mrrpy = list.filter((f) =>
        ["SYS_AST_PAYMENT", "SYS_NONE"].includes(f.chtrt_grpid),
      );

      const listActive = mrrpy.filter((f) => f.party_crbal > 0);
      setPartyOptions(listActive);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, local_pay);
    setFormErrors(newErrors);
     //party_id, chtac_id are used for vendor
    if (f === "party_id_pay") {
      const party_id = party_Options.find((opt) => opt.id === v);
      //console.log(party_id);
      //party_id_pay, chtac_id_pay, for payment
      const newformData = {
        ...formData,
        party_id_pay: party_id?.id,
        chtac_id_pay: party_id?.party_chtac,
        pay_value: formData.due_value,
        party_crbal: party_id?.party_crbal,
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
      const newErrors = validate(formData, local_pay);
      setFormErrors(newErrors);
      //console.log("reqBody",newErrors)
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const duamt =
        validNumber(formData.due_value) - validNumber(formData.pay_value);
      if (duamt !== 0) {
        showToast(duamt + " Over/Due payment is not valid", {
          type: "warning",
        });
        return;
      }

      if (
        validNumber(formData.pay_value) > validNumber(formData.party_crbal)
      ) {
        showToast(formData.party_crbal + " Balance is not available", {
          type: "warning",
        });
        return;
      }
      const reqBody = {
        ...formData,
      };
      setIsBusy(true);
      //console.log("reqBody", reqBody);
      //return;
      const resp = await payLocalAPI.create(reqBody);
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
export default usePayLocal;
