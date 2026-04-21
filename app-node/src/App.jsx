import { useState, useEffect, useMemo } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({ groups: [], tables: [], group_table_mapping: [] })
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeSqlTableId, setActiveSqlTableId] = useState(null)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading data:', err)
        setLoading(false)
      })
  }, [])

  const unmappedTablesCount = useMemo(() => {
    if (!data.tables || !data.group_table_mapping) return 0
    const mappedIds = new Set(data.group_table_mapping.map(m => m.table_id))
    return data.tables.filter(t => !mappedIds.has(t.table_id)).length
  }, [data.tables, data.group_table_mapping])

  const currentGroup = useMemo(() => 
    data.groups.find(g => g.group_id === selectedGroupId)
  , [data.groups, selectedGroupId])

  const filteredTables = useMemo(() => {
    if (!data.tables) return []
    
    let tablesToShow = []
    
    if (selectedGroupId === null) {
      tablesToShow = [...data.tables]
    } else if (selectedGroupId === 'unmapped') {
      const mappedIds = new Set(data.group_table_mapping.map(m => m.table_id))
      tablesToShow = data.tables.filter(t => !mappedIds.has(t.table_id))
    } else {
      const tableIdsInGroup = data.group_table_mapping
        .filter((m) => m.group_id === selectedGroupId)
        .map((m) => m.table_id)

      tablesToShow = data.tables.filter((t) => tableIdsInGroup.includes(t.table_id))
    }

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase()
      tablesToShow = tablesToShow.filter(t => 
        t.table_name.toLowerCase().includes(lowSearch) ||
        (t.description && t.description.toLowerCase().includes(lowSearch)) ||
        t.columns.some(c => 
          c.name.toLowerCase().includes(lowSearch) || 
          (c.description && c.description.toLowerCase().includes(lowSearch))
        )
      )
    }

    return tablesToShow.sort((a, b) => a.table_id - b.table_id)
  }, [data, selectedGroupId, searchTerm])

  const generateSQL = (table) => {
    let sql = `CREATE TABLE ${table.table_name} (\n`
    const cols = table.columns.map(c => {
      let line = `  ${c.name} ${c.type}`
      if (c.length) line += `(${c.length})`
      if (c.is_primary) line += ` PRIMARY KEY`
      if (c.auto_increment) line += ` AUTO_INCREMENT`
      if (c.is_nullable === false) line += ` NOT NULL`
      if (c.is_unique) line += ` UNIQUE`
      if (c.default_value) line += ` DEFAULT ${isNaN(c.default_value) ? `'${c.default_value}'` : c.default_value}`
      return line
    })
    
    // Add FKs
    table.columns.forEach(c => {
        if (c.references) {
            cols.push(`  FOREIGN KEY (${c.name}) REFERENCES ${c.references.table}(${c.references.column})`)
        }
    })

    sql += cols.join(',\n')
    sql += `\n);`
    return sql
  }

  if (loading) return <div className="loading-screen">Opening Designer Console...</div>

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Database Modules</h3>
        </div>
        <div className="group-list">
          <button 
            className={`group-item ${selectedGroupId === null ? 'active' : ''}`}
            onClick={() => setSelectedGroupId(null)}
          >
            <span className="group-name">Full Schema</span>
            <span className="group-count">{data.tables.length}</span>
          </button>
          
          <div className="divider-h"></div>

          {data.groups.map((group) => {
            const count = data.group_table_mapping.filter(m => m.group_id === group.group_id).length
            return (
              <button 
                key={group.group_id}
                className={`group-item ${selectedGroupId === group.group_id ? 'active' : ''}`}
                onClick={() => setSelectedGroupId(group.group_id)}
              >
                <span className="group-name">{group.group_name}</span>
                <span className="group-count">{count}</span>
              </button>
            )
          })}

          <div className="divider-h"></div>
          
          <button 
            className={`group-item unmapped ${selectedGroupId === 'unmapped' ? 'active' : ''}`}
            onClick={() => setSelectedGroupId('unmapped')}
          >
            <span className="group-name">Orphan Tables</span>
            <span className="group-count">{unmappedTablesCount}</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-left">
            {selectedGroupId === 'unmapped' ? (
                <div className="group-detail">
                <h1>Orphan Inventory</h1>
                <p>Verify or reassign tables missing module paths</p>
              </div>
            ) : currentGroup ? (
              <div className="group-detail">
                <h1>{currentGroup.group_name}</h1>
                <p>{currentGroup.description}</p>
              </div>
            ) : (
                <div className="group-detail">
                <h1>Design Workbench</h1>
                <p>Global view of system-wide database topology</p>
              </div>
            )}
          </div>
          <div className="header-right">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input 
                type="text" 
                placeholder="Find table, column or constraint..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <section className="table-zone">
          <div className="table-grid">
            {filteredTables.map((table) => (
              <article key={table.table_id} className={`table-card ${activeSqlTableId === table.table_id ? 'showing-sql' : ''}`}>
                <header className="card-header">
                  <div className="title-row">
                    <span className="id-badge">ID {table.table_id}</span>
                    <h2 className="table-name">{table.table_name}</h2>
                    <button 
                        className="sql-toggle" 
                        onClick={() => setActiveSqlTableId(activeSqlTableId === table.table_id ? null : table.table_id)}
                        title="View SQL Script"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                        </svg>
                    </button>
                  </div>
                  {table.description && <p className="table-desc">{table.description}</p>}
                </header>
                
                <div className="card-content">
                    {activeSqlTableId === table.table_id ? (
                        <div className="sql-preview">
                            <pre><code>{generateSQL(table)}</code></pre>
                        </div>
                    ) : (
                        <div className="column-list">
                        {table.columns.map((col) => {
                            // Find tables that reference THIS column (if it's a PK)
                            const incomingRefs = data.tables.flatMap(t => 
                                t.columns
                                    .filter(c => c.references && c.references.table === table.table_name && c.references.column === col.name)
                                    .map(c => ({ fromTable: t.table_name, fromCol: c.name }))
                            );

                            return (
                                <div key={col.name} className="col-row">
                                    <div className="col-def">
                                        <div className="col-main-info">
                                            {col.is_primary && <span className="key-icon pk" title="Primary Key">🔑</span>}
                                            {col.references && <span className="key-icon fk" title={`Foreign Key to ${col.references.table}`}>🔗</span>}
                                            <span className={`col-name ${col.is_primary ? 'pk' : ''}`}>{col.name}</span>
                                        </div>
                                        <span className="col-type">
                                            {col.type}{col.length ? `(${col.length})` : ''}
                                        </span>
                                    </div>
                                    <div className="col-meta">
                                        {col.is_nullable === false && <span className="meta-badge" title="Not Null">NN</span>}
                                        {col.is_unique && <span className="meta-badge" title="Unique">UQ</span>}
                                        {col.default_value && <span className="meta-badge default" title={`Default: ${col.default_value}`}>DEF</span>}
                                    </div>
                                    {col.description && <span className="col-desc">{col.description}</span>}
                                    
                                    {/* Outgoing Reference (FK) */}
                                    {col.references && (
                                        <div className="ref-line outgoing" title="References other table">
                                            <span className="arrow-icon">↳</span>
                                            <span className="ref-path">{col.references.table}</span>
                                            <span className="dot">.</span>
                                            <span className="ref-col">{col.references.column}</span>
                                        </div>
                                    )}

                                    {/* Incoming Reference (Inbound Links) */}
                                    {incomingRefs.length > 0 && (
                                        <div className="ref-line incoming" title="Referenced by other tables">
                                            <span className="arrow-icon">↲</span>
                                            <div className="ref-blocks">
                                                {incomingRefs.map((ref, idx) => (
                                                    <span key={idx} className="ref-block-item">
                                                        {ref.fromTable}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        </div>
                    )}
                </div>
              </article>
            ))}
          </div>

          {filteredTables.length === 0 && (
            <div className="empty-state">
              <p>No schemas found matching "{searchTerm}"</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
