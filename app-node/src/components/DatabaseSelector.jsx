import React from 'react';
import { useDataLoader } from '../hooks/useDataLoader.js';

export const DatabaseSelector = () => {
  const { databases, selectedDatabaseId, setSelectedDatabaseId, loading } = useDataLoader();

  if (loading || databases.length === 0) {
    return (
      <div className="sidebar-header database-selector-header">
        <div style={{ width: '100%', height: '32px', background: 'var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--text)' }}>
          Loading databases...
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-header database-selector-header">
      <select 
        className="database-select" 
        value={selectedDatabaseId || ''} 
        onChange={(e) => setSelectedDatabaseId(Number(e.target.value))}
        disabled={loading}
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--sidebar-bg)', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-h)' }}
        aria-label="Select database"
      >
        {databases.map(db => (
          <option key={db.database_id} value={db.database_id}>
            {db.database_name.toUpperCase()} DB
          </option>
        ))}
      </select>
    </div>
  );
};

