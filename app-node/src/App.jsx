import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { 
  useSortable, 
  arrayMove, 
  SortableContext,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DatabaseSelector } from './components/DatabaseSelector.jsx';
import { GroupSidebar } from './components/GroupSidebar.jsx';
import { Header } from './components/Header.jsx';
import { TableCard } from './components/TableCard.jsx';
import { ConnectionLayer } from './components/ConnectionLayer.jsx';
import { useDataLoader } from './hooks/useDataLoader.js';
import { useFilteredTables } from './hooks/useFilteredTables.js';
import { Download, Sun, Moon } from 'lucide-react';
import fileSaver from 'file-saver';

const App = () => {
  const { data, loading, error, refetch, selectedDatabaseId } = useDataLoader();
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSqlTableId, setActiveSqlTableId] = useState(null);
  const [tableOrder, setTableOrder] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { filteredTables, unmappedTablesCount } = useFilteredTables(data, selectedGroupId, searchTerm);
  
  const currentGroup = data.groups?.find(g => g.group_id === selectedGroupId);

  // Reset selections when database changes
  useEffect(() => {
    setSelectedGroupId(null);
    setSearchTerm('');
    setActiveSqlTableId(null);
  }, [selectedDatabaseId]);

  // Persist table order
  useEffect(() => {
    const savedOrder = localStorage.getItem('tableOrder');
    if (savedOrder) {
      setTableOrder(JSON.parse(savedOrder));
    }
  }, []);

  useEffect(() => {
    if (tableOrder.length > 0) {
      localStorage.setItem('tableOrder', JSON.stringify(tableOrder));
    }
  }, [tableOrder]);

  // Drag handlers
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTableOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const orderedTables = useMemo(() => {
    return [...filteredTables].sort((a, b) => {
      const aIndex = tableOrder.indexOf(a.table_id);
      const bIndex = tableOrder.indexOf(b.table_id);
      return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
    });
  }, [filteredTables, tableOrder]);

  // Export functions
  const exportSQL = useCallback(() => {
    if (!data.tables) return;
    const sqlContent = data.tables.map(table => generateSQL(table)).join('\n\n');
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    fileSaver.saveAs(blob, (data.database?.database_name || 'schema') + '.sql');
  }, [data]);

  const exportJSON = useCallback(() => {
    if (!data) return;
    const schema = {
      database: data.database,
      tables: data.tables,
      groups: data.groups,
      group_table_mapping: data.group_table_mapping
    };
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json;charset=utf-8' });
    fileSaver.saveAs(blob, 'schema.json');
  }, [data]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  }, []);

  // Load dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const generateSQL = useCallback((table) => {
    let sql = 'CREATE TABLE `' + table.table_name + '` (\n';
    const cols = table.columns.map(c => {
      let line = '  `' + c.name + '` ' + c.type;
      if (c.length) line += '(' + c.length + ')';
      if (c.is_primary) line += ' PRIMARY KEY';
      if (c.auto_increment) line += ' AUTO_INCREMENT';
      if (c.is_nullable === false) line += ' NOT NULL';
      if (c.is_unique) line += ' UNIQUE';
      if (c.default_value !== undefined && c.default_value !== null) {
        const defaultVal = isNaN(c.default_value) ? "'" + c.default_value + "'" : c.default_value;
        line += ' DEFAULT ' + defaultVal;
      }
      return line;
    });
    
    table.columns.forEach(c => {
      if (c.references) {
        cols.push('  FOREIGN KEY (`' + c.name + '`) REFERENCES `' + c.references.table + '`(`' + c.references.column + '`)');
      }
    });

    sql += cols.join(',\n') + '\n);';
    return sql;
  }, []);

  if (loading) {
    return (
      <div className="loading-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }} aria-live="polite">
        Opening Designer Console...
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen" style={{ flexDirection: 'column', gap: '20px' }}>
        <h2>Error loading schema</h2>
        <p>{error}</p>
        <button onClick={refetch} className="group-item">
          Retry
        </button>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className={`layout ${isDarkMode ? 'dark' : ''}`}>
        <aside className="sidebar">
          <DatabaseSelector />
          <GroupSidebar 
            selectedGroupId={selectedGroupId} 
            setSelectedGroupId={setSelectedGroupId}
          />
        </aside>

        <main className="main-content">
          <Header 
            data={data} 
            selectedGroupId={selectedGroupId}
            currentGroup={currentGroup}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <div className="header-actions">
            <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={exportSQL} className="export-btn" aria-label="Export SQL">
              <Download size={18} /> SQL
            </button>
            <button onClick={exportJSON} className="export-btn" aria-label="Export JSON">
              <Download size={18} /> JSON
            </button>
          </div>

          <section className="table-zone">
            <div className="table-grid" style={{ position: 'relative' }}>
              <ConnectionLayer 
                filteredTables={orderedTables} 
                activeSqlTableId={activeSqlTableId}
              />
              <SortableContext items={tableOrder} strategy={verticalListSortingStrategy}>
                {orderedTables.map((table, index) => {
                  const tableId = table.table_id;
                  return (
                    <SortableTableCard
                      key={tableId}
                      id={tableId}
                      index={index}
                      table={table}
                      activeSqlTableId={activeSqlTableId}
                      setActiveSqlTableId={setActiveSqlTableId}
                      data={data}
                    />
                  );
                })}
              </SortableContext>
            </div>

            {orderedTables.length === 0 && searchTerm && (
              <div className="empty-state" aria-live="polite">
                <p>No tables found matching "{searchTerm}"</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </DndContext>
  );
};

function SortableTableCard({ table, activeSqlTableId, setActiveSqlTableId, data }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: table.table_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TableCard
        table={table}
        activeSqlTableId={activeSqlTableId}
        setActiveSqlTableId={setActiveSqlTableId}
        data={data}
      />
    </div>
  );
}

export default App;
