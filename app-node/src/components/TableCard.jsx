import React from 'react';

const generateSQL = (table) => {
  let sql = `CREATE TABLE \`${table.table_name}\` (\n`;
  const cols = table.columns.map(c => {
    let line = `  \`${c.name}\` ${c.type}`;
    if (c.length) line += `(${c.length})`;
    if (c.is_primary) line += ` PRIMARY KEY`;
    if (c.auto_increment) line += ` AUTO_INCREMENT`;
    if (c.is_nullable === false) line += ` NOT NULL`;
    if (c.is_unique) line += ` UNIQUE`;
    if (c.default_value !== undefined && c.default_value !== null) {
      const defaultVal = isNaN(c.default_value) ? `'${c.default_value}'` : c.default_value;
      line += ` DEFAULT ${defaultVal}`;
    }
    return line;
  });
  
  // Add FKs
  table.columns.forEach(c => {
    if (c.references) {
      cols.push(`  FOREIGN KEY (\`${c.name}\`) REFERENCES \`${c.references.table}\`(\`${c.references.column}\`)`);
    }
  });

  sql += cols.join(',\n') + `\n);`;
  return sql;
};

export const TableCard = ({ 
  table, 
  activeSqlTableId, 
  setActiveSqlTableId, 
  data,
  idPrefix 
}) => {
  const incomingRefs = data.tables.flatMap(t => 
    t.columns
      .filter(c => c.references && c.references.table === table.table_name)
      .map(c => ({ fromTable: t.table_name, fromCol: c.name, toCol: c.references.column }))
  );

  const isActive = activeSqlTableId === table.table_id;

  return (
    <article className={`table-card ${isActive ? 'showing-sql' : ''}`} style={{ zIndex: 1 }}>
      <header className="card-header">
        <div className="title-row">
          <span className="id-badge" aria-label={`Table ID ${table.table_id}`}>ID {table.table_id}</span>
          <h2 className="table-name" aria-label={`Table ${table.table_name}`}>{table.table_name}</h2>
          <button 
            className="sql-toggle" 
            onClick={(e) => {
              e.stopPropagation();
              setActiveSqlTableId(isActive ? null : table.table_id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-expanded={isActive}
            aria-label={isActive ? 'Hide SQL script' : 'Show SQL script for ' + table.table_name}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
            </svg>
          </button>
        </div>
        {table.description && <p className="table-desc">{table.description}</p>}
      </header>
      
      <div className="card-content">
        {isActive ? (
          <div className="sql-preview">
            <pre><code>{generateSQL(table)}</code></pre>
          </div>
        ) : (
          <div className="column-list">
            {table.columns.map((col) => {
              const colId = `${idPrefix || ''}col-${table.table_name}-${col.name}`;
              const colIncomingRefs = incomingRefs.filter(ref => ref.toCol === col.name);

              return (
                <div key={col.name} id={colId} className="col-row">
                  <div className="col-def">
                    <div className="col-main-info">
                      {col.is_primary && <span className="key-icon pk" title="Primary Key" aria-label="Primary key">🔑</span>}
                      {col.references && <span className="key-icon fk" title={`Foreign Key to ${col.references.table}`} aria-label="Foreign key">🔗</span>}
                      <span className={`col-name ${col.is_primary ? 'pk' : ''}`} aria-label={`Column ${col.name}`}>{col.name}</span>
                    </div>
                    <span className="col-type" aria-label={`Type ${col.type}`}>{col.type}{col.length ? `(${col.length})` : ''}</span>
                  </div>
                  <div className="col-meta">
                    {col.is_nullable === false && <span className="meta-badge" title="Not Null">NN</span>}
                    {col.is_unique && <span className="meta-badge" title="Unique">UQ</span>}
                    {col.default_value && <span className="meta-badge default" title={`Default: ${col.default_value}`}>DEF</span>}
                  </div>
                  {col.description && <span className="col-desc">{col.description}</span>}
                  
                  {col.references && (
                    <div className="ref-line outgoing" title="References other table">
                      <span className="arrow-icon">↳</span>
                      <span className="ref-path">{col.references.table}</span>
                      <span className="dot">.</span>
                      <span className="ref-col">{col.references.column}</span>
                    </div>
                  )}

                  {colIncomingRefs.length > 0 && (
                    <div className="ref-line incoming" title="Referenced by other tables">
                      <span className="arrow-icon">↲</span>
                      <div className="ref-blocks">
                        {colIncomingRefs.slice(0,3).map((ref, idx) => (
                          <span key={idx} className="ref-block-item">
                            {ref.fromTable}.{ref.fromCol}
                          </span>
                        ))}
                        {colIncomingRefs.length > 3 && <span>+{colIncomingRefs.length - 3} more</span>}
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
  );
};

