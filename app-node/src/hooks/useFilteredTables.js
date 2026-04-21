import { useMemo, useState } from 'react';

export const useFilteredTables = (data, selectedGroupId, searchTerm) => {
  const unmappedTablesCount = useMemo(() => {
    if (!data.tables || !data.group_table_mapping) return 0;
    const mappedIds = new Set(data.group_table_mapping.map(m => m.table_id));
    return data.tables.filter(t => !mappedIds.has(t.table_id)).length;
  }, [data.tables, data.group_table_mapping]);

  const filteredTables = useMemo(() => {
    if (!data.tables) return [];

    let tablesToShow = [];

    if (selectedGroupId === null) {
      tablesToShow = [...data.tables];
    } else if (selectedGroupId === 'unmapped') {
      const mappedIds = new Set(data.group_table_mapping.map(m => m.table_id));
      tablesToShow = data.tables.filter(t => !mappedIds.has(t.table_id));
    } else {
      const tableIdsInGroup = data.group_table_mapping
        .filter(m => m.group_id === selectedGroupId)
        .map(m => m.table_id);
      tablesToShow = data.tables.filter(t => tableIdsInGroup.includes(t.table_id));
    }

    const lowSearch = searchTerm.toLowerCase();
    const searchFiltered = tablesToShow.filter(t => 
      t.table_name.toLowerCase().includes(lowSearch) ||
      (t.description && t.description.toLowerCase().includes(lowSearch)) ||
      t.columns.some(c => 
        c.name.toLowerCase().includes(lowSearch) || 
        (c.description && c.description.toLowerCase().includes(lowSearch))
      )
    );

    return searchFiltered.sort((a, b) => a.table_id - b.table_id);
  }, [data, selectedGroupId, searchTerm]);

  return { filteredTables, unmappedTablesCount };
};

