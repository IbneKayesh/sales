import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { generateGuid } from "../utils/guid";
import { useToast } from "../contexts/ToastContext";
import { useConfirm } from "../contexts/ConfirmContext";
import {
  prepareFeaturePayload,
  prepareFeatureTablePayload,
  prepareTaskEditPayload,
  prepareTaskPayload,
} from "../utils/schemaValidation.js";

export const FEATURE_TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "project", label: "Project" },
  { value: "module", label: "Module" },
  { value: "submodule", label: "Submodule" },
  { value: "feature", label: "Feature" },
];

const featureMatchesFilters = (
  item,
  { searchQuery, statusFilter, priorityFilter, typeFilter },
) => {
  if (typeFilter && item.feature_type !== typeFilter) return false;

  if (statusFilter) {
    const status =
      item.feature_status && item.feature_status !== "-"
        ? item.feature_status
        : "";
    if (status !== statusFilter) return false;
  }

  if (priorityFilter) {
    const priority =
      item.feature_priority && item.feature_priority !== "-"
        ? item.feature_priority
        : "";
    if (priority !== priorityFilter) return false;
  }

  const q = searchQuery.trim().toLowerCase();
  if (q) {
    const name = String(item.feature_name || "").toLowerCase();
    const desc = String(item.feature_description || "").toLowerCase();
    const serial = String(item.serial_number ?? "");
    if (!name.includes(q) && !desc.includes(q) && !serial.includes(q)) {
      return false;
    }
  }

  return true;
};

const formatDateInput = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const useFeatures = () => {
  const { success, error, warning } = useToast();
  const { confirm } = useConfirm();
  const [isBusy, setIsBusy] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const [isSideBar, setIsSideBar] = useState(false);

  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

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

  const hasActiveFilters = Boolean(
    searchQuery.trim() || statusFilter || priorityFilter || typeFilter,
  );

  const visibleIds = useMemo(() => {
    if (!hasActiveFilters) return null;

    const filters = { searchQuery, statusFilter, priorityFilter, typeFilter };
    const byId = new Map(dataList.map((item) => [item.id, item]));
    const ids = new Set();

    for (const item of dataList) {
      if (!featureMatchesFilters(item, filters)) continue;

      let current = item;
      while (current) {
        ids.add(current.id);
        const parentId = current.feature_id;
        current =
          parentId && parentId !== "" ? byId.get(parentId) : null;
      }
    }

    return ids;
  }, [
    dataList,
    hasActiveFilters,
    searchQuery,
    statusFilter,
    priorityFilter,
    typeFilter,
  ]);

  useEffect(() => {
    if (!visibleIds || visibleIds.size === 0) return;

    setExpandedRows((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const id of visibleIds) {
        const hasChildren = dataList.some((item) => item.feature_id === id);
        if (hasChildren && !next[id]) {
          next[id] = true;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [visibleIds, dataList]);

  const getChildrenByFeatureId = useCallback(
    (parentId) =>
      dataList
        .filter((item) => item.feature_id === parentId)
        .filter((item) => !visibleIds || visibleIds.has(item.id))
        .sort((a, b) => (a.serial_number ?? 0) - (b.serial_number ?? 0)),
    [dataList, visibleIds],
  );

  const rootRows = useMemo(
    () =>
      dataList
        .filter(
          (item) =>
            (!item.feature_id || item.feature_id === "") &&
            item.feature_type === "project",
        )
        .filter((item) => !visibleIds || visibleIds.has(item.id))
        .sort((a, b) => (a.serial_number ?? 0) - (b.serial_number ?? 0)),
    [dataList, visibleIds],
  );

  const hasVisibleTreeRows = rootRows.length > 0;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGetAll = async () => {
    try {
      const resp = await apiRequest("api/features/get-all", { body: {} });
      setDataList(resp.data);
    } catch {
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
    } catch {
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
    } catch {
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
    setSelectedTableId("");
    setTableList([]);
    setFeatureTableList([]);
    setTaskList([]);
    setFormDataTask({});
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, dateValue) => {
    handleInputChange(
      name,
      dateValue ? new Date(dateValue).toISOString() : "",
    );
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
      } catch {
        error("Error deleting feature");
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleSaveClick = async (data) => {
    const prepared = prepareFeaturePayload(data);
    if (prepared.error) {
      warning(prepared.error);
      return;
    }

    const { payload } = prepared;

    setIsBusy(true);
    try {
      if (payload.id) {
        const resp = await apiRequest("api/features/edit", { body: payload });
        setFormData(resp.data || payload);
        success("Feature updated");
      } else {
        const reqBody = { ...payload, id: generateGuid() };
        const resp = await apiRequest("api/features/add", { body: reqBody });
        setFormData(resp.data || reqBody);
        success("Feature created");
      }
      handleGetAll();
    } catch {
      error("Error saving feature");
    } finally {
      setIsBusy(false);
    }
  };

  const [selectedTableId, setSelectedTableId] = useState("");
  const [tableList, setTableList] = useState([]);
  const [featureTableList, setFeatureTableList] = useState([]);

  const handleInputChangeTable = (tableId) => {
    setSelectedTableId(tableId);
  };

  const handleAddFeatureTableClick = async () => {
    const prepared = prepareFeatureTablePayload(formData.id, selectedTableId);
    if (prepared.error) {
      warning(prepared.error);
      return;
    }

    setIsBusy(true);
    try {
      await apiRequest("api/feature-table/add", {
        body: {
          id: generateGuid(),
          ...prepared.payload,
        },
      });

      setSelectedTableId("");
      await handleGetByFeatureWithTables(formData.id);
      await handleGetByFeatureWithoutTables(formData.id);
    } catch {
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
        await handleGetByFeatureWithoutTables(feature_id);
      } catch {
        error("Error deleting feature-table mapping");
      } finally {
        setIsBusy(false);
      }
    }
  };

  const [taskList, setTaskList] = useState([]);
  const [formDataTask, setFormDataTask] = useState({});

  const handleGetTaskByFeature = async (feature_id) => {
    try {
      const resp = await apiRequest("api/tasks/get-by-feature", {
        body: { feature_id },
      });
      setTaskList(resp.data || []);
    } catch {
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
    const prepared = prepareTaskPayload(data, formData.id);
    if (prepared.error) {
      warning(prepared.error);
      return;
    }

    const { payload } = prepared;

    setIsBusy(true);
    try {
      if (payload.id) {
        await apiRequest("api/tasks/edit", { body: payload });
      } else {
        await apiRequest("api/tasks/add", {
          body: { ...payload, id: generateGuid() },
        });
      }
      setFormDataTask({});
      await handleGetTaskByFeature(payload.feature_id);
    } catch {
      error("Error saving task");
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddTask = () => {
    handleSaveTaskClick({
      ...formDataTask,
      feature_id: formData.id,
    });
  };

  const handleTaskKeyDown = (e) => {
    if (e.key === "Enter" && formDataTask.task_name?.trim()) {
      handleAddTask();
    }
  };

  const handleDoneTaskClick = async (taskId, isDone) => {
    const task = taskList.find((t) => t.id === taskId);
    if (!task) return;

    const prepared = prepareTaskEditPayload(task, isDone);
    if (prepared.error) {
      warning(prepared.error);
      return;
    }

    setIsBusy(true);
    try {
      await apiRequest("api/tasks/edit", { body: prepared.payload });
      await handleGetTaskByFeature(task.feature_id);
    } catch {
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
      } catch {
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
    formatDateInput,
    handleDateChange,

    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    hasActiveFilters,
    clearFilters,
    featureTypeFilters: FEATURE_TYPE_FILTERS,
    expandedRows,
    toggleExpand,
    rootRows,
    getChildrenByFeatureId,
    hasVisibleTreeRows,

    selectedTableId,
    handleInputChangeTable,
    handleAddFeatureTableClick,
    tableList,
    featureTableList,
    handleDeleteFeatureTableClick,

    formDataTask,
    handleInputChangeTask,
    handleSaveTaskClick,
    handleAddTask,
    handleTaskKeyDown,
    taskList,
    handleDoneTaskClick,
    handleDeleteTaskClick,
  };
};

export default useFeatures;
