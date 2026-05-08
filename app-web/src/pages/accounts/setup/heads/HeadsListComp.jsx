import { useState, useMemo } from "react";
import { Tree } from "primereact/tree";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

const HeadsListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedKeys, setExpandedKeys] = useState({});

  const export_columns = [
    { header: "Code", accessor: "ached_hcode" },
    { header: "Name", accessor: "ached_hname" },
    { header: "Type", accessor: "ached_htype" },
    { header: "Sl No", accessor: "ached_hedno" },
    { header: "Child", accessor: "ached_child" },
    { header: "Posting", accessor: "ached_alpst" },
    { header: "Level", accessor: "ached_level" },
    { header: "Active", accessor: "ached_actve" },
  ];

  const dataListTree = useMemo(() => {
    if (!dataList || dataList.length === 0) return [];

    const map = {};
    const expKeys = {};

    dataList.forEach((item) => {
      map[item.id] = {
        key: item.id,
        label: item.ached_hname,
        data: item,
        children: [],
      };
      expKeys[item.id] = true;
    });

    const tree = [];
    dataList.forEach((item) => {
      const parentId = item.ached_ached;
      if (parentId === "-" || !map[parentId]) {
        tree.push(map[item.id]);
      } else {
        map[parentId].children.push(map[item.id]);
      }
    });

    setExpandedKeys(expKeys);
    return tree;
  }, [dataList]);

  // Filter tree nodes recursively by globalFilter
  const filteredTree = useMemo(() => {
    if (!globalFilter || globalFilter.trim() === "") return dataListTree;

    const keyword = globalFilter.toLowerCase();

    const filterNode = (node) => {
      const d = node.data;
      const matches = [
        d.ached_hname,
        d.ached_hcode,
        d.ached_htype,
        String(d.ached_hedno),
        String(d.ached_level),
      ].some((v) => v && v.toLowerCase().includes(keyword));

      const filteredChildren = (node.children || [])
        .map(filterNode)
        .filter(Boolean);

      if (matches || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return dataListTree.map(filterNode).filter(Boolean);
  }, [dataListTree, globalFilter]);

  const n_T = (node) => {
    const rowData = node.data;
    const menuItems = [
      {
        label: rowData.ached_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.ached_actve
            ? "pi-trash text-red-400"
            : "pi-check-circle text-green-400"
        }`,
        command: () => onDelete(rowData),
      },
    ];

    return (
      <div className="flex align-items-center justify-content-between w-full gap-2 hlc-row">
        {/* Head Name + Active */}
        <div className="flex flex-column mr-5" style={{ minWidth: "25%" }}>
          <span className="text-xl">
            <ActiveRowCell
              text={rowData.ached_hname}
              status={rowData.ached_actve}
            />
          </span>

          <span className="text-xs text-gray-600 mt-1">
            {rowData.ached_hcode}
          </span>
          <span className="text-md text-gray-600">#{rowData.ached_hedno}</span>
        </div>

        {/* Sl No + Type */}
        <div className="flex flex-column mr-5" style={{ minWidth: "5%" }}>
          <span className="text-xs mb-2">Type</span>
          <Badge
            value={rowData.ached_htype?.toUpperCase()}
            severity="secondary"
            className="ml-3"
          />
        </div>

        {/* Is Child */}
        <div className="flex flex-column mr-5" style={{ minWidth: "5%" }}>
          <span className="text-xs mb-2">Child</span>
          <Badge
            value={rowData.ached_child ? "Yes" : "No"}
            severity={rowData.ached_child ? "success" : "danger"}
          />
        </div>

        {/* Posting */}
        <div className="flex flex-column mr-5" style={{ minWidth: "5%" }}>
          <span className="text-xs mb-2">Posting</span>
          <Badge
            value={rowData.ached_alpst ? "Yes" : "No"}
            severity={rowData.ached_alpst ? "success" : "danger"}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <SplitButton
            icon="pi pi-pencil"
            size="small"
            tooltip="Edit"
            severity="secondary"
            outlined
            tooltipOptions={{ position: "left" }}
            onClick={() => onEdit(rowData)}
            model={menuItems}
          />
        </div>
      </div>
    );
  };

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true;
      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  const expandAll = () => {
    let _expandedKeys = {};

    for (let node of filteredTree) {
      expandNode(node, _expandedKeys);
    }

    setExpandedKeys(_expandedKeys);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const t_HT = () => (
    <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3 mb-3">
      <div className="p-inputgroup w-full md:w-25rem">
        <span className="p-inputgroup-addon bg-gray-100">
          <i className="pi pi-search" />
        </span>
        <InputText
          type="search"
          value={globalFilter}
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder={`Search here (${dataList.length} rows)`}
          className="p-inputtext-sm"
        />
      </div>

      <div className="flex flex-wrap align-items-center gap-2 w-full md:w-auto">
        <Button
          type="button"
          icon="pi pi-plus"
          label="Expand All"
          size="small"
          outlined
          onClick={expandAll}
        />
        <Button
          type="button"
          icon="pi pi-minus"
          label="Collapse All"
          size="small"
          outlined
          onClick={collapseAll}
        />
        <CSVExport
          data={dataList}
          fileName={`heads-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth.extpr}
        />
      </div>
    </div>
  );

  return dataList.length > 0 ? (
    <div className="mb-2">
      {t_HT()}
      <Tree
        value={filteredTree}
        expandedKeys={expandedKeys}
        onToggle={(e) => setExpandedKeys(e.value)}
        nodeTemplate={n_T}
        className="w-full"
        emptyMessage="No data found."
      />
    </div>
  ) : (
    <EmptyState />
  );
};

export default HeadsListComp;
