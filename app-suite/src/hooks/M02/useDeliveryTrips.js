import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmob_tripm from "@/models/M02/trip/tmob_tripm.json";
const dataModel = generateDataModel(tmob_tripm);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { deliveryTripAPI } from "@/api/M02/deliveryTripAPI.js";
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";
import { districtZoneAPI } from "@/api/M06/districtZoneAPI.js";
import { thanaAreaAPI } from "@/api/M06/thanaAreaAPI.js";
import { territoryAPI } from "@/api/M06/territoryAPI.js";
import { droutesAPI } from "@/api/M06/droutesAPI.js";
import { croutesAPI } from "@/api/M06/croutesAPI.js";

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
  const [party_Options, setParty_Options] = useState([]);
  const [refid_Options, setRefid_Options] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const getAllDeliveryTrips = async () => {
    try {
      setIsBusy(true);
      const resp = await deliveryTripAPI.getAll({});
      const list = resp.data || [];
      setListData(list);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    getAllDeliveryTrips();
  }, []);

  useEffect(() => {
    const addedItemIds = new Set(listDataItem.map((item) => item.id));

    const availableItems = allItems.filter(
      (item) => !addedItemIds.has(item.id),
    );
    setRefid_Options(availableItems);
  }, [allItems, listDataItem]);

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

  useEffect(() => {
    if (listDataItem.length > 0) {
      setStopEdit(true);
    } else {
      setStopEdit(false);
    }
  }, [listDataItem]);

  const getDeliveryTrip = async () => {
    if (party_Options.length > 0) {
      return;
    }
    try {
      const resp = await coaNetworkAPI.getSalesInvoiceDeliveryTrip({});
      const list = resp.data || [];
      setParty_Options(list);
    } catch (error) {}
  };

  const getDueTrips = async (id) => {
    try {
      const resp = await deliveryTripAPI.getAllDueTrip({
        dpart_id: formData.tripm_dpart,
        tripm_sorce: id,
      });
      const list = resp.data || [];
      setAllItems(list);
    } catch (error) {}
  };

  const handleChange = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmob_tripm);
    setFormErrors(newErrors);
    if (f === "tripm_sorce") {
      await getDueTrips(v);
    }
    if (f === "tripc_refid") {
      const tripm = refid_Options.find((item) => item.tripc_refid === v);
      setListDataItem((prev) => [...prev, tripm]);
    }
  };

  const handleEdit = (rowData) => {
    setPgView("SYS_VW_FRM_1");
    setFormData(rowData);
    loadAllDetails(rowData);
  };

  const loadAllDetails = async (rowData) => {
    try {
      setIsBusy(true);
      const [dtResp] = await Promise.all([
        deliveryTripAPI.getDetailsByMasterId({
          tripm_sorce: rowData.tripm_sorce,
          tripc_tripm: rowData.id,
        }),
      ]);
      setListDataItem(dtResp.data || []);
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
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
      const resp = await deliveryTripAPI.delete(rowData);
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
        getAllDeliveryTrips();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  const handleSearch = async () => {
    getAllDeliveryTrips();
  };
  const handleAddNew = async () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    getAllDepartments();
    getDeliveryTrip();
    getDZone();
  };

  const handleCancel = () => {
    setPgView("SYS_VW_LST_1");
    setFormData(dataModel);
    setListDataItem([]);
    setReadOnly(false);
    setStopEdit(false);
  };

  const handleSubmit = async () => {
    try {
      const newErrors = validate(formData, tmob_tripm);
      setFormErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (listDataItem.length === 0) {
        showToast("At least 1 delivery invoice is required", {
          type: "warning",
        });
        return;
      }

      const reqBody = {
        ...formData,
        tmob_tripc: listDataItem,
      };
      setIsBusy(true);

      console.log("reqBody", reqBody);

      const resp = await deliveryTripAPI.upsert(reqBody);
      alertBox({
        title: resp.success ? (formData.id ? "Updated" : "Saved") : "Error",
        message: resp.message,
        variant: resp.success ? "success" : "danger",
        confirmText: resp.success ? "Done" : "Close",
      });
      if (resp.success) {
        setPgView("SYS_VW_LST_1");
        setFormData(dataModel);
        getAllDeliveryTrips();
      }
    } catch (error) {
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Item Details ----------
  const [rstep_Options, setRstep_Options] = useState("DISTRICT");
  const [route_Options, setRoute_Options] = useState([]);
  const [cntct_Options, setCntct_Options] = useState([]);

  const getDZone = async () => {
    try {
      const resp = await districtZoneAPI.getByCountry({
        dzone_cntry: "Bangladesh",
      });
      const list = resp.data || [];
      const listActive = list
        .filter((item) => item.dzone_actve === true)
        .map((item) => ({
          label: item.dzone_cname,
          value: item.id,
        }));

      if (listActive.length > 0) {
        setRoute_Options(listActive);
        setRstep_Options("DISTRICT");
      }
    } catch (error) {}
  };

  const getTArea = async (id) => {
    try {
      const resp = await thanaAreaAPI.getByZone({
        tarea_dzone: id,
      });
      const list = resp.data || [];
      const listActive = list
        .filter((item) => item.tarea_actve === true)
        .map((item) => ({
          label: item.tarea_cname,
          value: item.id,
        }));
      if (listActive.length > 0) {
        setRoute_Options(listActive);
        setRstep_Options("THANA");
      }
    } catch (error) {}
  };

  const getTerritory = async (id) => {
    try {
      const resp = await territoryAPI.getByTArea({
        trtry_tarea: id,
      });
      const list = resp.data || [];
      const listActive = list
        .filter((item) => item.trtry_actve === true)
        .map((item) => ({
          label: item.trtry_cname,
          value: item.id,
        }));
      if (listActive.length > 0) {
        setRoute_Options(listActive);
        setRstep_Options("TERRITORY");
      }
    } catch (error) {}
  };

  const getDRoute = async (id) => {
    try {
      const resp = await droutesAPI.getByTerritory({
        route_trtry: id,
      });
      const list = resp.data || [];
      const listActive = list
        .filter((item) => item.route_actve === true)
        .map((item) => ({
          label: item.route_rname + "~" + item.route_dname,
          value: item.id,
        }));
      if (listActive.length > 0) {
        setRoute_Options(listActive);
        setRstep_Options("DROUTE");
      }
    } catch (error) {}
  };
  const getRouteContacts = async (obs) => {
    try {
      setCntct_Options([]);
      const resp = await croutesAPI.getByCRoutes(obs);
      const list = resp.data || [];
      const listActive = list
        .filter((item) => item.cntct_actve === true)
        .map((item) => ({
          cntct_cname:
            item.cntct_cname +
            "~" +
            item.cntct_ofadr +
            "~" +
            item.emply_cname +
            "~" +
            item.rtcnt_srial,
          value: item.id,
        }));
      //console.log("listActive", list);
      if (listActive.length > 0) {
        setCntct_Options(listActive);
        //setRstep_Options("DROUTE");
      }
    } catch (error) {}
  };
  const handleChangeInvoice = async (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
    const newErrors = validate({ ...formData, [f]: v }, tmob_tripm);
    setFormErrors(newErrors);
    if (f === "rtcnt_route" && !v) {
      await getDZone();
      return;
    }
    if (f === "rtcnt_route") {
      if (rstep_Options === "DISTRICT") {
        await getTArea(v);
        await getRouteContacts({
          dzone_id: v,
        });
      }
      if (rstep_Options === "THANA") {
        await getTerritory(v);
      }
      if (rstep_Options === "TERRITORY") {
        await getDRoute(v);
      }
      if (rstep_Options === "DROUTE") {
        await getRouteContacts({
          route_id: v,
        });
      }
    }
    console.log(f, v);
    console.log("rstep_Options", rstep_Options);
  };

  const handleDeleteItem = async (rowData) => {
    const dataName = rowData.invcm_trnno;
    const confirmation = await confirmBox({
      title: "Remove",
      message: `Are you sure you want to remove "${dataName}"?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmation) return;

    const newItemList = listDataItem.filter((item) => item.id !== rowData.id);
    setListDataItem(newItemList);
    showToast("Removed successfully", { type: "success" });
  };

  //print
  const [formDataPrint, setFormDataPrint] = useState({});
  const handlePrint = async () => {
    try {
      const resp = await deliveryTripAPI.getPrint({
        id: formData.id,
      });
      const list = resp.data || [];
      setFormDataPrint(list);
      //console.log("list", list);
    } catch (error) {}
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
    party_Options,
    refid_Options,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    //invoice items
    handleDeleteItem,
    handleChangeInvoice,
    route_Options,
    cntct_Options,
    //print
    formDataPrint,
    handlePrint,
  };
};
export default useDeliveryTrips;
