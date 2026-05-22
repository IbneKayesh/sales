import { useState, useEffect } from 'react';
import './App.css';
import { useSchemaData } from './hooks/useSchemaData.js';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Header from './components/Header.jsx';
import TabContent from './components/TabContent.jsx';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);


  // Preserve tree expansion across refetches (UX: keep what user expanded)
  const [expandedTableIds, setExpandedTableIds] = useState(() => new Set());
  const [expandedProjectIds, setExpandedProjectIds] = useState(() => new Set());
  const [expandedModuleIds, setExpandedModuleIds] = useState(() => new Set());
  const [expandedSubmoduleIds, setExpandedSubmoduleIds] = useState(() => new Set());


  // Use custom hook for data management
  const {
    dbStatus,
    projects,
    modules,
    submodules,
    tables,
    columns,
    features,
    tableFeatures,

    loading,
    error,
    fetchData,

    // targeted refreshers
    refreshForAddEditDeleteProject,
    refreshForAddEditDeleteModule,
    refreshForAddEditDeleteSubmodule,
    refreshForAddEditDeleteFeature,
    refreshForLinkUnlinkTableFeature,
    refreshForAddEditDeleteTable,
    refreshForAddEditDeleteColumn,
  } = useSchemaData();

  // Initialize default selections on data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Only apply defaults if there is no current selection.
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }

    if (selectedProjectId && modules.length > 0 && !selectedModuleId) {
      const first = modules.find((m) => m.project_id === selectedProjectId) || modules[0];
      setSelectedModuleId(first.id);
    }

    if (selectedModuleId && submodules.length > 0 && !selectedSubmoduleId) {
      const first = submodules.find((s) => s.module_id === selectedModuleId) || submodules[0];
      setSelectedSubmoduleId(first.id);
    }

    if (selectedTableId == null && tables.length > 0) {
      setSelectedTableId(tables[0].id);
    }
  }, [
    projects,
    modules,
    submodules,
    tables,
    selectedProjectId,
    selectedModuleId,
    selectedSubmoduleId,
    selectedTableId,
  ]);

  // After every refresh, drop expansion ids that no longer exist.
  useEffect(() => {
    setExpandedProjectIds(prev => {
      const ids = new Set(projects.map(p => p.id));
      return new Set([...prev].filter(id => ids.has(id)));
    });
  }, [projects]);

  useEffect(() => {
    setExpandedModuleIds(prev => {
      const ids = new Set(modules.map(m => m.id));
      return new Set([...prev].filter(id => ids.has(id)));
    });
  }, [modules]);

  useEffect(() => {
    setExpandedSubmoduleIds(prev => {
      const ids = new Set(submodules.map(s => s.id));
      return new Set([...prev].filter(id => ids.has(id)));
    });
  }, [submodules]);

  useEffect(() => {
    setExpandedTableIds(prev => {
      const ids = new Set(tables.map(t => t.id));
      return new Set([...prev].filter(id => ids.has(id)));
    });
  }, [tables]);


  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        error={error}
        onRetry={fetchData}
      />

      <div className="main-content">
        <TabContent
          activeTab={activeTab}

          loading={loading}
          error={error}
          onRetry={fetchData}
          modules={modules}
          submodules={submodules}
          tables={tables}
          columns={columns}
          features={features}
          tableFeatures={tableFeatures}
          projects={projects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedModuleId={selectedModuleId}
          setSelectedModuleId={setSelectedModuleId}

          selectedSubmoduleId={selectedSubmoduleId}
          setSelectedSubmoduleId={setSelectedSubmoduleId}
          selectedTableId={selectedTableId}
          setSelectedTableId={setSelectedTableId}
          expandedTableIds={expandedTableIds}
          setExpandedTableIds={setExpandedTableIds}
          expandedProjectIds={expandedProjectIds}
          setExpandedProjectIds={setExpandedProjectIds}
          expandedModuleIds={expandedModuleIds}
          setExpandedModuleIds={setExpandedModuleIds}
          expandedSubmoduleIds={expandedSubmoduleIds}
          setExpandedSubmoduleIds={setExpandedSubmoduleIds}
          onFetchData={fetchData}

          refreshForAddEditDeleteProject={refreshForAddEditDeleteProject}
          refreshForAddEditDeleteModule={refreshForAddEditDeleteModule}
          refreshForAddEditDeleteSubmodule={refreshForAddEditDeleteSubmodule}
          refreshForAddEditDeleteFeature={refreshForAddEditDeleteFeature}
          refreshForLinkUnlinkTableFeature={refreshForLinkUnlinkTableFeature}
          refreshForAddEditDeleteTable={refreshForAddEditDeleteTable}
          refreshForAddEditDeleteColumn={refreshForAddEditDeleteColumn}
        />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}
