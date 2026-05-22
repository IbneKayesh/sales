import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import ErdBoard from "./ErdBoard";
import ProjectsPanel from "./ProjectsPanel";
import TablesPanel from "./TablesPanel";
import Dashboard from "./Dashboard";

export default function TabContent({
  activeTab,
  loading,
  error,
  onRetry,
  projects,
  modules,
  submodules,
  tables,
  columns,
  features,
  tableFeatures,

  selectedModuleId,
  setSelectedModuleId,
  selectedSubmoduleId,
  setSelectedSubmoduleId,
  selectedTableId,
  setSelectedTableId,
  expandedTableIds,
  setExpandedTableIds,
  expandedProjectIds,
  setExpandedProjectIds,
  expandedModuleIds,
  setExpandedModuleIds,
  expandedSubmoduleIds,
  setExpandedSubmoduleIds,

  // projects panel selection
  selectedProjectId,
  setSelectedProjectId,



  // targeted refreshers
  // (onFetchData kept for backward compatibility; no longer used here)
  refreshForAddEditDeleteProject,
  refreshForAddEditDeleteModule,
  refreshForAddEditDeleteSubmodule,

  refreshForAddEditDeleteFeature,
  refreshForLinkUnlinkTableFeature,
  refreshForAddEditDeleteTable,
  refreshForAddEditDeleteColumn,
}) {
  if (loading) {
    return <LoadingState message="Initializing database schema..." />;
  }

  if (error && modules.length === 0) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  return (
    <div className="tab-panel fade-in">
      {activeTab === "dashboard" && (
        <Dashboard />
      )}

      {activeTab === "erd" && (
        <ErdBoard
          modules={modules}
          submodules={submodules}
          features={features}
          tableFeatures={tableFeatures}
          tables={tables}
          columns={columns}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsPanel
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          modules={modules}

          submodules={submodules}
          features={features}
          tableFeatures={tableFeatures}
          tables={tables}
          selectedModuleId={selectedModuleId}
          setSelectedModuleId={setSelectedModuleId}
          selectedSubmoduleId={selectedSubmoduleId}
          setSelectedSubmoduleId={setSelectedSubmoduleId}
          expandedProjectIds={expandedProjectIds}
          setExpandedProjectIds={setExpandedProjectIds}
          expandedModuleIds={expandedModuleIds}
          setExpandedModuleIds={setExpandedModuleIds}
          expandedSubmoduleIds={expandedSubmoduleIds}
          setExpandedSubmoduleIds={setExpandedSubmoduleIds}
          refreshForAddEditDeleteProject={refreshForAddEditDeleteProject}
          refreshForAddEditDeleteModule={refreshForAddEditDeleteModule}
          refreshForAddEditDeleteSubmodule={refreshForAddEditDeleteSubmodule}

          refreshForAddEditDeleteFeature={refreshForAddEditDeleteFeature}
          refreshForLinkUnlinkTableFeature={refreshForLinkUnlinkTableFeature}
        />
      )}

      {activeTab === "designer" && (
        <TablesPanel
          modules={modules}
          submodules={submodules}
          features={features}
          tables={tables}
          columns={columns}
          tableFeatures={tableFeatures}
          selectedTableId={selectedTableId}
          setSelectedTableId={setSelectedTableId}
          expandedTableIds={expandedTableIds}
          setExpandedTableIds={setExpandedTableIds}
          refreshForAddEditDeleteTable={refreshForAddEditDeleteTable}
          refreshForAddEditDeleteColumn={refreshForAddEditDeleteColumn}
        />
      )}
    </div>
  );
}

