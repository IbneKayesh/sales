import { useState, useMemo } from "react";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import NotesListComp from "./notes/NotesListComp";
import NotesFormComp from "./notes/NotesFormComp";
import { useNotes } from "@/hooks/support/useNotes";
import "./notes/NotesUI.css";

const NotesPage = () => {
  const {
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
    handleStatusUpdate,
  } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");

  const isList = currentView === "list";

  // Stabilize filtered data with useMemo
  const filteredData = useMemo(() => {
    if (!Array.isArray(dataList)) return [];

    const lowerQuery = (searchQuery || "").toLowerCase().trim();
    if (!lowerQuery) return dataList;

    return dataList.filter((note) => {
      if (!note) return false;
      return (
        note.notes_title?.toLowerCase().includes(lowerQuery) ||
        note.notes_descr?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [dataList, searchQuery]);

  // Categorize notes for the UI tabs
  const sections = useMemo(() => {
    const now = new Date();
    const data = filteredData || [];

    const inProgress = data.filter(
      (n) =>
        n &&
        (n.notes_stat === "In Progress" || (!n.notes_stat && n.notes_actve))
    );
    const scheduled = data.filter((n) => n && n.notes_stat === "Scheduled");
    const completed = data.filter(
      (n) =>
        n && (n.notes_stat === "Completed" || (!n.notes_stat && !n.notes_actve))
    );
    const cancelled = data.filter((n) => n && n.notes_stat === "Cancelled");

    const overdueCount = inProgress.filter(
      (n) => n.notes_dudat && new Date(n.notes_dudat) < now
    ).length;

    return { inProgress, scheduled, completed, cancelled, overdueCount };
  }, [filteredData]);

  return (
    <div className="notes-page-container">
      <div className="notes-header-section flex flex-column md:flex-row md:align-items-center justify-content-between gap-4">
        <div>
          <h1 className="notes-title">
            {isList
              ? "Productivity Notes"
              : formData.id
              ? "Edit Note"
              : "Create New Note"}
          </h1>
          <p className="notes-subtitle">
            {isList
              ? "Manage your tasks and ideas in one place."
              : "Fill in the details below to save your note."}
          </p>
        </div>

        <div className="flex flex-column md:flex-row md:align-items-center gap-3 w-full md:w-auto mt-3 md:mt-0">
          {isList && (
            <div className="relative w-full md:w-20rem">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search text-500" />
                <InputText
                  placeholder="Search notes..."
                  className="w-full border-round-xl border-1 border-200 focus:border-indigo-500 transition-all opacity-90 pr-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </IconField>
              {searchQuery && (
                <i
                  className="pi pi-times absolute cursor-pointer text-400 hover:text-600"
                  style={{
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          )}

          <div className="flex gap-2">
            {isList ? (
              <>
                <Button
                  icon="pi pi-refresh"
                  className="action-btn-ghost"
                  onClick={handleRefresh}
                  tooltip="Refresh"
                  tooltipOptions={{ position: "bottom" }}
                />
                <Button
                  label="New Note"
                  icon="pi pi-plus"
                  className="action-btn-primary"
                  onClick={handleAddNew}
                />
              </>
            ) : (
              <Button
                label="Back to List"
                icon="pi pi-arrow-left"
                className="action-btn-ghost"
                onClick={handleCancel}
              />
            )}
          </div>
        </div>
      </div>

      {isList && (
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon-wrapper stats-icon-blue">
              <i className="pi pi-spinner"></i>
            </div>
            <div className="stats-info">
              <span className="stats-label">In Progress</span>
              <span className="stats-value">{sections.inProgress.length}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-wrapper stats-icon-red">
              <i className="pi pi-exclamation-circle"></i>
            </div>
            <div className="stats-info">
              <span className="stats-label">Overdue</span>
              <span className="stats-value">{sections.overdueCount}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-wrapper stats-icon-green">
              <i className="pi pi-check-circle"></i>
            </div>
            <div className="stats-info">
              <span className="stats-label">Completed</span>
              <span className="stats-value">{sections.completed.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="content-area">
        {currentView === "list" ? (
          <TabView className="notes-tabview">
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>In Progress</span>
                  <Badge
                    value={sections.inProgress.length}
                    severity="info"
                  ></Badge>
                </div>
              }
            >
              <NotesListComp
                dataList={sections.inProgress}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Scheduled</span>
                  <Badge
                    value={sections.scheduled.length}
                    severity="warning"
                  ></Badge>
                </div>
              }
            >
              <NotesListComp
                dataList={sections.scheduled}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Completed</span>
                  <Badge
                    value={sections.completed.length}
                    severity="success"
                  ></Badge>
                </div>
              }
            >
              <NotesListComp
                dataList={sections.completed}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Cancelled</span>
                  <Badge
                    value={sections.cancelled.length}
                    severity="danger"
                  ></Badge>
                </div>
              }
            >
              <NotesListComp
                dataList={sections.cancelled}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel header="Full History">
              <NotesListComp
                dataList={filteredData}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
          </TabView>
        ) : (
          <div className="flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <NotesFormComp
                isBusy={isBusy}
                errors={errors}
                formData={formData}
                onChange={handleChange}
                onSave={handleSave}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
