import { useState, useEffect } from "react";
import { accountsAPI } from "@/api/accounts/accountsAPI";
import tmtb_bacts from "@/models/accounts/tmtb_bacts.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { formatDateForAPI } from "@/utils/datetime";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmtb_bacts, { edit_stop: 0 });

export const useAccounts = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadAccounts = async () => {
    try {
      setIsBusy(true);
      const response = await accountsAPI.getAll({
        bacts_users: user.users_users,
        bacts_bsins: user.users_bsins,
      });
      //response = { success, message, data }

      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Accounts",
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
    loadAccounts();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_bacts);
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
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      // Call API, unwrap { message, data }

      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await accountsAPI.delete(formDataNew);

      // Remove deleted account from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Accounts - ${rowData.bacts_bankn} ${
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
        summary: "Accounts",
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
    loadAccounts();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_bacts);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      // Ensure id exists (for create)
      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        bacts_users: user.users_users,
        bacts_bsins: user.users_bsins,
        bacts_opdat: formatDateForAPI(formData.bacts_opdat),
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await accountsAPI.update(formDataNew);
      } else {
        response = await accountsAPI.create(formDataNew);
      }

      // Update toast using API message

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Accounts - ${formDataNew.bacts_bankn} ${
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
        await loadAccounts(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Accounts",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSetDefault = async (rowData) => {
    try {
      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await accountsAPI.setDefault(formDataNew);

      if (response.success) {
        const updatedList = dataList.map((s) => {
          if (s.id === rowData.id) {
            return {
              ...s,
              bacts_isdef: s.bacts_isdef === true ? false : true,
            };
          }
          return s;
        });

        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Set Default",
        detail: `Accounts - ${rowData.bacts_bankn} ${
          response.success ? "is default by" : "default failed by"
        } ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });
    } catch (error) {
      console.error("Error setting default data:", error);
      notify({
        severity: "error",
        summary: "Accounts",
        detail: error?.message || "Failed to default data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  const [accountsListDdl, setAccountsListDdl] = useState([]);
  const fetchAccountsListDdl = async () => {
    if (accountsListDdl.length > 0) return;

    try {
      if (dataList.length > 0) {
        const ddlData = dataList.map((item) => ({
          value: item.id,
          label: item.bacts_bankn,
          bacts_crbln: item.bacts_crbln,
        }));
        setAccountsListDdl(ddlData);
      } else {
        const response = await accountsAPI.getAll({
          bacts_users: user.users_users,
        });
        //console.log("headListDdl: ", response.data);
        //response = { success, message, data }
        const ddlData = response.data.map((item) => ({
          value: item.id,
          label: item.bacts_bankn,
          bacts_crbln: item.bacts_crbln,
        }));
        setAccountsListDdl(ddlData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

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
    handleSetDefault,
    //other functions
    accountsListDdl,
    fetchAccountsListDdl,
  };
};
