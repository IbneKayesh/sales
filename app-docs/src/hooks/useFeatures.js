import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { generateGuid } from "../utils/guid";
import { useToast } from "../contexts/ToastContext";
import { useConfirm } from "../contexts/ConfirmContext";

const useFeatures = () => {
  const { success, error } = useToast();
  const { confirm } = useConfirm();
  const [isBusy, setIsBusy] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const [isSideBar, setIsSideBar] = useState(false);

  const feature_status_options = [
    { name: "Not Started", value: "Not Started" },
    { name: "In Progress", value: "In Progress" },
    { name: "Completed", value: "Completed" },
    { name: "On Hold", value: "On Hold" },
  ];

  const feature_priority_options = [
    { name: "Low", value: "Low" },
    { name: "Medium", value: "Medium" },
    { name: "High", value: "High" },
    { name: "Critical", value: "Critical" },
  ];

  const work_type_options = [
    { name: "Development", value: "Development" },
    { name: "Testing", value: "Testing" },
    { name: "Deployment", value: "Deployment" },
    { name: "Documentation", value: "Documentation" },
  ];

  const work_user_options = [
    { name: "Developer", value: "Developer" },
    { name: "Tester", value: "Tester" },
    { name: "Deployer", value: "Deployer" },
    { name: "Documenter", value: "Documenter" },
  ];

  const handleGetAll = async () => {
    try {
      const resp = await apiRequest("api/features/get-all", { body: {} });
      setDataList(resp.data);
    } catch (err) {
      error("Error loading features");
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleAddClick = (config) => {
    const typeMap = {
      "-": "project",
      project: "module",
      module: "submodule",
      submodule: "feature",
    };
    setFormData({
      id: "",
      feature_id: config.id || "",
      feature_type: typeMap[config.type] || "",
      feature_status: "",
      feature_priority: "",
      work_type: "",
      work_user: "",
      feature_name: "",
      feature_description: "",
      serial_number: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      progress_percent: 0,
    });
    setIsSideBar(true);
  };

  const handleGetByFeatureWithoutTables = async (feature_id) => {
    try {
      const resp = await apiRequest(
        "api/feature-table/get-by-feature-without-tables",
        { body: { feature_id } },
      );
      setTableList(resp.data || []);
    } catch (err) {
      error("Error fetching tables");
    }
  };

  const handleGetByFeatureWithTables = async (feature_id) => {
    try {
      const resp = await apiRequest(
        "api/feature-table/get-by-feature-with-tables",
        {
          body: { feature_id },
        },
      );
      setFeatureTableList(resp.data || []);
    } catch (err) {
      error("Error fetching linked tables");
    }
  };

  const handleEditClick = (data) => {
    setFormData(data);
    setIsSideBar(true);

    if (data.feature_type === "feature") {
      handleGetByFeatureWithoutTables(data.id);
      handleGetByFeatureWithTables(data.id);
      handleGetTaskByFeature(data.id);
    }
  };

  const handleCloseSidebarClick = () => {
    setFormData({});
    setIsSideBar(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteClick = async (id) => {
    const ok = await confirm("Are you sure you want to delete this feature?");
    if (ok) {
      setIsBusy(true);
      try {
        await apiRequest("api/features/delete", { body: { id: id } });
        success("Feature deleted");
        handleGetAll();
        handleCloseSidebarClick();
      } catch (err) {
        error("Error deleting feature");
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleSaveClick = async (data) => {
    setIsBusy(true);
    try {
      if (data.id) {
        const resp = await apiRequest("api/features/edit", { body: data });
        setFormData(resp.data || data);
        success("Feature updated");
      } else {
        const reqBody = {
          ...data,
          id: generateGuid(),
        };
        const resp = await apiRequest("api/features/add", { body: reqBody });
        setFormData(resp.data || reqBody);
        success("Feature created");
      }
      handleGetAll();
    } catch (err) {
      error("Error saving feature");
    } finally {
      setIsBusy(false);
    }
  };

  //linked tables
  const [selectedTableId, setSelectedTableId] = useState("");
  const [tableList, setTableList] = useState([]);
  const [featureTableList, setFeatureTableList] = useState([]);

  const handleInputChangeTable = (tableId) => {
    setSelectedTableId(tableId);
  };

  const handleAddFeatureTableClick = async () => {
    if (!selectedTableId) {
      return;
    }
    setIsBusy(true);
    try {
      const resp = await apiRequest("api/feature-table/add", {
        body: {
          id: generateGuid(),
          feature_id: formData.id,
          table_id: selectedTableId,
        },
      });
      //console.log("resp", resp);



      setSelectedTableId("");
      await handleGetByFeatureWithTables(formData.id);
    } catch (err) {
      error("Error saving feature-table mapping");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteFeatureTableClick = async (feature_id, id) => {
    if (!id) return;

    const ok = await confirm(
      "Are you sure you want to remove this table from the feature?",
    );
    if (ok) {
      setIsBusy(true);
      try {
        await apiRequest("api/feature-table/delete", {
          body: { id },
        });
        await handleGetByFeatureWithTables(feature_id);
      } catch (err) {
        error("Error deleting feature-table mapping");
      } finally {
        setIsBusy(false);
      }
    }
  };

  //tasks
  const [taskList, setTaskList] = useState([]);
  const [formDataTask, setFormDataTask] = useState({});
  const handleGetTaskByFeature = async (feature_id) => {
    try {
      const resp = await apiRequest("api/tasks/get-by-feature", {
        body: { feature_id },
      });
      setTaskList(resp.data || []);
    } catch (err) {
      error("Error fetching tasks");
    }
  };
  const handleInputChangeTask = (name, value) => {
    setFormDataTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTaskClick = async (data) => {
    setIsBusy(true);
    try {
      if (data.id) {
        await apiRequest("api/tasks/edit", { body: data });
      } else {
        const reqBody = {
          ...data,
          id: generateGuid(),
        };
        await apiRequest("api/tasks/add", { body: reqBody });
      }
      setFormDataTask({});
      await handleGetTaskByFeature(data.feature_id);
    } catch (err) {
      error("Error saving task");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDoneTaskClick = async (taskId, isDone) => {
    setIsBusy(true);
    try {
      const task = taskList.find((t) => t.id === taskId);
      if (task) {
        await apiRequest("api/tasks/edit", {
          body: { ...task, is_done: isDone },
        });
        await handleGetTaskByFeature(task.feature_id);
      }
    } catch (err) {
      error("Error updating task");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteTaskClick = async (taskId) => {
    const ok = await confirm("Are you sure you want to delete this task?");
    if (ok) {
      setIsBusy(true);
      try {
        await apiRequest("api/tasks/delete", { body: { id: taskId } });
        const task = taskList.find((t) => t.id === taskId);
        await handleGetTaskByFeature(task?.feature_id);
      } catch (err) {
        error("Error deleting task");
      } finally {
        setIsBusy(false);
      }
    }
  };

  return {
    isBusy,
    dataList,
    formData,
    isSideBar,
    feature_status_options,
    feature_priority_options,
    work_type_options,
    work_user_options,
    handleAddClick,
    handleEditClick,
    handleCloseSidebarClick,
    handleInputChange,
    handleDeleteClick,
    handleSaveClick,

    //feature tables
    selectedTableId,
    handleInputChangeTable,
    handleAddFeatureTableClick,
    tableList,
    featureTableList,
    handleDeleteFeatureTableClick,

    //task
    formDataTask,
    handleInputChangeTask,
    handleSaveTaskClick,
    taskList,
    handleDoneTaskClick,
    handleDeleteTaskClick,
  };
};

export default useFeatures;
