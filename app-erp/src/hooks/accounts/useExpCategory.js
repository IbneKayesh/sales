import { useState, useEffect } from "react";
import { businessAPI } from "@/api/setup/businessAPI";
import tmtb_exctg from "@/models/accounts/tmtb_exctg.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { formatDateForAPI } from "@/utils/datetime";
import { expCategoryAPI } from "@/api/accounts/expCategoryAPI";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmtb_exctg, { edit_stop: 0 });

export const useExpCategory = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadCategory = async () => {
    try {
      setIsBusy(true);
      const response = await expCategoryAPI.getAll({
        exctg_users: user.users_users,
        exctg_bsins: user.users_bsins,
      });
      //response = { success, message, data }
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Category",
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
    loadCategory();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmtb_exctg);
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
      const response = await expCategoryAPI.delete(formDataNew);

      // Remove deleted business from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Category - ${rowData.exctg_cname} ${
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
        summary: "Category",
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
    loadCategory();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmtb_exctg);
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
        exctg_users: user.users_users,
        exctg_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await expCategoryAPI.update(formDataNew);
      } else {
        response = await expCategoryAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Category - ${formDataNew.exctg_cname} ${
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
        await loadCategory(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Category",
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
  };
};
