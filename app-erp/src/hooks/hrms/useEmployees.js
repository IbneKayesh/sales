import { useState, useEffect } from "react";
import { employeesAPI } from "@/api/hrms/employeesAPI";
import tmhb_emply from "@/models/hrms/tmhb_emply.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { formatDateForAPI } from "@/utils/datetime";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import { empSalaryAPI } from "@/api/hrms/empSalaryAPI";
import tmhb_empsl from "@/models/hrms/tmhb_empsl.json";

const dataModel = generateDataModel(tmhb_emply, { edit_stop: 0 });

export const useEmployees = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadEmployees = async () => {
    try {
      setIsBusy(true);
      const response = await employeesAPI.getAll({
        emply_users: user.users_users,
      });
      //response = { success, message, data }
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Employees",
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
    loadEmployees();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmhb_emply);
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
      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      // Call API, unwrap { message, data }
      const response = await employeesAPI.delete(formDataNew);

      // Remove deleted Employees from local state

      if (response.success) {
        const updatedList = dataList.filter((u) => u.id !== rowData.id);
        setDataList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Employees - ${rowData.emply_ename} ${
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
        summary: "Employees",
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
    loadEmployees();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const newErrors = validate(formData, tmhb_emply);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(formData));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        emply_users: user.users_users,
        emply_bsins: user.users_bsins,
        emply_bdate: formatDateForAPI(formData.emply_bdate),
        emply_jndat: formatDateForAPI(formData.emply_jndat),
        emply_cndat: formatDateForAPI(formData.emply_cndat),
        emply_rgdat: formatDateForAPI(formData.emply_rgdat),
        user_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (formData.id) {
        response = await employeesAPI.update(formDataNew);
      } else {
        response = await employeesAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Employees - ${formDataNew.emply_ename} ${
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
        await loadEmployees(); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Employees",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const [empSalaryData, setEmpSalaryData] = useState({});
  const [empSalaryList, setEmpSalaryList] = useState([]);

  const handleEmployeeSalary = async (data) => {
    //console.log("edit: " + JSON.stringify(data));

    try {
      setIsBusy(true);
      const response = await empSalaryAPI.getAll({
        empsl_users: user.users_users,
        empsl_bsins: user.users_bsins,
        empsl_emply: data.id,
      });
      //response = { success, message, data }
      //console.log("response", response)
      setEmpSalaryList(response.data);

      setFormData(data);
      setCurrentView("emp-salary");
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Employee Salary",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleChangeEmpSalary = (field, value) => {
    setEmpSalaryData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...empSalaryData, [field]: value },
      tmhb_empsl,
    );
    setErrors(newErrors);
  };

  const handleSaveEmpSalary = async (e) => {
    e.preventDefault();
    try {
      //console.log("empSalaryData", empSalaryData);

      const cr = Number(empSalaryData.empsl_cramt || 0);
      const db = Number(empSalaryData.empsl_dbamt || 0);

      // ❌ invalid if both are 0 OR both are > 0
      if ((cr === 0 && db === 0) || (cr > 0 && db > 0)) {
        notify({
          severity: "error",
          summary: "Employee Salary",
          detail: "Enter either Credit or Debit (only one required)",
          toast: true,
          notification: true,
          log: false,
        });
        return;
      }

      // ✅ valid case continues here

      // Validate form
      const newErrors = validate(empSalaryData, tmhb_empsl);
      setErrors(newErrors);
      console.log("handleSave:", JSON.stringify(empSalaryData));
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      // Ensure id exists (for create)
      const formDataNew = {
        ...empSalaryData,
        id: empSalaryData.id || generateGuid(),
        empsl_users: user.users_users,
        empsl_bsins: user.users_bsins,
        empsl_emply: formData.id, //as employee id
        muser_id: user.users_users,
        suser_id: user.id,
      };

      // Call API and get { message, data }
      let response;
      if (empSalaryData.id) {
        // response = await empSalaryAPI.update(formDataNew);
      } else {
        response = await empSalaryAPI.create(formDataNew);
      }

      // Update toast using API message
      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Salary - ${formDataNew.empsl_slcat} ${
          response.success
            ? empSalaryData.id
              ? "modified"
              : "created"
            : empSalaryData.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });

      if (response.success) {
        // Clear form & reload
        // handleClear();
        setEmpSalaryData({
          empsl_slcat: "",
          empsl_cramt: "",
          empsl_dbamt: "",
          empsl_notes: "",
        });
        await handleEmployeeSalary(formData); // make sure we wait for updated data
      }
    } catch (error) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Salary",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteSalary = async (rowData) => {
    try {
      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      // Call API, unwrap { message, data }
      const response = await empSalaryAPI.delete(formDataNew);

      // Remove deleted Employees from local state

      if (response.success) {
        const updatedList = empSalaryList.filter((u) => u.id !== rowData.id);
        setEmpSalaryList(updatedList);
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Salary - ${rowData.empsl_slcat} ${
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
        summary: "Salary",
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
    //salary
    handleEmployeeSalary,
    empSalaryData,
    handleChangeEmpSalary,
    handleSaveEmpSalary,
    empSalaryList,
    handleDeleteSalary,
  };
};
