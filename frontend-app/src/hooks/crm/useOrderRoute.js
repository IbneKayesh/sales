import { useState, useEffect } from "react";
import { outletRouteAPI } from "@/api/crm/outletRouteAPI";
import tmcb_rutes from "@/models/crm/tmcb_rutes.json";
import tmcb_cntrt from "@/models/crm/tmcb_cntrt.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmcb_rutes, { edit_stop: 0 });
const dataModel_tmcb_cntrt = generateDataModel(tmcb_cntrt, { edit_stop: 0 });

export const useOrderRoute = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadOrderRoutes = async () => {
    try {
      const response = await outletRouteAPI.getAll({
        rutes_users: user.users_users,
        rutes_bsins: user.users_bsins,
      });
      //console.log("loadOrderRoutes: ", response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadOrderRoutes();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_rutes);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await outletRouteAPI.delete(rowData);

      const updatedList = dataList.filter((c) => c.id !== rowData.id);
      setDataList(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadOrderRoutes();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmcb_rutes);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        rutes_users: user.users_users,
        rutes_bsins: user.users_bsins,
        rutes_ttcnt: "0",
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await outletRouteAPI.update(formDataNew);
      } else {
        response = await outletRouteAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      handleClear();
      setCurrentView("list");
      loadOrderRoutes();
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  //outlets
  const [selectedRoute, setSelectedRoute] = useState({});
  const [routeOutlets, setRouteOutlets] = useState([]);
  const [outletFormData, setOutletFormData] = useState({});
  const handleRouteOutlets = async (rowData) => {
    console.log("handleOutlets: " + JSON.stringify(rowData));
    setSelectedRoute(rowData);
    setCurrentView("outlets");
    setOutletFormData(dataModel_tmcb_cntrt);

    try {
      const response = await outletRouteAPI.outlets({
        cnrut_users: user.users_users,
        cnrut_bsins: user.users_bsins,
        cnrut_rutes: rowData.id,
      });
      //console.log("loadOrderRoutes: ", response.data);
      setRouteOutlets(response.data);
      setOutletFormData({
        cnrut_rutes: rowData.id,
        cnrut_srlno: response.data.length + 1,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const handleDeleteRouteOutlet = async (rowData) => {
    //console.log("handleDeleteRouteOutlet: " + JSON.stringify(rowData));
    try {
      // Call API, unwrap { message, data }
      const response = await outletRouteAPI.deleteOutlet(rowData);

      const updatedList = routeOutlets.filter((c) => c.id !== rowData.id);
      setRouteOutlets(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleChangeRoute = (field, value) => {
    setOutletFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...outletFormData, [field]: value },
      tmcb_cntrt,
    );
    setErrors(newErrors);
  };

  const handleSaveRouteOutlet = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(outletFormData, tmcb_cntrt);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...outletFormData,
        id: outletFormData.id || generateGuid(),
        cnrut_users: user.users_users,
        cnrut_bsins: user.users_bsins,
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (outletFormData.id) {
        //response = await outletRouteAPI.updateOutlet(formDataNew);
      } else {
        response = await outletRouteAPI.createOutlet(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      //setOutletFormData(dataModel_tmcb_cntrt);
      loadOrderRoutes();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    //outlets
    selectedRoute,
    routeOutlets,
    outletFormData,
    setOutletFormData,
    handleChangeRoute,
    handleRouteOutlets,
    handleDeleteRouteOutlet,
    handleSaveRouteOutlet,
  };
};
