import { useState, useEffect } from "react";
import tmpb_mbkng from "@/models/purchase/tmpb_mbkng.json";
import validate, { generateDataModel } from "@/models/validator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { pbookingAPI } from "@/api/purchase/pbookingAPI";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const dataModel = generateDataModel(tmpb_mbkng, { edit_stop: 0 });

export const usePbooking = () => {
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

  const loadBookings = async () => {
    try {
      //console.log("loadBookings:");
      const response = await pbookingAPI.getAll({
        mbkng_users: user.users_users,
        mbkng_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //console.log("loadBookings:", JSON.stringify(response));

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
    //loadBookings();
  }, []);

  const loadBookingDetails = async (id) => {
    try {
      //console.log("loadBookingDetails:", id);
      const response = await pbookingAPI.getDetails({
        cbkng_mbkng: id,
      });
      //console.log("loadBookingDetails:", JSON.stringify(response));
      setFormDataItemList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadBookingExpenses = async (id) => {
    try {
      //console.log("loadBookingExpenses:", id);
      const response = await pbookingAPI.getExpenses({
        expns_refid: id,
      });
      //console.log("loadBookingExpenses:", JSON.stringify(response));
      setFormDataExpensesList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadBookingPayment = async (id) => {
    try {
      //console.log("loadBookingPayment:", id);
      const response = await pbookingAPI.getPayment({
        paybl_refid: id,
      });
      //console.log("loadBookingPayment:", JSON.stringify(response));
      setFormDataPaymentList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmpb_mbkng);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      ...dataModel,
      mbkng_users: user.users_users,
      mbkng_bsins: user.users_bsins,
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
    loadBookingDetails(data.id);
    loadBookingExpenses(data.id);
    loadBookingPayment(data.id);
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await pbookingAPI.delete(rowData);

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
    loadBookings();
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
      const newErrors = validate(formData, tmpb_mbkng);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //0 :: Unpaid, 1 :: Paid, 2 :: Partial
      const paidStatus =
        Number(formData.mbkng_pdamt) === 0
          ? "0"
          : Number(formData.mbkng_duamt) === 0
            ? "1"
            : "2";

            
      // console.log(
      //   "paidStatus:",
      //   paidStatus
      // );
      // return;

      const formDataItemListNew = formDataItemList.map((item) => {
        let attrb = item.cbkng_attrb || {}; // if empty, default to empty object
        // If it's an object, filter out empty values and stringify it.
        if (typeof attrb === "object") {
          const filteredAttrb = Object.fromEntries(
            Object.entries(attrb).filter(
              ([_, value]) =>
                value !== "" && value !== null && value !== undefined,
            ),
          );
          attrb = JSON.stringify(filteredAttrb);
        }
        return {
          ...item,
          cbkng_attrb: attrb,
        };
      });

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        mbkng_users: user.users_users,
        mbkng_bsins: user.users_bsins,
        mbkng_trdat: formatDateForAPI(formData.mbkng_trdat),
        mbkng_ispad: paidStatus,
        user_id: user.id,
        tmpb_cbkng: formDataItemListNew,
        tmpb_expns: formDataExpensesList,
        tmtb_paybl: formDataPaymentList,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await pbookingAPI.update(formDataNew);
      } else {
        response = await pbookingAPI.create(formDataNew);
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
      await closingProcessAPI("purchase-booking", user.users_bsins);

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadBookings(); // make sure we wait for updated data
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
    mbkng_cntct: "",
    mbkng_trnno: "",
    mbkng_trdat: "", //new Date().toLocaleString().split("T")[0],
    mbkng_refno: "",
    search_option: "mbkng_ispad",
  });

  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "mbkng_trdat") {
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

    loadBookings();
  };

  const searchOptions = [
    { name: "mbkng_ispad", label: "Unpaid" },
    { name: "mbkng_ispst", label: "Unposted" },
    { name: "mbkng_iscls", label: "Closed" },
    { name: "mbkng_vatcl", label: "VAT Collected" },
    { name: "mbkng_hscnl", label: "Cancelled" },
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
  ];

  //cancel booking items
  const [cancelledRows, setCancelledRows] = useState([]);
  const [cancelledPayment, setCancelledPayment] = useState({});

  const handleCancelBookingItems = async (rowData) => {
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
      const response = await pbookingAPI.cancelBookingItems(formDataNew);

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
      await loadBookings(); // make sure we wait for updated data
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

    //cancel booking items
    cancelledRows,
    setCancelledRows,
    handleCancelBookingItems,
    setCancelledPayment,
  };
};
