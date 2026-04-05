import { useState, useEffect } from "react";
import { unitsAPI } from "@/api/inventory/unitsAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmib_iuofm from "@/models/inventory/tmib_iuofm.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmib_iuofm, { edit_stop: 0 });

export const useUnits = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadUnits = async () => {
    try {
      setIsBusy(true);
      const response = await unitsAPI.getAll({ muser_id: user.users_users });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Unit",
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
    loadUnits();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_iuofm);
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
    //console.log("unit: " + JSON.stringify(unit));

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
      const response = await unitsAPI.delete(formDataNew);

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }
      
      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Unit - ${rowData.iuofm_untnm} ${
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
        summary: "Unit",
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
    loadUnits();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validate(formData, tmib_iuofm);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        muser_id: user.users_users,
        suser_id: user.id,
      };
      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;
      let response;
      if (formData.id) {
        response = await unitsAPI.update(formDataNew);
      } else {
        response = await unitsAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Unit - ${formDataNew.iuofm_untnm} ${
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
        loadUnits();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Unit",
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
