import { useState, useEffect } from "react";
import { useAppUI } from "@/hooks/useAppUI";
import validate, { generateDataModel } from "@/models/validator";
import tmcb_cntct from "@/models/crm/tmcb_cntct.json";
const dataModel = generateDataModel(tmcb_cntct);
import { shortdataAPI } from "@/api/settings/shortdataAPI.js";
import { useAuth } from "@/hooks/useAuth.jsx";
import { contactAPI } from "@/api/crm/contactAPI.js";
import { dzoneAPI } from "@/api/crm/dzoneAPI.js";
import { tareaAPI } from "@/api/crm/tareaAPI.js";
import { territoryAPI } from "@/api/crm/territoryAPI.js";
import { partiesAPI } from "@/api/accounts/partiesAPI.js";
import tmcb_cntad from "@/models/crm/tmcb_cntad.json";

const useContacts = () => {
  //hooks :: menuId M06-M01,
  //mnusr_extpr : export, mnusr_addpr : add, mnusr_edtpr : edit, mnusr_delpr : delete
  const { getPageAuth } = useAuth();
  const { showToast, showToastError, confirm, alert, isBusy, setIsBusy } =
    useAppUI();
  const [pageAuth, setPageAuth] = useState({
    extpr: false,
    addpr: false,
    edtpr: false,
    delpr: false,
  });
  const [crTitle, setCrTitle] = useState("Contact List");
  const [crView, setCrView] = useState("SYS_LST_1");
  const [formData, setFormData] = useState(dataModel);
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  //other states
  const [cntct_party_dataList, setCntct_party_dataList] = useState([]);
  const [cntct_trtry_Options, setCntct_trtry_Options] = useState([]);
  const [cntct_tarea_Options, setCntct_tarea_Options] = useState([]);
  const [cntct_dzone_Options, setCntct_dzone_Options] = useState([]);
  const [dzone_cntry_Options, setDzone_cntry_Options] = useState([]);
  const [cntct_crncy_Options, setCntct_crncy_Options] = useState([]);

  const cntct_ctype_Options = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
  ];

  const cntct_sorce_Options = [
    { label: "Local", value: "Local" },
    { label: "Foreign", value: "Foreign" },
  ];

  //contact address
  const initFormAddr = {
    cntad_cntps: "",
    cntad_cntno: "",
    cntad_email: "",
    cntad_ofadr: "",
    cntad_notes: "",
    cntad_gmaps: "",
  };
  const [formDataAddress, setFormDataAddress] = useState(initFormAddr);
  const [dataListAddress, setDataListAddress] = useState([]);

  useEffect(() => {
    const perms = getPageAuth("M06-M01");
    setPageAuth(perms);
  }, [getPageAuth]);

  //functions
  const loadContact = async () => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.getAll({});
      //console.log("resp", resp);
      setDataList(resp.data || []);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_cntct);
    setErrors(newErrors);

    //console.log("field", field);
    if (field === "cntct_cntry") {
      handleGetDZone(value);
    }
    if (field === "cntct_dzone") {
      handleGetTArea(value);
    }
    if (field === "cntct_tarea") {
      handleGetTerritory(value);
    }
  };

  const handleEdit = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormData(rowData);
    setCrTitle("Edit Contact");
    setCrView("SYS_FRM_1");
    handleGetCountry();
    handleGetAddress(rowData.id);
    handleGetAccountsParty(rowData.id);
  };

  const handleDelete = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.cntct_actve ? "Deactivate" : "Activate"} this ${rowData.cntct_cname}?`,
      header: "Confirmation!",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        console.log("Operation is cancelled");
      },
    });
  };

  const onDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.delete(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Contact List");
        setCrView("SYS_LST_1");
        loadContact();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleBackClick = () => {
    setCrTitle("Contact List");
    setCrView("SYS_LST_1");
    setFormData(dataModel);
  };

  const handleSearchClick = () => {
    setCrTitle("Search Contact");
    setCrView("SYS_LST_1");
    alert({ message: "Search is clicked", header: "Search" });
    //ketp this function as it is
  };

  const handleRefreshClick = () => {
    setCrTitle("Contact List");
    setCrView("SYS_LST_1");
    loadContact();
  };

  const handleAddNewClick = () => {
    if (!pageAuth.addpr) {
      showToast("warn", "Add", "No add permission");
      return;
    }
    setCrTitle("Add Contact");
    setCrView("SYS_FRM_1");
    setFormData(dataModel);
    handleGetCountry();
    setDataListAddress([]);
  };

  const handleSubmitClick = async () => {
    try {
      const newErrors = validate(formData, tmcb_cntct);
      setErrors(newErrors);
      //console.log("handleSave: ",newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);

      const resp = await contactAPI.upsert(formData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formData.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        setCrTitle("Contact List");
        setCrView("SYS_LST_1");
        loadContact();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCountry = async () => {
    if (dzone_cntry_Options.length > 0) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await shortdataAPI.getCountry();
      //console.log("resp", resp);
      setDzone_cntry_Options(resp.data);
      showToastError(resp);

      const resp_currency = await shortdataAPI.getCurrency();
      //console.log("resp", resp);
      setCntct_crncy_Options(resp_currency.data);
      showToastError(resp_currency);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetDZone = async (dzone_cntry) => {
    //console.log("handleGetDZone", dzone_cntry);

    if (!dzone_cntry) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await dzoneAPI.getByCountry({ dzone_cntry: dzone_cntry });
      //console.log("resp", resp);
      setCntct_dzone_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetTArea = async (tarea_dzone) => {
    //console.log("field", tarea_dzone);
    if (!tarea_dzone) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await tareaAPI.getByDZone({ tarea_dzone: tarea_dzone });
      //console.log("resp", resp);
      setCntct_tarea_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetTerritory = async (trtry_tarea) => {
    //console.log("field", trtry_tarea);
    if (!trtry_tarea) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await territoryAPI.getByTArea({ trtry_tarea: trtry_tarea });
      //console.log("resp", resp);
      setCntct_trtry_Options(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //contact address
  const handleGetAddress = async (cntad_cntct) => {
    setDataListAddress([]);
    //console.log("cntad_cntct", cntad_cntct);
    if (!cntad_cntct) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await contactAPI.getAddress({ cntad_cntct: cntad_cntct });
      //console.log("resp", resp);
      setDataListAddress(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeAddress = (field, value) => {
    setFormDataAddress((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataAddress, [field]: value },
      tmcb_cntad,
    );
    setErrors(newErrors);
  };
  const handleSubmitAddressClick = async () => {
    try {
      const newErrors = validate(formDataAddress, tmcb_cntad);
      setErrors(newErrors);
      //console.log("handleSave: ", formDataAddress);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const reqBody = {
        ...formDataAddress,
        cntad_cntct: formData.id,
      };
      const resp = await contactAPI.upsertAddress(reqBody);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: formDataAddress.id ? "Updated" : "Saved",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        //setCrTitle("Contact List");
        //setCrView("SYS_LST_1");
        handleGetAddress(formData.id);
        setFormDataAddress(initFormAddr);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };
  const handleEditAddress = (rowData) => {
    if (!pageAuth.edtpr) {
      showToast("warn", "Edit", "No edit permission");
      return;
    }
    setFormDataAddress(rowData);
  };

  
  const handleDeleteAddress = (rowData) => {
    if (!pageAuth.delpr) {
      showToast("warn", "Delete", "No delete permission");
      return;
    }
    confirm({
      message: `Do you want to ${rowData.cntad_actve ? "Deactivate" : "Activate"} this ${rowData.cntad_ofadr}?`,
      header: "Confirmation!",
      accept: () => {
        onDeleteAddress(rowData);
      },
      reject: () => {
        console.log("Operation is cancelled");
      },
    });
  };

  const onDeleteAddress = async (rowData) => {
    try {
      setIsBusy(true);
      const resp = await contactAPI.deleteAddress(rowData);
      //console.log("resp", resp);
      alert({
        message: resp.message,
        header: "Done",
        icon: !resp.success && "pi pi-times-circle text-red-500",
      });
      if (resp.success) {
        handleGetAddress(rowData.cntad_cntct);
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };


  // Get Accounts Party

const handleGetAccountsParty = async (party_vndor) => {
    setCntct_party_dataList([]);
    //console.log("party_vndor", party_vndor);
    if (!party_vndor) {
      return;
    }
    try {
      setIsBusy(true);
      const resp = await partiesAPI.getByContacts({ party_vndor: party_vndor });
      //console.log("resp", resp);
      setCntct_party_dataList(resp.data);
      showToastError(resp);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };


  return {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //other states
    cntct_party_dataList,
    cntct_ctype_Options,
    cntct_sorce_Options,
    cntct_trtry_Options,
    cntct_tarea_Options,
    cntct_dzone_Options,
    dzone_cntry_Options,
    cntct_crncy_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleBackClick,
    handleSearchClick,
    handleRefreshClick,
    handleAddNewClick,
    handleSubmitClick,
    //contact address
    formDataAddress,
    handleChangeAddress,
    handleSubmitAddressClick,
    dataListAddress,
    handleEditAddress,
    handleDeleteAddress,
  };
};
export default useContacts;
