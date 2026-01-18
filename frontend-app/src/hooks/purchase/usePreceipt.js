import { useState, useEffect } from "react";
import tmpb_pmstr from "@/models/purchase/tmpb_pmstr.json";
import validate, { generateDataModel } from "@/models/validator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { preceiptAPI } from "@/api/purchase/preceiptAPI";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const dataModel = generateDataModel(tmpb_pmstr, { edit_stop: 0 });

export const usePreceipt = () => {
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

  const loadReceipts = async () => {
    try {
      const response = await preceiptAPI.getAll({
        pmstr_users: user.users_users,
        pmstr_bsins: user.users_bsins,
        ...searchBoxData
      });
      //response = { success, message, data }
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

  const loadReceiptDetails = async (id) => {
    try {
      //console.log("loadReceiptDetails:", id);
      const response = await preceiptAPI.getDetails({
        recpt_pmstr: id,
      });
      //console.log("loadReceiptDetails:", JSON.stringify(response));
      setFormDataItemList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadReceiptPayment = async (id) => {
    try {
      //console.log("loadReceiptPayment:", id);
      const response = await preceiptAPI.getPayment({
        rcvpy_refid: id,
      });
      //console.log("loadReceiptPayment:", JSON.stringify(response));
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
      pmstr_odtyp: "Purchase Receipt",
      pmstr_vatpy: 1,
      pmstr_ispst: 1,
    });
    //console.log("handleClear:", JSON.stringify(dataModel));
    setErrors({});

    //options
    setFormDataItemList([]);
    //setFormDataPaymentList([]);

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
    loadReceiptDetails(data.id);
    //loadReceiptPayment(data.id);
    //console.log("edit: " + JSON.stringify(data));
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await preceiptAPI.delete(rowData);

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
        pmstr_ispad: 1, //full paid by default
        user_id: user.id,
        tmpb_recpt: formDataItemList,
        //tmtb_rcvpy: formDataPaymentList,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await preceiptAPI.update(formDataNew);
      } else {
        response = await preceiptAPI.create(formDataNew);
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
      await closingProcessAPI("purchase-receipt", user.users_bsins);

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
    pmstr_refno: ""
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
    loadReceipts();
  };

  const fetchAvailableReceiptItems = async (id) => {
    //console.log("fetchAvailableReceiptItems", id);
    try {
      const response = await preceiptAPI.getAvailableReceipt({
        pmstr_users: user.users_users,
        pmstr_bsins: user.users_bsins,
        pmstr_cntct: id,
      });
      //response = { success, message, data }
      //console.log("fetchAvailableReceiptItems:", JSON.stringify(response));

      setFormDataItemList(response.data);
      
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
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
    formDataPaymentList,
    setFormDataItemList,
    setFormDataPaymentList,

    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,

    //options
    fetchAvailableReceiptItems
  };
};
