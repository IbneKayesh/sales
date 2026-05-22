import React, { Fragment, useMemo, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useConfirm } from "./ConfirmModal";
import { preserveScroll } from "../utils/scrollPreserver";
import StatusBadge from "./shared/StatusBadge";
import PriorityBadge from "./shared/PriorityBadge";
import ProgressBar from "./shared/ProgressBar";
import DrawerForm from "./shared/DrawerForm";
import { formatDate, isOverdue, getDurationText } from "../utils/dateUtils";

const blankProject = {
  name: "",
  description: "",
  sequence: 0,
  status: "planning",
  priority: "medium",
  owner: "",
  start_date: "",
  end_date: "",
  progress: 0,
};

const blankModule = {
  project_id: "",
  name: "",
  description: "",
  sequence: 0,
  status: "planning",
  priority: "medium",
  owner: "",
  start_date: "",
  end_date: "",
  progress: 0,
};

const blankSubmodule = {
  module_id: "",
  name: "",
  description: "",
  sequence: 0,
  status: "planning",
  priority: "medium",
  owner: "",
  start_date: "",
  end_date: "",
  progress: 0,
};

const blankFeature = {
  submodule_id: "",
  feature_name: "",
  description: "",
  status: "planned",
  priority: "medium",
  owner: "",
  start_date: "",
  end_date: "",
  progress: 0,
};

export default function ProjectsPanel({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  modules,
  submodules,
  features,
  tables,
  tableFeatures,
  selectedModuleId,
  setSelectedModuleId,
  selectedSubmoduleId,
  setSelectedSubmoduleId,
  expandedProjectIds,
  setExpandedProjectIds,
  expandedModuleIds,
  setExpandedModuleIds,
  expandedSubmoduleIds,
  setExpandedSubmoduleIds,
  refreshForAddEditDeleteProject,
  refreshForAddEditDeleteModule,
  refreshForAddEditDeleteSubmodule,
  refreshForAddEditDeleteFeature,
  refreshForLinkUnlinkTableFeature,
}) {
  const { addNotification } = useNotification();
  const { confirm, confirmModal } = useConfirm();

  const expandedProjects = expandedProjectIds;
  const setExpandedProjects = setExpandedProjectIds;
  const expandedModules = expandedModuleIds;
  const setExpandedModules = setExpandedModuleIds;
  const expandedSubmodules = expandedSubmoduleIds;
  const setExpandedSubmodules = setExpandedSubmoduleIds;

  // Drawer & Editing States
  const [editing, setEditing] = useState(null); // { type, mode, id, parent }
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [tableDrafts, setTableDrafts] = useState({});

  const moduleRows = useMemo(
    () =>
      [...modules].sort(
        (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id
      ),
    [modules]
  );

  const request = async (url, options) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) throw new Error((await res.json()).error || "Request failed");
    return res.json();
  };

  const beginAdd = (type, parent = {}) => {
    const nextDraft = {
      project: { ...blankProject },
      module: {
        ...blankModule,
        project_id: parent.project_id || selectedProjectId || "",
      },
      submodule: {
        ...blankSubmodule,
        module_id: parent.module_id || selectedModuleId || "",
      },
      feature: {
        ...blankFeature,
        submodule_id: parent.submodule_id || selectedSubmoduleId || "",
      },
    }[type];

    // Ensure expanded tree nodes
    if (parent.project_id) {
      setExpandedProjects((prev) => new Set(prev).add(parent.project_id));
    }
    if (parent.module_id) {
      const parentModule = modules.find((m) => m.id === parent.module_id);
      if (parentModule) {
        setExpandedProjects((prev) => new Set(prev).add(parentModule.project_id));
      }
      setExpandedModules((prev) => new Set(prev).add(parent.module_id));
    }
    if (parent.submodule_id) {
      const parentSubmodule = submodules.find((s) => s.id === parent.submodule_id);
      if (parentSubmodule) {
        const parentModule = modules.find((m) => m.id === parentSubmodule.module_id);
        if (parentModule) {
          setExpandedProjects((prev) => new Set(prev).add(parentModule.project_id));
        }
        setExpandedModules((prev) => new Set(prev).add(parentSubmodule.module_id));
      }
      setExpandedSubmodules((prev) => new Set(prev).add(parent.submodule_id));
    }

    setEditing({ type, mode: "add", parent });
    setDraft(nextDraft);
  };

  const beginEdit = (type, row) => {
    const nextDraft = {
      project: {
        name: row.name,
        description: row.description || "",
        sequence: row.sequence || 0,
        status: row.status || "planning",
        priority: row.priority || "medium",
        owner: row.owner || "",
        start_date: row.start_date ? row.start_date.substring(0, 10) : "",
        end_date: row.end_date ? row.end_date.substring(0, 10) : "",
        progress: row.progress || 0,
      },
      module: {
        project_id: row.project_id,
        name: row.name,
        description: row.description || "",
        sequence: row.sequence || 0,
        status: row.status || "planning",
        priority: row.priority || "medium",
        owner: row.owner || "",
        start_date: row.start_date ? row.start_date.substring(0, 10) : "",
        end_date: row.end_date ? row.end_date.substring(0, 10) : "",
        progress: row.progress || 0,
      },
      submodule: {
        module_id: row.module_id,
        name: row.name,
        description: row.description || "",
        sequence: row.sequence || 0,
        status: row.status || "planning",
        priority: row.priority || "medium",
        owner: row.owner || "",
        start_date: row.start_date ? row.start_date.substring(0, 10) : "",
        end_date: row.end_date ? row.end_date.substring(0, 10) : "",
        progress: row.progress || 0,
      },
      feature: {
        submodule_id: row.submodule_id,
        feature_name: row.feature_name,
        description: row.description || "",
        status: row.status || "planned",
        priority: row.priority || "medium",
        owner: row.owner || "",
        start_date: row.start_date ? row.start_date.substring(0, 10) : "",
        end_date: row.end_date ? row.end_date.substring(0, 10) : "",
        progress: row.progress || 0,
      },
    }[type];
    
    setEditing({ type, mode: "edit", id: row.id });
    setDraft(nextDraft);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft({});
  };

  const toggleSet = (setter, id) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: name === "sequence" || name === "progress" || name === "project_id" || name === "module_id" || name === "submodule_id"
        ? value === "" ? "" : Number(value)
        : value,
    }));
  };

  const saveDraft = async () => {
    if (!editing) return;

    const nameVal = editing.type === "feature" ? draft.feature_name : draft.name;
    const parentIdVal = {
      project: true,
      module: !!draft.project_id,
      submodule: !!draft.module_id,
      feature: !!draft.submodule_id,
    }[editing.type];

    if (!nameVal?.trim() || !parentIdVal) {
      addNotification("Required fields are missing", "warning");
      return;
    }

    const endpoints = {
      project: "/api/projects",
      module: "/api/modules",
      submodule: "/api/submodules",
      feature: "/api/features",
    };

    setSaving(true);

    try {
      const endpoint = endpoints[editing.type];
      const url = editing.mode === "edit" ? `${endpoint}/${editing.id}` : endpoint;
      const method = editing.mode === "edit" ? "PUT" : "POST";
      const saved = await request(url, { method, body: JSON.stringify(draft) });

      if (editing.type === "project") {
        setSelectedProjectId(saved.id);
      }
      if (editing.type === "module") {
        setSelectedProjectId(saved.project_id);
        setSelectedModuleId(saved.id);
        setExpandedProjects((prev) => new Set(prev).add(saved.project_id));
      }
      if (editing.type === "submodule") {
        setSelectedModuleId(saved.module_id);
        setSelectedSubmoduleId(saved.id);
        setExpandedModules((prev) => new Set(prev).add(saved.module_id));
      }
      if (editing.type === "feature") {
        setSelectedSubmoduleId(saved.submodule_id);
        setExpandedSubmodules((prev) => new Set(prev).add(saved.submodule_id));
      }

      cancelEdit();
      addNotification(`${editing.type} saved`, "success");
      const restore = preserveScroll();

      if (editing.type === "project") {
        await refreshForAddEditDeleteProject();
      } else if (editing.type === "module") {
        await refreshForAddEditDeleteModule();
      } else if (editing.type === "submodule") {
        await refreshForAddEditDeleteSubmodule();
      } else if (editing.type === "feature") {
        await refreshForAddEditDeleteFeature();
      }

      restore();
    } catch (err) {
      addNotification(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (type, row) => {
    const labels = {
      project: "project and all its modules, submodules, features",
      module: "module and all its submodules and features",
      submodule: "submodule and its features",
      feature: "feature and its table links",
    };
    const nameText = type === "feature" ? row.feature_name : row.name;
    const ok = await confirm({
      title: "Delete item",
      message: `Are you sure you want to delete the ${type} "${nameText}"? This will delete all child relations.`,
      confirmText: "Yes, Delete",
      cancelText: "No, Keep",
    });

    if (!ok) return;

    const endpoints = {
      project: "/api/projects",
      module: "/api/modules",
      submodule: "/api/submodules",
      feature: "/api/features",
    };

    try {
      await request(`${endpoints[type]}/${row.id}`, { method: "DELETE" });
      addNotification(`${type} deleted`, "success");
      const restore = preserveScroll();

      if (type === "project") await refreshForAddEditDeleteProject();
      if (type === "module") await refreshForAddEditDeleteModule();
      if (type === "submodule") await refreshForAddEditDeleteSubmodule();
      if (type === "feature") await refreshForAddEditDeleteFeature();

      restore();
    } catch (err) {
      addNotification(err.message || "Delete failed", "error");
    }
  };

  const addFeatureTable = async (featureId) => {
    const tableId = tableDrafts[featureId];
    if (!tableId) {
      addNotification("Choose a table first", "warning");
      return;
    }

    try {
      await request("/api/table-features", {
        method: "POST",
        body: JSON.stringify({ feature_id: featureId, table_id: tableId }),
      });
      setTableDrafts({ ...tableDrafts, [featureId]: "" });
      addNotification("Table linked to feature", "success");
      const restore = preserveScroll();
      await refreshForLinkUnlinkTableFeature();
      restore();
    } catch (err) {
      addNotification(err.message || "Failed to link table", "error");
    }
  };

  const removeFeatureTable = async (linkId) => {
    try {
      await request(`/api/table-features/${linkId}`, { method: "DELETE" });
      addNotification("Table link removed", "success");
      const restore = preserveScroll();
      await refreshForLinkUnlinkTableFeature();
      restore();
    } catch (err) {
      addNotification(err.message || "Failed to remove table link", "error");
    }
  };

  // Helper to render beautiful side drawer form inputs depending on the entity type
  const renderDrawerFields = () => {
    if (!editing) return null;
    const { type } = editing;

    return (
      <div className="drawer-fields-wrapper">
        {/* Parent selector */}
        {type === "module" && (
          <div className="form-group-styled">
            <label className="form-label-styled">Belongs to Project *</label>
            <select
              className="form-select-styled"
              name="project_id"
              value={draft.project_id || ""}
              onChange={handleDraftChange}
            >
              <option value="" disabled>Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>{proj.name}</option>
              ))}
            </select>
          </div>
        )}

        {type === "submodule" && (
          <div className="form-group-styled">
            <label className="form-label-styled">Belongs to Module *</label>
            <select
              className="form-select-styled"
              name="module_id"
              value={draft.module_id || ""}
              onChange={handleDraftChange}
            >
              <option value="" disabled>Select Module</option>
              {modules.map((m) => {
                const proj = projects.find((p) => p.id === m.project_id);
                return (
                  <option key={m.id} value={m.id}>
                    {proj ? `${proj.name} / ${m.name}` : m.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {type === "feature" && (
          <div className="form-group-styled">
            <label className="form-label-styled">Belongs to Submodule *</label>
            <select
              className="form-select-styled"
              name="submodule_id"
              value={draft.submodule_id || ""}
              onChange={handleDraftChange}
            >
              <option value="" disabled>Select Submodule</option>
              {submodules.map((sub) => {
                const parentModule = modules.find((m) => m.id === sub.module_id);
                const parentProj = parentModule ? projects.find((p) => p.id === parentModule.project_id) : null;
                return (
                  <option key={sub.id} value={sub.id}>
                    {parentProj ? `${parentProj.name} / ${parentModule.name} / ${sub.name}` : sub.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Title Input */}
        <div className="form-group-styled">
          <label className="form-label-styled">Name *</label>
          <input
            type="text"
            className="form-input-styled"
            name={type === "feature" ? "feature_name" : "name"}
            placeholder="e.g. Sales Pipeline, Authentication"
            value={type === "feature" ? (draft.feature_name || "") : (draft.name || "")}
            onChange={handleDraftChange}
            required
          />
        </div>

        {/* Description Textarea */}
        <div className="form-group-styled">
          <label className="form-label-styled">Description</label>
          <textarea
            className="form-input-styled textarea-styled"
            name="description"
            placeholder="Outline the scope, notes, or objectives..."
            value={draft.description || ""}
            onChange={handleDraftChange}
            rows={3}
          />
        </div>

        {/* Status & Priority Row */}
        <div className="form-row-styled">
          <div className="form-group-styled half-width">
            <label className="form-label-styled">Status</label>
            <select
              className="form-select-styled"
              name="status"
              value={draft.status || ""}
              onChange={handleDraftChange}
            >
              {type === "feature" ? (
                <>
                  <option value="planned">Planned</option>
                  <option value="working">Working</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </>
              ) : (
                <>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="complete">Completed</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group-styled half-width">
            <label className="form-label-styled">Priority</label>
            <select
              className="form-select-styled"
              name="priority"
              value={draft.priority || ""}
              onChange={handleDraftChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Owner Input */}
        <div className="form-group-styled">
          <label className="form-label-styled">Owner / Lead developer</label>
          <input
            type="text"
            className="form-input-styled"
            name="owner"
            placeholder="Assignee name or email"
            value={draft.owner || ""}
            onChange={handleDraftChange}
          />
        </div>

        {/* Timeline Dates */}
        <div className="form-row-styled">
          <div className="form-group-styled half-width">
            <label className="form-label-styled">Start Date</label>
            <input
              type="date"
              className="form-input-styled"
              name="start_date"
              value={draft.start_date || ""}
              onChange={handleDraftChange}
            />
          </div>

          <div className="form-group-styled half-width">
            <label className="form-label-styled">Target End Date</label>
            <input
              type="date"
              className="form-input-styled"
              name="end_date"
              value={draft.end_date || ""}
              onChange={handleDraftChange}
            />
          </div>
        </div>

        {/* Progress & Order Row */}
        <div className="form-row-styled">
          <div className="form-group-styled half-width">
            <label className="form-label-styled">Progress ({draft.progress || 0}%)</label>
            <input
              type="range"
              className="form-range-styled"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={draft.progress || 0}
              onChange={handleDraftChange}
            />
          </div>

          <div className="form-group-styled half-width">
            <label className="form-label-styled">Sequence Order</label>
            <input
              type="number"
              className="form-input-styled"
              name="sequence"
              min="0"
              placeholder="e.g. 0"
              value={draft.sequence ?? 0}
              onChange={handleDraftChange}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid-workspace fade-in">
      {confirmModal}

      {/* Slide-out Lateral Drawer Form */}
      <DrawerForm
        isOpen={!!editing}
        onClose={cancelEdit}
        title={editing ? `${editing.mode === "edit" ? "Edit" : "Add"} ${editing.type.toUpperCase()}` : ""}
        onSubmit={saveDraft}
        isSaving={saving}
        submitText={editing?.mode === "edit" ? "Save Changes" : `Create ${editing?.type.toUpperCase()}`}
      >
        {renderDrawerFields()}
      </DrawerForm>

      {/* Main Hierarchy Card */}
      <div className="card grid-card">
        <div className="card-header">
          <div>
            <span className="card-title">Projects Hierarchy</span>
            <span className="card-subtitle">Manage project scoping, progress tracking, and feature schema definitions.</span>
          </div>
          <button
            className="btn btn-primary btn-xs"
            onClick={() => beginAdd("project")}
            disabled={saving}
          >
            Add Project
          </button>
        </div>

        <div className="grid-scroll">
          <table className="data-table tree-grid">
            <thead>
              <tr>
                <th>Hierarchy Item</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Timeline / Schedule</th>
                <th>Progress</th>
                <th>Scope / Database Tables</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && !editing && (
                <tr className="empty-grid-row">
                  <td colSpan={8}>
                    <div className="empty-row-action">
                      <span>No projects found. Create one to begin modeling your schema hierarchy!</span>
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => beginAdd("project")}
                      >
                        Add Project
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {projects
                .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id)
                .map((project) => {
                  const projectModules = moduleRows.filter((m) => m.project_id === project.id);
                  const projectOpen = expandedProjects.has(project.id);
                  const isProjOverdue = isOverdue(project.end_date, project.status);

                  return (
                    <Fragment key={project.id}>
                      {/* Project row */}
                      <tr className={`${selectedProjectId === project.id ? "selected-row" : ""} project-row`}>
                        <td>
                          <button
                            className="tree-toggle"
                            onClick={() => toggleSet(setExpandedProjects, project.id)}
                          >
                            {projectOpen ? "▼" : "▶"}
                          </button>
                          <strong className="entity-name">{project.name}</strong>
                          <span className="badge badge-neutral font-xs ml-1">PROJECT</span>
                          {project.description && (
                            <p className="item-description-sub">{project.description}</p>
                          )}
                        </td>
                        <td className="owner-cell">{project.owner || "—"}</td>
                        <td>
                          <StatusBadge status={project.status} />
                        </td>
                        <td>
                          <PriorityBadge priority={project.priority} />
                        </td>
                        <td>
                          <span className={`duration-text ${isProjOverdue ? "overdue-warning" : ""}`}>
                            {getDurationText(project.start_date, project.end_date)}
                            {isProjOverdue && <span className="warning-pill ml-1">OVERDUE</span>}
                          </span>
                        </td>
                        <td>
                          <ProgressBar progress={project.progress || 0} size="sm" />
                        </td>
                        <td className="scope-cell">
                          <span className="scope-count">{projectModules.length} Modules</span>
                        </td>
                        <td>
                          <div className="action-row right">
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={() => beginAdd("module", { project_id: project.id })}
                            >
                              + Module
                            </button>
                            <button className="btn-icon" onClick={() => beginEdit("project", project)}>
                              Edit
                            </button>
                            <button className="btn-icon danger" onClick={() => deleteRow("project", project)}>
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Project Modules */}
                      {projectOpen && projectModules.length === 0 && (
                        <tr className="empty-grid-row">
                          <td colSpan={8}>
                            <div className="empty-row-action nested level-1">
                              <span>No modules under {project.name}.</span>
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => beginAdd("module", { project_id: project.id })}
                              >
                                Add Module
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {projectOpen &&
                        projectModules.map((module) => {
                          const moduleSubmodules = submodules.filter(
                            (s) => s.module_id === module.id
                          );
                          const moduleFeatures = features.filter((feat) =>
                            moduleSubmodules.some((sub) => sub.id === feat.submodule_id)
                          );
                          const moduleOpen = expandedModules.has(module.id);
                          const isModOverdue = isOverdue(module.end_date, module.status);

                          return (
                            <Fragment key={module.id}>
                              {/* Module row */}
                              <tr
                                className={`${
                                  selectedModuleId === module.id ? "selected-row" : ""
                                } module-row`}
                              >
                                <td className="level-1">
                                  <button
                                    className="tree-toggle"
                                    onClick={() => toggleSet(setExpandedModules, module.id)}
                                  >
                                    {moduleOpen ? "▼" : "▶"}
                                  </button>
                                  <strong className="entity-name">{module.name}</strong>
                                  <span className="badge badge-primary font-xs ml-1">MODULE</span>
                                  {module.description && (
                                    <p className="item-description-sub">{module.description}</p>
                                  )}
                                </td>
                                <td className="owner-cell">{module.owner || "—"}</td>
                                <td>
                                  <StatusBadge status={module.status} />
                                </td>
                                <td>
                                  <PriorityBadge priority={module.priority} />
                                </td>
                                <td>
                                  <span className={`duration-text ${isModOverdue ? "overdue-warning" : ""}`}>
                                    {getDurationText(module.start_date, module.end_date)}
                                    {isModOverdue && <span className="warning-pill ml-1">OVERDUE</span>}
                                  </span>
                                </td>
                                <td>
                                  <ProgressBar progress={module.progress || 0} size="sm" />
                                </td>
                                <td className="scope-cell">
                                  <span className="scope-count">{moduleFeatures.length} Features</span>
                                </td>
                                <td>
                                  <div className="action-row right">
                                    <button
                                      className="btn btn-secondary btn-xs"
                                      onClick={() => beginAdd("submodule", { module_id: module.id })}
                                    >
                                      + Sub
                                    </button>
                                    <button className="btn-icon" onClick={() => beginEdit("module", module)}>
                                      Edit
                                    </button>
                                    <button className="btn-icon danger" onClick={() => deleteRow("module", module)}>
                                      Del
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {/* Module Submodules */}
                              {moduleOpen && moduleSubmodules.length === 0 && (
                                <tr className="empty-grid-row">
                                  <td colSpan={8}>
                                    <div className="empty-row-action nested level-2">
                                      <span>No sub modules under {module.name}.</span>
                                      <button
                                        className="btn btn-primary btn-xs"
                                        onClick={() => beginAdd("submodule", { module_id: module.id })}
                                      >
                                        Add Sub Module
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}

                              {moduleOpen &&
                                moduleSubmodules.map((submodule) => {
                                  const submoduleFeatures = features.filter(
                                    (f) => f.submodule_id === submodule.id
                                  );
                                  const submoduleOpen = expandedSubmodules.has(submodule.id);
                                  const isSubOverdue = isOverdue(submodule.end_date, submodule.status);

                                  return (
                                    <Fragment key={submodule.id}>
                                      {/* Submodule row */}
                                      <tr
                                        className={`${
                                          selectedSubmoduleId === submodule.id ? "selected-row" : ""
                                        } submodule-row`}
                                      >
                                        <td className="level-2">
                                          <button
                                            className="tree-toggle"
                                            onClick={() =>
                                              toggleSet(setExpandedSubmodules, submodule.id)
                                            }
                                          >
                                            {submoduleOpen ? "▼" : "▶"}
                                          </button>
                                          <strong className="entity-name">{submodule.name}</strong>
                                          <span className="badge badge-success font-xs ml-1">SUBMODULE</span>
                                          {submodule.description && (
                                            <p className="item-description-sub">{submodule.description}</p>
                                          )}
                                        </td>
                                        <td className="owner-cell">{submodule.owner || "—"}</td>
                                        <td>
                                          <StatusBadge status={submodule.status} />
                                        </td>
                                        <td>
                                          <PriorityBadge priority={submodule.priority} />
                                        </td>
                                        <td>
                                          <span className={`duration-text ${isSubOverdue ? "overdue-warning" : ""}`}>
                                            {getDurationText(submodule.start_date, submodule.end_date)}
                                            {isSubOverdue && <span className="warning-pill ml-1">OVERDUE</span>}
                                          </span>
                                        </td>
                                        <td>
                                          <ProgressBar progress={submodule.progress || 0} size="sm" />
                                        </td>
                                        <td className="scope-cell">
                                          <span className="scope-count">{submoduleFeatures.length} Features</span>
                                        </td>
                                        <td>
                                          <div className="action-row right">
                                            <button
                                              className="btn btn-secondary btn-xs"
                                              onClick={() =>
                                                beginAdd("feature", {
                                                  submodule_id: submodule.id,
                                                })
                                              }
                                            >
                                              + Feature
                                            </button>
                                            <button className="btn-icon" onClick={() => beginEdit("submodule", submodule)}>
                                              Edit
                                            </button>
                                            <button className="btn-icon danger" onClick={() => deleteRow("submodule", submodule)}>
                                              Del
                                            </button>
                                          </div>
                                        </td>
                                      </tr>

                                      {/* Submodule Features */}
                                      {submoduleOpen &&
                                        submoduleFeatures.map((feature) => {
                                          const linkedTables = tableFeatures.filter(
                                            (link) => link.feature_id === feature.id
                                          );
                                          const linkedTableIds = linkedTables.map(
                                            (link) => link.table_id
                                          );
                                          const availableTables = tables.filter(
                                            (table) => !linkedTableIds.includes(table.id)
                                          );
                                          const isFeatOverdue = isOverdue(feature.end_date, feature.status);

                                          return (
                                            <tr key={feature.id} className="feature-row">
                                              <td className="level-3">
                                                <strong className="entity-name">{feature.feature_name}</strong>
                                                <span className="badge badge-warning font-xs ml-1">FEATURE</span>
                                                {feature.description && (
                                                  <p className="item-description-sub">{feature.description}</p>
                                                )}
                                              </td>
                                              <td className="owner-cell">{feature.owner || "—"}</td>
                                              <td>
                                                <StatusBadge status={feature.status} />
                                              </td>
                                              <td>
                                                <PriorityBadge priority={feature.priority} />
                                              </td>
                                              <td>
                                                <span className={`duration-text ${isFeatOverdue ? "overdue-warning" : ""}`}>
                                                  {getDurationText(feature.start_date, feature.end_date)}
                                                  {isFeatOverdue && <span className="warning-pill ml-1">OVERDUE</span>}
                                                </span>
                                              </td>
                                              <td>
                                                <ProgressBar progress={feature.progress || 0} size="sm" />
                                              </td>
                                              <td>
                                                <div className="feature-table-cell">
                                                  <div className="feature-chip-row">
                                                    {linkedTables.length === 0 && (
                                                      <span className="list-item-meta font-xs">No tables linked</span>
                                                    )}
                                                    {linkedTables.map((link) => (
                                                      <span key={link.id} className="feature-chip">
                                                        {link.table_name}
                                                        <button
                                                          className="chip-remove"
                                                          onClick={() => removeFeatureTable(link.id)}
                                                        >
                                                          &times;
                                                        </button>
                                                      </span>
                                                    ))}
                                                  </div>

                                                  <div className="table-link-editor">
                                                    <select
                                                      className="form-select compact-select"
                                                      value={tableDrafts[feature.id] || ""}
                                                      onChange={(e) =>
                                                        setTableDrafts({
                                                          ...tableDrafts,
                                                          [feature.id]: Number(e.target.value),
                                                        })
                                                      }
                                                    >
                                                      <option value="">Choose table...</option>
                                                      {availableTables.map((table) => (
                                                        <option key={table.id} value={table.id}>
                                                          {table.table_name}
                                                        </option>
                                                      ))}
                                                    </select>
                                                    <button
                                                      className="btn btn-secondary btn-xs"
                                                      onClick={() => addFeatureTable(feature.id)}
                                                      disabled={availableTables.length === 0}
                                                    >
                                                      Link
                                                    </button>
                                                  </div>
                                                </div>
                                              </td>
                                              <td>
                                                <div className="action-row right">
                                                  <button className="btn-icon" onClick={() => beginEdit("feature", feature)}>
                                                    Edit
                                                  </button>
                                                  <button className="btn-icon danger" onClick={() => deleteRow("feature", feature)}>
                                                    Del
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}

                                      {submoduleOpen && submoduleFeatures.length === 0 && (
                                        <tr className="empty-grid-row">
                                          <td colSpan={8}>
                                            <div className="empty-row-action nested level-3">
                                              <span>No features under {submodule.name}.</span>
                                              <button
                                                className="btn btn-primary btn-xs"
                                                onClick={() => beginAdd("feature", { submodule_id: submodule.id })}
                                              >
                                                Add Feature
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </Fragment>
                                  );
                                })}
                            </Fragment>
                          );
                        })}
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
