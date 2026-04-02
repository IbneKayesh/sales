import { useState, useEffect } from "react";
import { attendStatusAPI } from "@/api/hrms/attendStatusAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmhb_atnst from "@/models/hrms/tmhb_atnst.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { getCurrentYear } from "@/utils/datetime";
import tmhb_lvemp from "@/models/hrms/tmhb_lvemp.json";

const dataModel = generateDataModel(tmhb_atnst, { edit_stop: 0 });

export const useAttendStatus = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadAttendStatus = async () => {
    try {
      setIsBusy(true);
      const response = await attendStatusAPI.getAll({
        atnst_users: user.users_users,
        atnst_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Attendance Status",
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
    loadAttendStatus();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmhb_atnst);
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
      const response = await attendStatusAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Attendance Status - ${rowData.atnst_sname} ${
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
        summary: "Attendance Status",
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
    loadAttendStatus();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate(formData, tmhb_atnst);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        atnst_users: user.users_users,
        atnst_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };

      let response;
      if (formData.id) {
        response = await attendStatusAPI.update(formDataNew);
      } else {
        response = await attendStatusAPI.create(formDataNew);
      }

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Attendance Status - ${formDataNew.atnst_sname} ${
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
        await loadAttendStatus();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Attendance Status",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  //leave manage
  const [empLeaveFormData, setEmpLeaveFormData] = useState(null);
  const handleEmployeeLeave = (data) => {
    setFormData(data);
    setCurrentView("emp-leave");
    setEmpLeaveFormData({
      lvemp_yerid: getCurrentYear(),
    });
  };
  const handleChangeEmpLeave = (field, value) => {
    setEmpLeaveFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...empLeaveFormData, [field]: value },
      tmhb_lvemp,
    );
    setErrors(newErrors);
  };

  const handleSaveEmpLeave = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate(empLeaveFormData, tmhb_lvemp);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        ...empLeaveFormData,
        id: empLeaveFormData.id || generateGuid(),
        lvemp_users: user.users_users,
        lvemp_bsins: user.users_bsins,
        muser_id: user.users_users,
        suser_id: user.id,
      };

      let response;
      if (empLeaveFormData.id) {
        //response = await attendStatusAPI.update(formDataNew);
      } else {
        response = await attendStatusAPI.createEmpLeave(formDataNew);
      }

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Employee Leave ${
          response.success
            ? empLeaveFormData.id
              ? "modified"
              : "created"
            : empLeaveFormData.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        //handleClear();
        //setCurrentView("list");
        //await loadAttendStatus();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Employee Leave",
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
    //leave manage
    handleEmployeeLeave,
    empLeaveFormData,
    handleChangeEmpLeave,
    handleSaveEmpLeave,
  };
};
