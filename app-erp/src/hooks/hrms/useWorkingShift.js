import { useState, useEffect } from "react";
import { workingShiftAPI } from "@/api/hrms/workingShiftAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmhb_wksft from "@/models/hrms/tmhb_wksft.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { isValid24HourTime } from "@/utils/datetime";

const dataModel = generateDataModel(tmhb_wksft, { edit_stop: 0 });

export const useWorkingShift = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadWorkingShift = async () => {
    try {
      setIsBusy(true);
      const response = await workingShiftAPI.getAll({
        wksft_users: user.users_users,
        wksft_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Working Shift",
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
    loadWorkingShift();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmhb_wksft);
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
      const response = await workingShiftAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Working Shift - ${rowData.wksft_sftnm} ${
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
        summary: "Working Shift",
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
    loadWorkingShift();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate(formData, tmhb_wksft);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const st = isValid24HourTime(formData.wksft_satim);
      const et = isValid24HourTime(formData.wksft_entim);

      if (!st || !et) {
        notify({
          severity: "error",
          summary: "Working Shift",
          detail: "Invalid time format, allowed HH:MM (00:00 to 23:59)",
          toast: true,
          notification: true,
          log: false,
        });
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        wksft_users: user.users_users,
        wksft_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      //console.log("formDataNew: " + JSON.stringify(formDataNew));
      //return;
      let response;
      if (formData.id) {
        response = await workingShiftAPI.update(formDataNew);
      } else {
        response = await workingShiftAPI.create(formDataNew);
      }

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Working Shift - ${formDataNew.wksft_sftnm} ${
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
        await loadWorkingShift();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Working Shift",
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
