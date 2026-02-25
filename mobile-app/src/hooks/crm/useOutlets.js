import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { contactsAPI } from "@/api/crm/contactsAPI";
import { ordersAPI } from "@/api/sales/ordersAPI";
import tmcb_cntcs from "@/models/crm/tmcb_cntcs.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";

const dataModel = generateDataModel(tmcb_cntcs, { edit_stop: 0 });

const useOutlets = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);
  const [searchData, setSearchData] = useState({
    search: "",
    status: null,
    date: new Date(),
  });

  const [outletOrders, setOutletOrders] = useState([]);

  const loadContacts = async () => {
    try {
      setIsBusy(true);
      setDataList([]);
      const formDataNew = {
        cntct_users: user?.emply_users,
        cntct_bsins: user?.emply_bsins,
      };

      const response = await contactsAPI.getAll(formDataNew);
      setDataList(response?.data || []);
      //console.log("loadContacts: ", response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [searchData]);

  const handleCreateNew = () => {
    setCurrentView("form");
    setFormData(dataModel);
  };

  const handleBack = () => {
    setCurrentView("list");
    setFormData(dataModel);
  };

  const handleEdit = (item) => {
    setCurrentView("form");
    setFormData(item);
  };

  const loadOutletOrders = async (item) => {
    try {
      setIsBusy(true);
      setOutletOrders([]);
      const formDataNew = {
        fodrm_cntct: item.id,
        fodrm_users: user?.emply_users,
        fodrm_bsins: user?.emply_bsins,
      };

      const response = await ordersAPI.getOutletOrders(formDataNew);
      const data = response?.data || [];
      setOutletOrders(data);
      return data;
      //console.log("loadOutletOrders: ", response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
      return [];
    } finally {
      setIsBusy(false);
    }
  };

  const handleViewOnly = async (item) => {
    setCurrentView("viewonly");
    const orders = await loadOutletOrders(item);

    const formDataNew = {
      outlet: item,
      orders: orders,
    };
    setFormData(formDataNew);
  };

  
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmcb_cntcs);
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
        cntct_users: user?.emply_users,
        cntct_bsins: user?.emply_bsins,
        cntct_ctype: "Outlet",
        cntct_sorce: "Local",
        cntct_cntry: "Bangladesh",
        cntct_cntad: "0",
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await contactsAPI.update(formDataNew);
      } else {
        response = await contactsAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      handleBack();
      loadContacts();
    } catch (error) {
      console.error("Error saving data:", error);

      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmcb_cntcs);
    setErrors(newErrors);
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    searchData,
    setSearchData,
    handleChange,
    handleCreateNew,
    handleBack,
    handleEdit,
    handleViewOnly,
    handleSave
  };
};

export default useOutlets;
