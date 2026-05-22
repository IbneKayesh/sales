import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { generateGuid } from "../utils/guid";

const useFeatures = () => {
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
    const resp = await apiRequest("api/features/get-all", { body: {} });
    setDataList(resp.data);
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleRowClick = (data) => {
    setFormData(data);
    setIsSideBar(true);
  };

  const handleCloseSidebar = () => {
    setFormData({});
    setIsSideBar(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      setIsBusy(true);
      try {
        await apiRequest("api/features/delete", { body: { id: id } });
        handleGetAll();
        handleCloseSidebar();
      } catch (err) {
        console.error("Error deleting feature:", err);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleSave = async (data) => {
    setIsBusy(true);
    try {
      if (data.id) {
        await apiRequest("api/features/edit", { body: data });
      } else {
        const reqBody = {
          ...data,
          id: generateGuid(),
        };
        await apiRequest("api/features/add", { body: reqBody });
      }
      handleGetAll();
      //handleCloseSidebar();
    } catch (err) {
      console.error("Error deleting feature:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddNew = (config) => {
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
      start_date: "",
      end_date: "",
      progress_percent: 0,
    });
    setIsSideBar(true);
  };

  //task
  const [taskList, setTaskList] = useState([]);
  const [formDataTask, setFormDataTask] = useState({});

  const handleGetTaskByFeature = async (feature_id) => {
    try {
      const resp = await apiRequest("api/tasks/get-by-feature", {
        body: { feature_id },
      });
      setTaskList(resp.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleInputChangeTask = (name, value) => {
    setFormDataTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTask = async (data) => {
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
      await handleGetTaskByFeature(formData.id);
    } catch (err) {
      console.error("Error saving task:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDoneTask = async (taskId, isDone) => {
    setIsBusy(true);
    try {
      const task = taskList.find((t) => t.id === taskId);
      if (task) {
        await apiRequest("api/tasks/edit", {
          body: { ...task, is_done: isDone },
        });
        await handleGetTaskByFeature(formData.id);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsBusy(true);
      try {
        await apiRequest("api/tasks/delete", { body: { id: taskId } });
        await handleGetTaskByFeature(formData.id);
      } catch (err) {
        console.error("Error deleting task:", err);
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
    handleInputChange,
    handleRowClick,
    handleCloseSidebar,
    handleDelete,
    handleSave,
    handleAddNew,
    taskList,
    formDataTask,
    handleGetTaskByFeature,
    handleInputChangeTask,
    handleSaveTask,
    handleDoneTask,
    handleDeleteTask,
  };
};
export default useFeatures;
