import { useState, useEffect } from "react";
import { payablesAPI } from "@/api/accounts/payablesAPI";
import tmtb_paybl from "@/models/accounts/tmtb_paybl.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification, useToast } from "@/hooks/useAppUI";
import { formatDateForAPI } from "@/utils/datetime";

const dataModel = generateDataModel(tmtb_paybl, { edit_stop: 0 });

export const usePayables = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadPayables = async () => {
    try {
      setIsBusy(true);
      const response = await payablesAPI.getAll({
        paybl_users: user.users_users,
        paybl_bsins: user.users_bsins,
      });
      //response = { success, message, data }

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Payable",
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
    loadPayables();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_paybl);
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
    setFormData({ ...dataModel, ...data, paybl_dbamt: data.minvc_duamt });
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
      const response = await payablesAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Payable - ${rowData.id} ${
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
        summary: "Payable",
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
    loadPayables();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_paybl);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      if (formData.paybl_dbamt > formData.minvc_duamt) {
        showToast(
          "error",
          "Error",
          "Payment amount cannot be greater than payable amount",
        );
        return;
      }
      console.log("formData", formData);
      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        paybl_trdat: formatDateForAPI(formData.paybl_trdat),
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await payablesAPI.update(formDataNew);
      } else {
        response = await payablesAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Payable - ${formDataNew.paybl_refno} ${
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
        // Clear form & reload
        handleClear();
        setCurrentView("list");
        await loadPayables(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Brand",
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

  const [paymentSummaryList, setPaymentSummaryList] = useState([]);
  const [searchBoxShow, setSearchBoxShow] = useState(false);
  const [searchBoxData, setSearchBoxData] = useState({
    paybl_refno: "",
    paybl_cntct: "",
    paybl_trdat: "", //new Date().toLocaleString().split("T")[0],
    paybl_descr: "",
    search_option: "last_3_days",
  });

  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "paybl_trdat") {
      const dateValue = e.value
        ? new Date(e.value).toLocaleString().split("T")[0]
        : null;
      setSearchBoxData({ ...searchBoxData, [name]: dateValue });
    } else {
      setSearchBoxData({ ...searchBoxData, [name]: value });
    }
  };

  const loadPaymentSummary = async () => {
    try {
      setIsBusy(true);
      //console.log("loadBookings:");
      const response = await payablesAPI.getPaymentSummary({
        paybl_users: user.users_users,
        paybl_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //console.log("loadPaymentSummary:", JSON.stringify(response));
      //return;
      setPaymentSummaryList([]);
      if (response.data && response.data.length > 0) {
        setSearchBoxShow(false);
        setPaymentSummaryList(response.data);
      }
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Summary",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
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

    loadPaymentSummary();
  };

  const searchOptions = [
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
  ];

  return {
    isBusy,
    dataList,
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
    paymentSummaryList,
  };
};
