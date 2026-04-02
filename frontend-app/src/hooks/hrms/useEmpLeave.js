import { useState, useEffect } from "react";
import { empLeaveAPI } from "@/api/hrms/empLeaveAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmhb_lvntl from "@/models/hrms/tmhb_lvntl.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmhb_lvntl, { edit_stop: 0 });

export const useEmpLeave = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadEmpLeave = async () => {
    try {
      setIsBusy(true);
      const response = await empLeaveAPI.getAll({
        lvemp_users: user.users_users,
        lvemp_bsins: user.users_bsins,
        ...searchBoxData
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Leave Entitlement",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  // Fetch data from API on mount
  useEffect(() => {
    //loadLeaveEntitlement();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmhb_lvntl);
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
    setFormData(data);
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
      const response = await empLeaveAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Leave Entitlement - ${rowData.lvntl_atnst} ${
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
        summary: "Leave Entitlement",
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
    loadLeaveEntitlement();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate(formData, tmhb_lvntl);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        lvntl_users: user.users_users,
        lvntl_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };

      let response;
      if (formData.id) {
        response = await empLeaveAPI.update(formDataNew);
      } else {
        response = await empLeaveAPI.create(formDataNew);
      }

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Leave Entitlement - ${formDataNew.lvntl_atnst} ${
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
        handleClear();
        setCurrentView("list");
        await loadLeaveEntitlement();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Leave Entitlement",
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
  
    const [searchBoxShow, setSearchBoxShow] = useState(false);
    const [searchBoxData, setSearchBoxData] = useState({
      lvemp_yerid: "",
      lvemp_emply: "",
      search_option: "last_7_days",
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
        notify({
          severity: "error",
          summary: "Ledger",
          detail: "Please enter at least one search criteria",
          toast: true,
          notification: false,
          log: false,
        });
        return;
      }
  
      loadEmpLeave();
    };
  
    const searchOptions = [
      { name: "all", label: "All" },
      { name: "none", label: "None" },
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
    //search
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
  };
};
