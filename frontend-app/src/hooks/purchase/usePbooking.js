import { useState, useEffect } from "react";
import tmpb_pmstr from "@/models/purchase/tmpb_pmstr.json";
import validate, { generateDataModel } from "@/models/validator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { pbookingAPI } from "@/api/purchase/pbookingAPI";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const dataModel = generateDataModel(tmpb_pmstr, { edit_stop: 0 });

export const usePbooking = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  //options
  const [formDataItemList, setFormDataItemList] = useState([]);
  const [formDataPaymentList, setFormDataPaymentList] = useState([]);

  const loadBookings = async () => {
    try {
      const response = await pbookingAPI.getAll({
        pmstr_users: user.users_users,
        pmstr_bsins: user.users_bsins,
        ...searchBoxData
      });
      //response = { success, message, data }
      //console.log("loadBookings:", JSON.stringify(response));

      setDataList(response.data);
      if (response.data.length > 0) {
        setSearchBoxShow(false);
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
        bking_pmstr: id,
      });
      //console.log("loadBookingDetails:", JSON.stringify(response));
      setFormDataItemList(response.data);
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
        rcvpy_refid: id,
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
    const newErrors = validate({ ...formData, [field]: value }, tmpb_pmstr);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      ...dataModel,
      pmstr_users: user.users_users,
      pmstr_bsins: user.users_bsins,
      pmstr_odtyp: "Purchase Booking",
    });
    //console.log("handleClear:", JSON.stringify(dataModel));
    setErrors({});

    //options
    setFormDataItemList([]);
    setFormDataPaymentList([]);

    //hide search box
    setSearchBoxShow(false);
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
    loadBookingDetails(data.id);
    loadBookingPayment(data.id);
    //console.log("edit: " + JSON.stringify(data));
    // setFormData({
    //   ...data,
    //   pmstr_ispad: String(data.pmstr_ispad),
    //   pmstr_vatpy: String(data.pmstr_vatpy),
    //   pmstr_ispst: String(data.pmstr_ispst),
    //   pmstr_isret: String(data.pmstr_isret),
    //   pmstr_iscls: String(data.pmstr_iscls),
    //   pmstr_vatcl: String(data.pmstr_vatcl),
    //   pmstr_hscnl: String(data.pmstr_hscnl),
    // });
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
          "Operation " + (response.success ? "successful" : "failed")
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
      //console.log("formData:", JSON.stringify(formData));
      //console.log("formDataItemList :", JSON.stringify(formDataItemList));
      //console.log("formDataPaymentList :", JSON.stringify(formDataPaymentList));

      //return;

      setIsBusy(true);

      // Validate form
      const newErrors = validate(formData, tmpb_pmstr);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //0 :: Unpaid, 1 :: Paid, 2 :: Partial
      const paidStatus =
        Number(formData.pmstr_pyamt) === Number(formData.pmstr_duamt)
          ? "0"
          : Number(formData.pmstr_duamt) === 0
          ? "1"
          : "2";

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        pmstr_users: user.users_users,
        pmstr_bsins: user.users_bsins,
        pmstr_trdat: formatDateForAPI(formData.pmstr_trdat),
        pmstr_ispad: paidStatus,
        user_id: user.id,
        tmpb_bking: formDataItemList,
        tmtb_rcvpy: formDataPaymentList,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await pbookingAPI.update(formDataNew);
      } else {
        response = await pbookingAPI.create(formDataNew);
      }

      console.log("handleSave:", JSON.stringify(response));

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      //call update process
      await closingProcessAPI("purchase-booking", user.users_bsins);

      // Clear form & reload
      //handleClear();
      //setCurrentView("list");
      //await loadBookings(); // make sure we wait for updated data
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
    pmstr_cntct: "",
    pmstr_trnno: "",
    pmstr_trdat: new Date().toLocaleString().split("T")[0],
    pmstr_refno: "",
  });

  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "pmstr_trdat") {
      const dateValue = e.value
        ? new Date(e.value).toLocaleString().split("T")[0]
        : null;
      setSearchBoxData({ ...searchBoxData, [name]: dateValue });
    } else {
      setSearchBoxData({ ...searchBoxData, [name]: value });
    }
  };

  const handleSearch = () => {
    //console.log("handleSearch", searchBoxData);
    loadBookings();
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
    formDataPaymentList,
    setFormDataItemList,
    setFormDataPaymentList,

    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
  };
};
