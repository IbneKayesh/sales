import { useEffect, useState } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import validate, { generateDataModel } from "@/models/validator";
import tmob_tripm from "@/models/M02/trip/tmob_tripm.json";
const dataModel = generateDataModel(tmob_tripm);
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { deliveryTripAPI } from "@/api/M02/deliveryTripAPI.js";
import { coaNetworkAPI } from "@/api/M08/coaNetworkAPI.js";

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
  const handleAddNew = () => {
    setPgView("SYS_VW_FRM_1");
    setFormData(dataModel);
    setReadOnly(false);
    setStopEdit(false);
    setListDataItem([]);
    getAllDepartments();
    getDeliveryTrip();
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
    //print
    formDataPrint,
    handlePrint,
  };
};
export default useDeliveryTrips;
