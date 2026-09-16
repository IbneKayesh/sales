import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmib_brand from "@/models/M04/tmib_brand.json";
const dataModel = generateDataModel(tmib_brand);
import { brandAPI } from "@/api/M04/brandAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { deliveryTripAPI } from "@/api/M02/deliveryTripAPI.js";

const useDeliveryTrips = () => {
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
  const [dpart_Options, setDpart_Options] = useState([]);
  const [tripm_Options, setTripm_Options] = useState([]);

  const getAllBrand = async () => {
    try {
      setIsBusy(true);
      const resp = await brandAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllBrand();
  }, []);

  const getAllDepartments = async () => {
    if (dpart_Options.length > 0) {
      return;
    }
    try {
      const resp = await departmentAPI.getSales({});
      const list = resp.data || [];
      setDpart_Options(list);
    } catch (error) {}
  };

  const getDueTrips = async (id) => {
    try {
      const resp = await deliveryTripAPI.getAllDueTrip({ dpart_id: id });
      const list = resp.data || [];
      setTripm_Options(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmib_brand);
    setFormErrors(newErrors);
    if (f === "tripm_dpart") {
      await getDueTrips(v);
    }
    if (f === "tripc_tripm") {
      const tripm = tripm_Options.find((item) => item.id === v);
      setListDataItem((prev) => [...prev, tripm]);
    }
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.brand_actve;
    const dataName = rowData.brand_cname;
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
      const resp = await brandAPI.delete(rowData);
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
        getAllBrand();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllBrand();
  };
  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    getAllDepartments();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmib_brand);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await brandAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllBrand();
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
    dpart_Options,
    tripm_Options,
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
export default useDeliveryTrips;
