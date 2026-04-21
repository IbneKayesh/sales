import React, { useState } from 'react';
import { Search, Database, Package, Table } from 'lucide-react';

export const Header = ({ data, selectedGroupId, currentGroup, searchTerm, setSearchTerm }) => {
  return (
    <header className="content-header" role="banner">
      <div className="header-left" aria-label="Current view">
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
            <h1>{data.database?.database_name || 'Design Workbench'}</h1>
            <p>{data.database?.description || 'Global view of system-wide database topology'}</p>
          </div>
        )}
      </div>
      <div className="header-right">
        <div className="search-box" role="search">
          <Search className="search-icon" size={16} aria-hidden="true" />
          <input 
            type="search" 
            placeholder="Find table, column or constraint..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search tables and columns"
          />
        </div>
      </div>
    </header>
  );
};

