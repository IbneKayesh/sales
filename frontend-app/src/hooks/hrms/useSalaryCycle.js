import { useState, useEffect } from "react";
import { salaryCycleAPI } from "@/api/hrms/salaryCycleAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmhb_scyle from "@/models/hrms/tmhb_scyle.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { formatDateForAPI, noOfDays } from "@/utils/datetime";

const dataModel = generateDataModel(tmhb_scyle, { edit_stop: 0 });

export const useSalaryCycle = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadSalaryCycle = async () => {
    try {
      setIsBusy(true);
      const response = await salaryCycleAPI.getAll({
        scyle_users: user.users_users,
        scyle_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Salary Cycle",
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
    loadSalaryCycle();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmhb_scyle);
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
      const response = await salaryCycleAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Salary Cycle - ${rowData.scyle_cname} ${
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
        summary: "Salary Cycle",
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
    loadSalaryCycle();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate(formData, tmhb_scyle);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        scyle_frdat: formatDateForAPI(formData.scyle_frdat),
        scyle_todat: formatDateForAPI(formData.scyle_todat),
        scyle_today: noOfDays(formData.scyle_frdat, formData.scyle_todat),
        scyle_users: user.users_users,
        scyle_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      //console.log("formDataNew: " + JSON.stringify(formDataNew));
      //return;
      let response;
      if (formData.id) {
        response = await salaryCycleAPI.update(formDataNew);
      } else {
        response = await salaryCycleAPI.create(formDataNew);
      }

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Salary Cycle - ${formDataNew.scyle_cname} ${
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
        await loadSalaryCycle();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Salary Cycle",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
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
  };
};
