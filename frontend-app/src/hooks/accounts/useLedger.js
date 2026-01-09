import { useState, useEffect } from "react";
import { accountsLedgerAPI } from "@/api/accounts/accountsLedgerAPI";
import tmtb_ledgr from "@/models/accounts/tmtb_ledgr.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDateForAPI } from "@/utils/datetime";
import { closingProcessAPI } from "@/api/setup/closingProcessAPI";

const dataModel = generateDataModel(tmtb_ledgr, { edit_stop: 0 });

export const useLedger = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const [ledgerList, setLedgerList] = useState([]);
  const [selectedHead, setSelectedHead] = useState(null);

  const loadLedgers = async () => {
    try {
      const response = await accountsLedgerAPI.getAll({
        ledgr_users: user.users_users,
      });
      //response = { success, message, data }
      //console.log("response", response);

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadLedgers();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_ledgr);
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

  const handleEdit = (ledger) => {
    //console.log("ledger: " + JSON.stringify(ledger));

    const amount =
      Number(ledger.ledgr_dbamt) !== 0
        ? ledger.ledgr_dbamt
        : ledger.ledgr_cramt;

    setFormData({
      ...ledger,
      ledgr_dbamt: amount,
    });
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }
      const response = await accountsLedgerAPI.delete(rowData);

      // Remove deleted business from local state
      const updatedList = dataList.filter((s) => s.id !== rowData.id);
      setDataList(updatedList);

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      //call update process
      await closingProcessAPI("Account Ledger", user.users_users);
    } catch (error) {
      console.error("Error deleting data:", error);
      showToast("error", "Error", error?.message || "Failed to delete data");
    }
  };

  const handleRefresh = () => {
    loadLedgers(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      //console.log("handleSaveLedger called", selectedHead);

      if (!selectedHead) {
        showToast("error", "Validation Error", "Please select a Head Name.");
        return;
      }

      const amount = Number(formData.ledgr_dbamt) || 0;
      if (amount === 0) {
        showToast("error", "Validation Error", "Please enter a valid amount.");
        return;
      }
      let updatedFormData = {
        ...formData,
      };

      if (selectedHead.trhed_grtyp === "In") {
        updatedFormData = {
          ...updatedFormData,
          ledgr_dbamt: amount,
          ledgr_cramt: 0,
        };
      } else if (selectedHead.trhed_grtyp === "Out") {
        updatedFormData = {
          ...updatedFormData,
          ledgr_dbamt: 0,
          ledgr_cramt: amount,
        };
      } else {
        showToast("error", "Validation Error", "Invalid Head Group Type.");
        return;
      }

      setIsBusy(true);
      const newErrors = validate(formData, tmtb_ledgr);
      setErrors(newErrors);
      //console.log("handleSave: " + JSON.stringify(formData));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...updatedFormData,
        id: formData.id || generateGuid(),
        ledgr_users: user.users_users,
        ledgr_trdat: formatDateForAPI(formData.ledgr_trdat),
        user_id: user.id,
      };

      //console.log("formDataNew: " + JSON.stringify(formDataNew));

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await accountsLedgerAPI.update(formDataNew);
      } else {
        response = await accountsLedgerAPI.create(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      loadLedgers();
      handleClear();
      setCurrentView("list");

      //call update process
      await closingProcessAPI("Account Ledger", user.users_users);
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

  //transfer
  const handleAddNewTransfer = () => {
    handleClear();
    setCurrentView("transfer");
    setFormData({
      ...dataModel,
      ledgr_bacts_from: "",
      ledgr_bacts_to: "",
    });
  };

  const handleSaveTransfer = async (e) => {
    e.preventDefault();
    try {
      console.log("handleSaveTransfer called", formData);

      const amount = Number(formData.ledgr_dbamt) || 0;
      if (amount <= 0) {
        showToast(
          "error",
          "Validation Error",
          "Transfer amount must be greater than 0"
        );
        return;
      }

      if (formData.ledgr_bacts_from === formData.ledgr_bacts_to) {
        showToast(
          "error",
          "Validation Error",
          "Account and To Account cannot be the same."
        );
        return;
      }
      const updatedFormData = {
        ...formData,
        ledgr_trhed: "sandgrain",
        ledgr_cntct: "sandgrain",
        ledgr_bacts: "sandgrain"

      };

      setIsBusy(true);
      const newErrors = validate(updatedFormData, tmtb_ledgr);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...updatedFormData,
        id: formData.id || generateGuid(),
        ledgr_bsins: user.users_bsins,
        ledgr_users: user.users_users,
        ledgr_trdat: formatDateForAPI(formData.ledgr_trdat),
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (!formData.id) {
        response = await accountsLedgerAPI.createTransfer(formDataNew);
      } else {
        //response = await accountsLedgerAPI.updateTransfer(formDataNew);
      }

      // Update toast using API message
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message ||
          "Operation " + (response.success ? "successful" : "failed")
      );

      loadLedgers();
      handleClear();
      setCurrentView("list");

      //call update process
      await closingProcessAPI("Account Ledger", user.users_users);
    } catch (error) {
      console.error("Error saving data:", error);
      showToast("error", "Error", error?.message || "Failed to save data");
    } finally {
      setIsBusy(false);
    }
  };

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
    //options
    selectedHead,
    setSelectedHead,
    //transfer
    handleAddNewTransfer,
    handleSaveTransfer,
  };
};
