import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import { buildPaths, buildPathsCOA } from "@/utils/pathBuilder.js";
import tmtb_party from "@/models/M08/tmtb_party.json";
const dataModel = generateDataModel(tmtb_party);
import { partyAPI } from "@/api/M08/partyAPI.js";
import { coaAPI } from "@/api/M08/coaAPI.js";

const useParty = () => {
  const { showToast, confirmBox, alertBox, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [pgId, setPgId] = useState("M08-M02-M003");
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
  const [chtac_Options, setChtac_Options] = useState([]);
  const [vndor_Options, setVndor_Options] = useState([]);

  const getAllParty = async () => {
    try {
      setIsBusy(true);
      const resp = await partyAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllParty();
  }, []);

  const getCoaChildOnly = async () => {
    if (chtac_Options.length > 0) return;
    try {
      const resp = await coaAPI.getWithPartyCount({});
      const list = resp.data || [];
      //filter posted only
      // const listActive = list.map((item) => ({
      //   id: item.id,
      //   name: item.chtac_cname,
      //   parent_id: item.chtac_chtac,
      //   active: item.chtac_ispst,
      // }));
      //build path for all
      //const buildPathsList = buildPaths(listActive);
      //apply filter and set state
      //setChtac_Options(buildPathsList.filter((item) => item.active));
      const listPath = buildPathsCOA(list);
      const listActive = listPath.filter(
        (f) =>
          f.chtac_sglmd === "SYS_MULTI_SGL" ||
          (f.chtac_sglmd === "SYS_SINGLE_SGL" && f.party_count === 0),
      );
      //console.log(listActive);
      setChtac_Options(listActive);
    } catch (error) {}
  };

  const getVendorExtData = async (id) => {
    try {
      setIsBusy(true);
      const resp = await partyAPI.getVendorExt({
        party_ptype: id,
      });
      const list = resp.data || [];
      console.log(list);
      setVndor_Options(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmtb_party);
    setFormErrors(newErrors);

    if (f === "party_ptype" && pgView === "SYS_VW_FRM_2") {
      getVendorExtData(v);
    }
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
  };

  const handleDelete = async (rowData) => {
    const isActive = rowData.party_actve;
    const dataName = rowData.party_cname;
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
      const resp = await partyAPI.delete(rowData);
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
        getAllParty();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllParty();
  };

  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    getCoaChildOnly();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmtb_party);
      //console.log("newErrors", newErrors);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await partyAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllParty();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  //existing
  const handleAddNewExt = () => {
    setPgView("SYS_VW_FRM_2");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmitExt = async () => {
    try {
      //const newErrors = validate(formData, tmtb_party);
      //console.log("newErrors", newErrors);
      const newErrors = {};
      if (!formData.party_ptype) {
        newErrors.party_ptype = "Type is required";
      }
      if (!formData.party_vndor) {
        newErrors.party_vndor = "Vendor is required";
      }
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const reqBody = {
        ...formData,
      };
      setIsBusy(true);

      const resp = await partyAPI.createExt(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        //setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllParty();
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
    chtac_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //existing
    handleAddNewExt,
    handleSubmitExt,
    vndor_Options,
  };
};
export default useParty;
