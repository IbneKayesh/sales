import { useState, useEffect } from "react";
import { categoriesAPI } from "@/api/inventory/categoriesAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmib_ctgry from "@/models/inventory/tmib_ctgry.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import tmib_attrb from "@/models/inventory/tmib_attrb.json";
import { attributesAPI } from "@/api/inventory/attributesAPI";

const dataModel = generateDataModel(tmib_ctgry, { edit_stop: 0 });

export const useCategory = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadCategories = async () => {
    try {
      setIsBusy(true);
      const response = await categoriesAPI.getAll({
        muser_id: user.users_users,
      });
      //response = { message, data }
      //console.log("response: " + JSON.stringify(response));
      setDataList(response.data);

      //showToast("success", "Success", response.message);
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
    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmib_ctgry);
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
      const response = await categoriesAPI.delete(formDataNew);

      // Remove deleted unit from local state
      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Category - ${rowData.ctgry_ctgnm} ${
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
        summary: "Brand",
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
    loadCategories();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmib_ctgry);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await categoriesAPI.update(formDataNew);
      } else {
        response = await categoriesAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Category - ${formDataNew.ctgry_ctgnm} ${
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
        loadCategories();
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

  //Attributes

  const [formDataAttributes, setFormDataAttributes] = useState({});

  const handleAttributes = (data) => {
    //console.log("unit: " + JSON.stringify(unit));
    setFormData(data);
    setFormDataAttributes({
      attrb_ctgry: data.id,
    });
    setCurrentView("attributes");
  };

  const handleChangeAttributes = (field, value) => {
    //console.log("field: " + field + " value: " + value);
    setFormDataAttributes((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataAttributes, [field]: value },
      tmib_attrb,
    );
    setErrors(newErrors);
  };

  const handleSaveAttributes = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formDataAttributes, tmib_attrb);
      setErrors(newErrors);
      console.log("handleSave: " + JSON.stringify(newErrors));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      // Ensure id exists (for create)
      const formDataNew = {
        ...formDataAttributes,
        id: formDataAttributes.id || generateGuid(),
        muser_id: user.users_users,
        suser_id: user.id,
      };

      //console.log("formDataAttributes: " + JSON.stringify(formDataNew));
      //return;

      // Call API and get { message, data }
      let response;
      if (formDataAttributes.id) {
        response = await attributesAPI.update(formDataNew);
      } else {
        response = await attributesAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Attribute - ${formDataNew.attrb_aname} ${
          response.success
            ? formDataAttributes.id
              ? "modified"
              : "created"
            : formDataAttributes.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        setFormDataAttributes({
          id: generateGuid(), //change to reload attribute list
          attrb_aname: "",
          attrb_dtype: "",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Attribute",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteAttributes = async (rowData) => {
    try {
      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await attributesAPI.delete(formDataNew);

      // Remove deleted unit from local state
      if (response.success) {
        setFormDataAttributes({
          id: generateGuid(), //change to reload attribute list
          attrb_aname: "",
          attrb_dtype: "",
        });
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Attribute - ${rowData.attrb_aname} ${
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
        summary: "Attribute",
        detail: error?.message || "Failed to delete data",
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

    //Attributes
    handleAttributes,
    formDataAttributes,
    handleChangeAttributes,
    handleSaveAttributes,
    handleDeleteAttributes,
  };
};
