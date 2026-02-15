import { useState, useEffect } from "react";
import { receivablesAPI } from "@/api/accounts/receivablesAPI";
import tmtb_rcvbl from "@/models/accounts/tmtb_rcvbl.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDateForAPI } from "@/utils/datetime";

const dataModel = generateDataModel(tmtb_rcvbl, { edit_stop: 0 });

export const useReceivables = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadPayables = async () => {
    try {
      const response = await receivablesAPI.getAll({
        rcvbl_users: user.users_users,
        rcvbl_bsins: user.users_bsins,
      });
      //response = { success, message, data }
      //console.log("response ", response)

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadPayables();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_rcvbl);
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
    setFormData({ ...dataModel, ...data });
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await receivablesAPI.delete(rowData);

      // Remove deleted account from local state
      const updatedList = dataList.filter((s) => s.id !== rowData.id);
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
    loadPayables();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmtb_rcvbl);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      if (formData.rcvbl_dbamt > formData.mbkng_duamt) {
        showToast(
          "error",
          "Error",
          "Payment amount cannot be greater than payable amount",
        );
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        rcvbl_trdat: formatDateForAPI(formData.rcvbl_trdat),
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await receivablesAPI.update(formDataNew);
      } else {
        response = await receivablesAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      //call update process
      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadPayables(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  //search

  const [receivableSummaryList, setReceivableSummaryList] = useState([]);
  const [searchBoxShow, setSearchBoxShow] = useState(false);
  const [searchBoxData, setSearchBoxData] = useState({
    rcvbl_refno: "",
    rcvbl_cntct: "",
    rcvbl_trdat: "", //new Date().toLocaleString().split("T")[0],
    rcvbl_descr: "",
    search_option: "last_3_days",
  });


  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "rcvbl_trdat") {
      const dateValue = e.value
        ? new Date(e.value).toLocaleString().split("T")[0]
        : null;
      setSearchBoxData({ ...searchBoxData, [name]: dateValue });
    } else {
      setSearchBoxData({ ...searchBoxData, [name]: value });
    }
  };

  const loadReceivableSummary = async () => {
    try {
      //console.log("loadBookings:");
      const response = await receivablesAPI.getReceivableSummary({
        rcvbl_users: user.users_users,
        rcvbl_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //console.log("loadPaymentDetails:", JSON.stringify(response));

      setReceivableSummaryList([]);
      if (response.data && response.data.length > 0) {
        setSearchBoxShow(false);
        setReceivableSummaryList(response.data);
      }
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };



  const handleSearch = () => {
    const hasValue = Object.values(searchBoxData).some(
      (value) => value !== "" && value !== null && value !== undefined,
    );

    if (!hasValue) {
      showToast("error", "Error", "Please enter at least one search criteria");
      return;
    }

    loadReceivableSummary();
  };

  const searchOptions = [
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
  ];

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
    //other functions
    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
    receivableSummaryList
  };
};
