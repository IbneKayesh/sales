import { useState, useEffect } from "react";
import { receivablesAPI } from "@/api/accounts/receivablesAPI";
import tmtb_rcvbl from "@/models/accounts/tmtb_rcvbl.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";
import { formatDateForAPI } from "@/utils/datetime";

const dataModel = generateDataModel(tmtb_rcvbl, { edit_stop: 0 });

export const useReceivables = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadReceivable = async () => {
    try {
      setIsBusy(true);
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
      notify({
        severity: "error",
        summary: "Receivable",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadReceivable();
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
    setFormData({ ...dataModel, ...data, rcvbl_dbamt: data.minvc_duamt });
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      // Call API, unwrap { message, data }
      const response = await receivablesAPI.delete(formDataNew);

      // Remove deleted account from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Receivable - ${rowData.id} ${
          response.success ? "is deleted by" : "delete failed by"
        } ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      notify({
        severity: "error",
        summary: "Receivable",
        detail: error?.message || "Failed to delete data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadReceivable();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_rcvbl);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (formData.rcvbl_dbamt > formData.minvc_duamt) {
        showToast(
          "error",
          "Error",
          "Payment amount cannot be greater than payable amount",
        );
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        rcvbl_trdat: formatDateForAPI(formData.rcvbl_trdat),
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await receivablesAPI.update(formDataNew);
      } else {
        response = await receivablesAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Receivable - ${formDataNew.rcvbl_refno} ${
          response.success
            ? formData.id
              ? "modified"
              : "created"
            : formData.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        //call update process
        // Clear form & reload
        handleClear();
        setCurrentView("list");
        await loadReceivable(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Receivable",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
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
    receivableSummaryList,
  };
};
