import { useState, useEffect } from "react";
import { expensesAPI } from "@/api/accounts/expensesAPI";
import tmtb_exptr from "@/models/accounts/tmtb_exptr.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { formatDateForAPI } from "@/utils/datetime";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmtb_exptr, { edit_stop: 0 });

export const useExpenses = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadExpenses = async () => {
    try {
      const response = await expensesAPI.getAll({
        exptr_users: user.users_users,
        exptr_bsins: user.users_bsins,
        ...searchBoxData,
      });
      //response = { success, message, data }

      console.log("response", response)

      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Expenses",
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
    loadExpenses();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_exptr);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});

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
      const response = await expensesAPI.delete(formDataNew);

      // Remove deleted business from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Expenses - ${rowData.exptr_trnte} ${
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
        summary: "Expenses",
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
    loadAccountsHeads();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_exptr);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        exptr_users: user.users_users,
        exptr_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await expensesAPI.update(formDataNew);
      } else {
        response = await expensesAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Expenses - ${formDataNew.exctg_cname} ${
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
        await loadExpenses(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Expenses",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //other functions
  //search

  const [searchBoxShow, setSearchBoxShow] = useState(false);
  const [searchBoxData, setSearchBoxData] = useState({
    test: "",
    exptr_exctg: "",
    exptr_trdat: "", //new Date().toLocaleString().split("T")[0],
    exptr_trnte: "",
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
        summary: "Expenses",
        detail: "Please enter at least one search criteria",
        toast: true,
        notification: false,
        log: false,
      });
      return;
    }

    loadExpenses();
  };

  const searchOptions = [
    { name: "last_3_days", label: "Last 3 Days" },
    { name: "last_7_days", label: "Last 7 Days" },
    { name: "last_15_days", label: "Last 15 Days" },
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
    searchBoxShow,
    setSearchBoxShow,
    searchBoxData,
    handleChangeSearchInput,
    handleSearch,
    searchOptions,
  };
};
