import React from 'react';
import { useDataLoader } from '../hooks/useDataLoader.js';
import { useFilteredTables } from '../hooks/useFilteredTables.js';

export const GroupSidebar = ({ selectedGroupId, setSelectedGroupId }) => {
  const { data } = useDataLoader();
  const { unmappedTablesCount } = useFilteredTables(data, selectedGroupId, '');

  if (!data.groups || data.groups.length === 0) {
    return (
      <div style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
        No groups loaded
      </div>
    );
  }

  const currentGroup = data.groups.find(g => g.group_id === selectedGroupId);

  return (
    <>
      <div className="sidebar-header">
        <h3>Database Modules</h3>
      </div>
      <div className="group-list">
        <button 
          className={`group-item ${selectedGroupId === null ? 'active' : ''}`}
          onClick={() => setSelectedGroupId(null)}
          aria-label="Show full schema"
        >
          <span className="group-name">Full Schema</span>
          <span className="group-count">{data.tables?.length || 0}</span>
        </button>
        
        <div className="divider-h"></div>

        {data.groups.map((group) => {
          const tableIdsInGroup = data.group_table_mapping
            .filter(m => m.group_id === group.group_id)
            .map(m => m.table_id);
          const count = data.tables.filter(t => tableIdsInGroup.includes(t.table_id)).length;
          
          return (
            <button 
              key={group.group_id}
              className={`group-item ${selectedGroupId === group.group_id ? 'active' : ''}`}
              onClick={() => setSelectedGroupId(group.group_id)}
              aria-label={`View ${group.group_name} group (${count} tables)`}
            >
              <span className="group-name">{group.group_name}</span>
              <span className="group-count">{count}</span>
            </button>
          );
        })}

        <div className="divider-h"></div>
        
        <button 
          className={`group-item unmapped ${selectedGroupId === 'unmapped' ? 'active' : ''}`}
          onClick={() => setSelectedGroupId('unmapped')}
          aria-label={`Orphan tables (${unmappedTablesCount})`}
        >
          <span className="group-name">Orphan Tables</span>
          <span className="group-count">{unmappedTablesCount}</span>
        </button>
      </div>
    </>
  );
};

