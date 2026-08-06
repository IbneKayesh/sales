import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { contactAPI } from "@/api/M06/contactAPI.js";
import validate, { generateDataModel } from "@/models/validator";
import tmcb_cntct from "@/models/M06/tmcb_cntct.json";
const dataModel = generateDataModel(tmcb_cntct);
import { partyAPI } from "@/api/M08/partyAPI.js";
import { districtZoneAPI } from "@/api/M06/districtZoneAPI.js";
import { thanaAreaAPI } from "@/api/M06/thanaAreaAPI.js";
import { territoryAPI } from "@/api/M06/territoryAPI.js";
import tmcb_cntad from "@/models/M06/tmcb_cntad.json";
const dataModelAddress = generateDataModel(tmcb_cntad);

const useContact = () => {
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
  const [partyData, setPartyData] = useState([]);
  const [dzone_Options, setDzone_Options] = useState([]);
  const [tarea_Options, setTarea_Options] = useState([]);
  const [trtry_Options, setTrtry_Options] = useState([]);

  //address
  const [showModal, setShowModal] = useState({ show: false, modal: "" });
  const [modalTitle, setModalTitle] = useState({ title: "", subTitle: "" });
  const [listDataAddress, setListDataAddress] = useState([]);
  const [formDataAddress, setFormDataAddress] = useState(dataModelAddress);

  const getAllContact = async () => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllContact();
  }, []);

  const getPartyData = async (id) => {
    try {
      setIsBusy(true);
      const resp = await partyAPI.getByVendorId({ party_vndor: id });
      const data = resp.data || {};
      setPartyData(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAddress = async (id) => {
    try {
      setListDataAddress([]);
      setIsBusy(true);
      const resp = await contactAPI.getAddress({ cntad_cntct: id });
      const data = resp.data || [];
      setListDataAddress(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAllDZone = async (value) => {
    try {
      setIsBusy(true);
      const resp = await districtZoneAPI.getByCountry({ dzone_cntry: value });
      const data = resp.data || [];
      setDzone_Options(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAllTArea = async (value) => {
    try {
      setIsBusy(true);
      const resp = await thanaAreaAPI.getByZone({ tarea_dzone: value });
      const data = resp.data || [];
      setTarea_Options(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const getAllTerritory = async (value) => {
    try {
      setIsBusy(true);
      const resp = await territoryAPI.getByTArea({ trtry_tarea: value });
      const data = resp.data || [];
      setTrtry_Options(data);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmcb_cntct);
    setFormErrors(newErrors);
    if (f === "cntct_cntry") {
      getAllDZone(v);
    }
    if (f === "cntct_dzone") {
      getAllTArea(v);
    }
    if (f === "cntct_tarea") {
      getAllTerritory(v);
    }
  };

  const handleEdit = async (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    getPartyData(rowData.id);
    getAddress(rowData.id);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.cntct_actve;
    const dataName = rowData.cntct_cname;
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
      const resp = await contactAPI.delete(rowData);
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
        getAllContact();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllContact();
  };
  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    if (!formData.cntct_cntry) {
      getAllDZone(formData.cntct_cntry);
    }
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmcb_cntct);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await contactAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllContact();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //address functions
  const handleChangeAddress = (f, v) => {
    setFormDataAddress((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...dataModelAddress, [f]: v }, tmcb_cntad);
    setFormErrors(newErrors);
  };

  const handleSaveAddress = async (value) => {
    try {
      const newErrors = validate(formDataAddress, tmcb_cntad);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }
      //create new for empty id
      const reqBody = {
        ...formDataAddress,
        //don't create id, new for empty
      };
      //console.log("reqBody", reqBody);
      setIsBusy(true);
      const resp = await contactAPI.upsertAddress(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        //setPgView("SYS_VW_LST_1");
        setFormDataAddress(dataModelAddress);
        getAddress(formData.id);
        //fetch address
        if (value === "CLOSE") {
          handleHideModal();
        }
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditAddress = (rowData) => {
    handleShowModal("ADDRESS");
    setFormDataAddress(rowData);
  };

  const handleDeleteAddress = async (rowData) => {
    const dataName = rowData.cntad_cntps;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;
    try {
      setIsBusy(true);
      const resp = await contactAPI.deleteAddress(rowData);
      // console.log("resp", resp);
      // console.log("rowData", rowData);
      if (resp.success) {
        getAddress(formData.id);
      }
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
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //modal
  const handleShowModal = (modal) => {
    if (modal === "ADDRESS") {
      setFormDataAddress({ ...dataModelAddress, cntad_cntct: formData.id });
      setModalTitle({
        title: "Add Address",
        subTitle: "Contact Address",
      });
    }
    setShowModal({ show: true, modal: modal });
  };

  const handleHideModal = () => {
    setShowModal({ show: false, modal: "" });
    setModalTitle({ title: "", subTitle: "" });
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
    partyData,
    dzone_Options,
    tarea_Options,
    trtry_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //address
    listDataAddress,
    formDataAddress,
    handleChangeAddress,
    handleSaveAddress,
    handleEditAddress,
    handleDeleteAddress,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  };
};
export default useContact;
