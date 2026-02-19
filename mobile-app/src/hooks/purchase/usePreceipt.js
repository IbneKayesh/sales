import { useState, useEffect } from "react";
import tmpb_mrcpt from "@/models/purchase/tmpb_mrcpt.json";
import validate, { generateDataModel } from "@/models/validator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { preceiptAPI } from "@/api/purchase/preceiptAPI";
import { generateGuid } from "@/utils/guid";
import { formatDateForAPI } from "@/utils/datetime";
import { stringifyAttributes } from "@/utils/jsonParser";
import { configsAPI } from "@/api/setup/configsAPI";

const dataModel = generateDataModel(tmpb_mrcpt, { edit_stop: 0 });

export const usePreceipt = () => {
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

  //configs
  const [configs, setConfigs] = useState({});

  const loadConfigs = async () => {
    try {
      const response = await configsAPI.getAll({
        ucnfg_users: user.users_users,
        ucnfg_cname: "Purchase",
        ucnfg_gname: "Receipt",
      });
      const configsObj = Object.fromEntries(
        response.data.map(({ ucnfg_label, ucnfg_value }) => [
          ucnfg_label,
          ucnfg_value,
        ]),
      );
      //console.log("configsObj:", configsObj);
      setConfigs((prev) => ({
        ...prev,
        mrcpt_vatpy: Number(configsObj["mrcpt_vatpy"]) ?? prev.mrcpt_vatpy,
      }));
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadReceipts = async () => {
    try {
      const response = await preceiptAPI.getAll({
        mrcpt_users: user.users_users,
        mrcpt_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //response = { success, message, data }
      //console.log("loadReceipts:", JSON.stringify(response));

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
    loadConfigs();
  }, []);

  const loadReceiptDetails = async (id) => {
    try {
      //console.log("loadReceiptDetails:", id);
      const response = await preceiptAPI.getDetails({
        crcpt_mrcpt: id,
      });
      //console.log("loadReceiptDetails:", JSON.stringify(response));
      setFormDataItemList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const loadReceiptExpenses = async (id) => {
    try {
      //console.log("loadReceiptExpenses:", id);
      const response = await preceiptAPI.getExpenses({
        expns_refid: id,
      });
      //console.log("loadReceiptExpenses:", JSON.stringify(response));
      setFormDataExpensesList(response.data);
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
        paybl_refid: id,
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
    const newErrors = validate({ ...formData, [field]: value }, tmpb_mrcpt);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData({
      ...dataModel,
      mrcpt_users: user.users_users,
      mrcpt_bsins: user.users_bsins,
      mrcpt_vatpy: configs.mrcpt_vatpy || 0,
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
    loadReceiptDetails(data.id);
    loadReceiptExpenses(data.id);
    loadReceiptPayment(data.id);
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
          "Operation " + (response.success ? "successful" : "failed"),
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadReceipts();
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
      const newErrors = validate(formData, tmpb_mrcpt);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      //0 :: Unpaid, 1 :: Paid, 2 :: Partial
      const paidStatus =
        Number(formData.mrcpt_pdamt) === Number(formData.mrcpt_duamt)
          ? "0"
          : Number(formData.mrcpt_duamt) === 0
            ? "1"
            : "2";

      const formDataItemListNew = formDataItemList.map((item) => ({
        ...item,
        crcpt_attrb: stringifyAttributes(item.crcpt_attrb),
      }));

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        mrcpt_users: user.users_users,
        mrcpt_bsins: user.users_bsins,
        mrcpt_trdat: formatDateForAPI(formData.mrcpt_trdat),
        mrcpt_ispad: 1,
        user_id: user.id,
        tmpb_crcpt: formDataItemListNew,
        tmpb_expns: formDataExpensesList,
        //tmtb_paybl: formDataPaymentList,
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
          "Operation " + (response.success ? "successful" : "failed"),
      );

      //call update process
      //await closingProcessAPI("purchase-receipt", user.users_bsins);

      // Clear form & reload
      handleClear();
      setCurrentView("list");
      await loadReceipts(); // make sure we wait for updated data
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
    mrcpt_cntct: "",
    mrcpt_trnno: "",
    mrcpt_trdat: "", //new Date().toLocaleString().split("T")[0],
    mrcpt_refno: "",
    search_option: "last_3_days",
  });

  const handleChangeSearchInput = (e) => {
    const { name, value } = e.target;
    if (name === "mrcpt_trdat") {
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
    //console.log("handleSearch:", searchBoxData);
    if (!hasValue) {
      showToast("error", "Error", "Please enter at least one search criteria");
      return;
    }

    loadReceipts();
  };

  const searchOptions = [
    { name: "mrcpt_ispad", label: "Unpaid" },
    { name: "mrcpt_ispst", label: "Unposted" },
    { name: "mrcpt_iscls", label: "Closed" },
    { name: "mrcpt_vatcl", label: "VAT Collected" },
    { name: "mrcpt_hscnl", label: "Cancelled" },
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
  ];

  //cancel Receipt items
  const [cancelledRows, setCancelledRows] = useState([]);
  const [cancelledPayment, setCancelledPayment] = useState({});

  const handleCancelReceiptItems = async (rowData) => {
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
      const response = await preceiptAPI.cancelReceiptItems(formDataNew);

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
      await loadReceipts(); // make sure we wait for updated data
    } catch (error) {
      console.error("Error canceling data:", error);
      showToast("error", "Error", error?.message || "Failed to cancel data");
    }
  };

  //fetch receipt items
  const fetchAvailableReceiptItems = async (id) => {
    try {
      const response = await preceiptAPI.getAvailableReceiptItems({
        mrcpt_users: user.users_users,
        mrcpt_bsins: user.users_bsins,
        mrcpt_cntct: id,
      });
      //console.log("fetchAvailableReceiptItems:", JSON.stringify(response));
      setFormDataItemList(response.data);
    } catch (error) {
      console.error("Error fetching receipt items:", error);
      showToast(
        "error",
        "Error",
        error?.message || "Failed to fetch receipt items",
      );
    }
  };

  return {
    configs,
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

    //cancel Receipt items
    cancelledRows,
    setCancelledRows,
    handleCancelReceiptItems,
    setCancelledPayment,

    //fetch receipt items
    fetchAvailableReceiptItems,
  };
};
