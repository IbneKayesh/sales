import { useState, useEffect } from "react";
import validate, { generateDataModel } from "@/models/validator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";
import { stringifyAttributes } from "@/utils/jsonParser";
import tmib_mtrsf from "@/models/inventory/tmib_mtrsf.json";
import { itransferAPI } from "@/api/inventory/itransferAPI";

const dataModel = generateDataModel(tmib_mtrsf, { edit_stop: 0 });

export const useItransfer = () => {
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

  const loadTransfer = async () => {
    try {
      //console.log("loadTransfer:");
      const response = await itransferAPI.getAll({
        mtrsf_users: user.users_users,
        mtrsf_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //console.log("loadTransfer:", JSON.stringify(response));

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
    //loadTransfer();
  }, []);

  const loadTransferDetails = async (id) => {
    try {
      //console.log("loadTransferDetails:", id);
      const response = await itransferAPI.getDetails({
        ctrsf_mtrsf: id,
      });
      //console.log("loadTransferDetails:", JSON.stringify(response));
      setFormDataItemList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadTransferExpenses = async (id) => {
    try {
      //console.log("loadTransferExpenses:", id);
      const response = await itransferAPI.getExpenses({
        expns_refid: id,
      });
      //console.log("loadTransferExpenses:", JSON.stringify(response));
      setFormDataExpensesList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_mtrsf);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      ...dataModel,
      mtrsf_users: user.users_users,
      mtrsf_bsins: user.users_bsins,
    });
    //console.log("handleClear:", JSON.stringify(dataModel));
    setErrors({});

    //options
    setFormDataItemList([]);
    setFormDataExpensesList([]);

    //hide search box
    setSearchBoxShow(false);
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    //console.log("business:", business.bsins_prtrn);
    if (!business.bsins_tstrn) {
      showToast("error", "Error", "Transfer is not active");
      return;
    }
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    //console.log("edit: " + JSON.stringify(data));
    loadTransferDetails(data.id);
    loadTransferExpenses(data.id);
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await itransferAPI.delete(rowData);

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
    loadTransfer();
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
      const newErrors = validate(formData, tmib_mtrsf);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //0 :: Unpaid, 1 :: Paid, 2 :: Partial
     

      const formDataItemListNew = formDataItemList.map((item) => ({
        ...item,
        ctrsf_attrb: stringifyAttributes(item.ctrsf_attrb),
      }));

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        mtrsf_users: user.users_users,
        mtrsf_bsins: user.users_bsins,
        mtrsf_trdat: formatDateForAPI(formData.mtrsf_trdat),
        mtrsf_ispst: 1,
        user_id: user.id,
        tmib_ctrsf: formDataItemListNew,
        tmib_expns: formDataExpensesList,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await itransferAPI.update(formDataNew);
      } else {
        response = await itransferAPI.create(formDataNew);
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
      //await closingProcessAPI("inventory-transfer", user.users_bsins);

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadTransfer(); // make sure we wait for updated data
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
    mtrsf_bsins_to: "",
    mtrsf_trnno: "",
    mtrsf_trdat: "", //new Date().toLocaleString().split("T")[0],
    mtrsf_refno: "",
    search_option: "last_3_days",
  });

  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "mtrsf_trdat") {
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

    loadTransfer();
  };

  const searchOptions = [
    { name: "mtrsf_ispst", label: "Unposted" },
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
  ];


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
    setFormDataItemList,
    setFormDataExpensesList,

    //search
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,

  };
};
