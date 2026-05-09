import { useEffect, useState, useMemo } from "react";
import { Tree } from "primereact/tree";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

const CoaListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedKeys, setExpandedKeys] = useState({});

  const export_columns = [
    { header: "Code", accessor: "chtac_ccode" },
    { header: "Name", accessor: "chtac_cname" },
    { header: "Type", accessor: "chtac_ctype" },
    { header: "Sl No", accessor: "chtac_chtno" },
    { header: "Child", accessor: "chtac_child" },
    { header: "Posting", accessor: "chtac_alpst" },
    { header: "Level", accessor: "chtac_level" },
    { header: "Active", accessor: "chtac_actve" },
  ];

  // const dataListTree = useMemo(() => {
  //   if (!dataList || dataList.length === 0) return [];

  //   const map = {};
  //   const expKeys = {};

  //   dataList.forEach((item) => {
  //     map[item.id] = {
  //       key: item.id,
  //       label: item.chtac_cname,
  //       data: item,
  //       children: [],
  //     };
  //     expKeys[item.id] = true;
  //   });

  //   const tree = [];
  //   dataList.forEach((item) => {
  //     const parentId = item.chtac_chtac;
  //     if (parentId === "-" || !map[parentId]) {
  //       tree.push(map[item.id]);
  //     } else {
  //       map[parentId].children.push(map[item.id]);
  //     }
  //   });

  //   setExpandedKeys(expKeys);
  //   return tree;
  // }, [dataList]);

  useEffect(() => {
    const expKeys = {};

    dataList.forEach((item) => {
      //expKeys[item.id] = true;
      if (item.chtac_chtac === "-") {
        expKeys[item.id] = true;
      }
    });

    setExpandedKeys(expKeys);
  }, [dataList]);

  const dataListTree = useMemo(() => {
    if (!dataList || dataList.length === 0) return [];

    const map = {};

    dataList.forEach((item) => {
      map[item.id] = {
        key: item.id,
        label: item.chtac_cname,
        data: item,
        children: [],
      };
    });

    const tree = [];

    dataList.forEach((item) => {
      const parentId = item.chtac_chtac;

      if (parentId === "-" || !map[parentId]) {
        tree.push(map[item.id]);
      } else {
        map[parentId].children.push(map[item.id]);
      }
    });

    return tree;
  }, [dataList]);

  // Filter tree nodes recursively by globalFilter
  const filteredTree = useMemo(() => {
    if (!globalFilter || globalFilter.trim() === "") return dataListTree;

    const keyword = globalFilter.toLowerCase();

    const filterNode = (node) => {
      const d = node.data;
      const matches = [
        d.chtac_cname,
        d.chtac_ccode,
        d.chtac_ctype,
        String(d.chtac_chtno),
        String(d.chtac_level),
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
        label: rowData.chtac_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.chtac_actve
            ? "pi-trash text-red-400"
            : "pi-check-circle text-green-400"
        }`,
        command: () => onDelete(rowData),
      },
    ];

    return (
      <div className="flex align-items-center justify-content-between w-full gap-2 border-1 border-300 border-round p-3">
        {/* Head Name + Active */}
        <div className="flex flex-column mr-5" style={{ minWidth: "25%" }}>
          <span className="text-xl">
            <ActiveRowCell
              text={rowData.chtac_cname}
              status={rowData.chtac_actve}
            />
          </span>

          <span className="text-xs text-gray-600 mt-1">
            {rowData.chtac_ccode}
          </span>
          <span className="text-md text-blue-600">#{rowData.chtac_chtno}</span>
        </div>

        {/* Sl No + Type */}
        <div className="flex flex-column mr-5" style={{ minWidth: "5%" }}>
          <span className="text-xs mb-2">Type</span>
          <Badge
            value={rowData.chtac_ctype?.toUpperCase()}
            severity="secondary"
            className="ml-3"
          />
        </div>

        {/* Is Child */}
        <div className="flex flex-column mr-5" style={{ minWidth: "5%" }}>
          <span className="text-xs mb-2">Child</span>
          <Badge
            value={rowData.chtac_child ? "Yes" : "No"}
            severity={rowData.chtac_child ? "success" : "danger"}
          />
        </div>

        {/* Posting */}
        <div className="flex flex-column mr-5" style={{ minWidth: "5%" }}>
          <span className="text-xs mb-2">Posting</span>
          <Badge
            value={rowData.chtac_alpst ? "Yes" : "No"}
            severity={rowData.chtac_alpst ? "success" : "danger"}
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
          fileName={`coa-${new Date().toISOString().slice(0, 10)}`}
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

export default CoaListComp;
