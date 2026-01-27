import { useState, useEffect } from "react";
import tmpb_minvc from "@/models/purchase/tmpb_minvc.json";
import validate, { generateDataModel } from "@/models/validator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { pinvoiceAPI } from "@/api/purchase/pinvoiceAPI";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";
import { stringifyAttributes } from "@/utils/jsonParser";

const dataModel = generateDataModel(tmpb_minvc, { edit_stop: 0 });

export const usePinvoice = () => {
  const { user, business } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  //options
  const [formDataItemList, setFormDataItemList] = useState([]);
  const [formDataExpensesList, setFormDataExpensesList] = useState([]);
  const [formDataPaymentList, setFormDataPaymentList] = useState([]);

  const loadInvoice = async () => {
    try {
      //console.log("loadInvoice:");
      const response = await pinvoiceAPI.getAll({
        minvc_users: user.users_users,
        minvc_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //console.log("loadInvoice:", JSON.stringify(response));

      setDataList([]);
      if (response.data && response.data.length > 0) {
        setSearchBoxShow(false);
        setDataList(response.data);
      }
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    //loadInvoice();
  }, []);

  const loadInvoiceDetails = async (id) => {
    try {
      //console.log("loadInvoiceDetails:", id);
      const response = await pinvoiceAPI.getDetails({
        cinvc_minvc: id,
      });
      //console.log("loadInvoiceDetails:", JSON.stringify(response));
      setFormDataItemList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadInvoiceExpenses = async (id) => {
    try {
      //console.log("loadInvoiceExpenses:", id);
      const response = await pinvoiceAPI.getExpenses({
        expns_refid: id,
      });
      //console.log("loadInvoiceExpenses:", JSON.stringify(response));
      setFormDataExpensesList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadInvoicePayment = async (id) => {
    try {
      //console.log("loadInvoicePayment:", id);
      const response = await pinvoiceAPI.getPayment({
        paybl_refid: id,
      });
      //console.log("loadInvoicePayment:", JSON.stringify(response));
      setFormDataPaymentList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmpb_minvc);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      ...dataModel,
      minvc_users: user.users_users,
      minvc_bsins: user.users_bsins,
    });
    //console.log("handleClear:", JSON.stringify(dataModel));
    setErrors({});

    //options
    setFormDataItemList([]);
    setFormDataExpensesList([]);
    setFormDataPaymentList([]);

    //hide search box
    setSearchBoxShow(false);
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    //console.log("business:", business.bsins_prtrn);
    //check if business is active
    if (!business.bsins_prtrn) {
      showToast("error", "Error", "Purchase is not active");
      return;
    }
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    loadInvoiceDetails(data.id);
    loadInvoiceExpenses(data.id);
    loadInvoicePayment(data.id);
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await pinvoiceAPI.delete(rowData);

      // Remove deleted business from local state
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
    loadInvoice();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // console.log("formData:", JSON.stringify(formData));
      // console.log("formDataItemList :", JSON.stringify(formDataItemList));
      // console.log("formDataExpensesList :", JSON.stringify(formDataExpensesList));
      // console.log("formDataPaymentList :", JSON.stringify(formDataPaymentList));

      // return;

      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmpb_minvc);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //0 :: Unpaid, 1 :: Paid, 2 :: Partial
      const paidStatus =
        Number(formData.minvc_pdamt) === 0
          ? "0"
          : Number(formData.minvc_duamt) === 0
            ? "1"
            : "2";

      // console.log(
      //   "paidStatus:",
      //   paidStatus
      // );
      // return;

      const formDataItemListNew = formDataItemList.map((item) => ({
        ...item,
        cinvc_attrb: stringifyAttributes(item.cinvc_attrb),
      }));

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        minvc_users: user.users_users,
        minvc_bsins: user.users_bsins,
        minvc_trdat: formatDateForAPI(formData.minvc_trdat),
        minvc_ispad: paidStatus,
        user_id: user.id,
        tmpb_cinvc: formDataItemListNew,
        tmpb_expns: formDataExpensesList,
        tmtb_paybl: formDataPaymentList,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await pinvoiceAPI.update(formDataNew);
      } else {
        response = await pinvoiceAPI.create(formDataNew);
      }

      //console.log("handleSave:", JSON.stringify(response));

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );

      //call update process
      await closingProcessAPI("purchase-invoice", user.users_bsins);

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadInvoice(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  //search

  const [searchBoxShow, setSearchBoxShow] = useState(false);
  const [searchBoxData, setSearchBoxData] = useState({
    minvc_cntct: "",
    minvc_trnno: "",
    minvc_trdat: "", //new Date().toLocaleString().split("T")[0],
    minvc_refno: "",
    search_option: "minvc_ispad",
  });

  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "minvc_trdat") {
      const dateValue = e.value
        ? new Date(e.value).toLocaleString().split("T")[0]
        : null;
      setSearchBoxData({ ...searchBoxData, [name]: dateValue });
    } else {
      setSearchBoxData({ ...searchBoxData, [name]: value });
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

    loadInvoice();
  };

  const searchOptions = [
    { name: "minvc_ispad", label: "Unpaid" },
    { name: "minvc_ispst", label: "Unposted" },
    { name: "minvc_iscls", label: "Closed" },
    { name: "minvc_vatcl", label: "VAT Collected" },
    { name: "minvc_hscnl", label: "Cancelled" },
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
  ];

  //cancel Invoice items
  const [cancelledRows, setCancelledRows] = useState([]);
  const [cancelledPayment, setCancelledPayment] = useState({});

  const handleCancelInvoiceItems = async (rowData) => {
    try {
      // Call API, unwrap { message, data }

      const formDataNew = {
        ...formData,
        pmstr_users: user.users_users,
        pmstr_bsins: user.users_bsins,
        pmstr_cnamt: rowData.rcvpy_pyamt,
        user_id: user.id,
        tmtb_rcvpy: rowData,
      };
      const response = await pinvoiceAPI.cancelInvoiceItems(formDataNew);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Cancelled" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed"),
      );
      //reset cancelled rows
      setCancelledRows([]);
      setCancelledPayment({});
      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadInvoice(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error canceling data:", error);
      showToast("error", "Error", error?.message || "Failed to cancel data");
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    setErrors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    //options
    formDataItemList,
    formDataExpensesList,
    formDataPaymentList,
    setFormDataItemList,
    setFormDataExpensesList,
    setFormDataPaymentList,

    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,

    //cancel Invoice items
    cancelledRows,
    setCancelledRows,
    handleCancelInvoiceItems,
    setCancelledPayment,
  };
};
