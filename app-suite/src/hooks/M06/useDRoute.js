import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUI } from "@/context/AppUIContext.jsx";
import { droutesAPI } from "@/api/M06/droutesAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmcb_route from "@/models/M06/tmcb_route.json";
const dataModel = generateDataModel(tmcb_route);

const useDRoute = () => {
  const [searchParams] = useSearchParams();
  const territory = searchParams.get("territory");
  const territoryname = searchParams.get("territoryname");
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
  const [dzone_Options, setDzone_Options] = useState([]);

  const getAllDRoutes = async () => {
    try {
      setIsBusy(true);
      const resp = await droutesAPI.getAll({ trtry_id: territory });
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllDRoutes();
  }, []);




  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmcb_route);
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
      const resp = await droutesAPI.delete(rowData);
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
        getAllDRoutes();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllDRoutes();
  };

  const handleAddNew = async () => {
    setPgView("SYS_VW_FRM_1");
    //setFormData(dataModel);
    setFormData({
      ...dataModel,
      route_trtry: territory,
      trtry_cname: territoryname,
    });
    setReadOnly(false);
    setStopEdit(false);
    //getAllDZones();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmcb_route);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await droutesAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllDRoutes();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //on link
  const handleCRoutes = (rowData) => {
    navigate(`/crm/ff/contacts-routes?droutes=${rowData.id}&droutesname=${rowData.route_rname}`);
  };

  const handleBackToTrtry = () => {
    navigate(`/crm/setup/territories`);
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
    dzone_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //on link
    handleCRoutes,
    handleBackToTrtry,
  };
};
export default useDRoute;
