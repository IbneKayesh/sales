import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmcb_rtcnt from "@/models/M06/tmcb_rtcnt.json";
const dataModel = generateDataModel(tmcb_rtcnt);
import { croutesAPI } from "@/api/M06/croutesAPI.js";
import { emplyAPI } from "@/api/M07/emplyAPI.js";
import { contactAPI } from "@/api/M06/contactAPI.js";

const useCRoute = () => {
  const [searchParams] = useSearchParams();
  const droutes = searchParams.get("droutes");
  const droutesname = searchParams.get("droutesname");
  const navigate = useNavigate();

  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M06-M0003");
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
  const [cntct_Options, setCntct_Options] = useState([]);
  const [emply_Options, setEmply_Options] = useState([]);

  const getAllDCoutes = async () => {
    try {
      console.log("resp")
      setIsBusy(true);
      const resp = await croutesAPI.getAll({ route_id: droutes });
      const list = resp.data || [];
      console.log("resp",resp)
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllDCoutes();
  }, []);

  const getAllCustomers = async () => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.getCustomersSalesOrder({ droutes_id: droutes });
      const list = resp.data || [];
      setCntct_Options(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAllFFUserId = async () => {
    try {
      setIsBusy(true);
      const resp = await emplyAPI.GetFF({ droutes_id: droutes });
      const list = resp.data || [];
      setEmply_Options(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmcb_rtcnt);
    setFormErrors(newErrors);
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    //getAllDZones();
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.tarea_actve;
    const dataName = rowData.tarea_cname;
    const confirmation = await confirmBox({
      title: isActive ? "Deactivate" : "Activate",
      message: `Are you sure you want to ${
        isActive ? "deactivate" : "activate"
      } "${dataName}"?`,
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "danger" : "success",
    });
    if (!confirmation) return;

    try {
      setIsBusy(true);
      const resp = await croutesAPI.delete(rowData);
      alertBox({
        title: resp.success
          ? isActive
            ? "Deactivated"
            : "Activated"
          : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllDCoutes();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllDCoutes();
  };
  const handleAddNew = async () => {
    setPgView("SYS_VW_FRM_1");
    //setFormData(dataModel);
    setFormData({
      ...dataModel,
      rtcnt_route: droutes,
      route_rname: droutesname,
    });
    setReadOnly(false);
    setStopEdit(false);
    getAllFFUserId();
    getAllCustomers();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmcb_rtcnt);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await croutesAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllDCoutes();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //on link
  const handleTerritory = (rowData) => {
    navigate(`/crm/setup/territories?tarea=${rowData.id}`);
  };
  const handleBackToDr = () => {
    navigate(`/crm/ff/delivery-routes`);
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
    cntct_Options,
    emply_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //on link
    handleBackToDr,
  };
};
export default useCRoute;
