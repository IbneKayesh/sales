import { useState, useMemo } from "react";
import { TreeTable } from "primereact/treetable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

const HeadsListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Code", accessor: "ached_hcode", expander: true },
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
    dataList.forEach((item) => {
      map[item.id] = {
        key: item.id,
        data: item,
        children: [],
      };
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

    return tree;
  }, [dataList]);

  const ached_hname_BT = (node) => {
    const rowData = node.data;
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          <ActiveRowCell
            text={rowData.ached_hname}
            status={rowData.ached_actve}
          />
        </span>
      </div>
    );
  };

  const ached_hedno_BT = (node) => {
    const rowData = node.data;
    return (
      <div className="flex flex-column">
        <span className="text-sm">#{rowData.ached_hedno}</span>
        <span className="text-gray-600 text-sm mt-1">
          {rowData.ached_hcode}
        </span>
        <span className="text-blue-500 font-semibold text-sm mt-1">
          <Badge
            value={rowData.ached_htype.toUpperCase()}
            severity={"secondary"}
          />
        </span>
      </div>
    );
  };

  const ached_child_BT = (node) => {
    return (
      <Badge
        value={node.data.ached_child ? "Yes" : "No"}
        severity={node.data.ached_child ? "success" : "danger"}
      />
    );
  };

  const ached_alpst_BT = (node) => {
    return (
      <Badge
        value={node.data.ached_alpst ? "Yes" : "No"}
        severity={node.data.ached_alpst ? "success" : "danger"}
      />
    );
  };

  const action_BT = (node) => {
    const rowData = node.data;
    let menuItems = [
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
    );
  };

  const dt_HT = () => {
    return (
      <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3">
        <div className="p-inputgroup w-full md:w-25rem">
          <span className="p-inputgroup-addon bg-gray-100">
            <i className="pi pi-search"></i>
          </span>
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search here"
            className="p-inputtext-sm"
          />
        </div>

        <div className="flex flex-wrap align-items-center gap-2 w-full md:w-auto">
          <CSVExport
            data={dataList}
            fileName={`brand-${new Date().toISOString().slice(0, 10)}`}
            columns={export_columns}
            disable={pageAuth.extpr}
          />
        </div>
      </div>
    );
  };

  return dataList.length > 0 ? (
    <TreeTable
      value={dataListTree}
      paginator
      rows={25}
      rowsPerPageOptions={[25, 50, 100, 200]}
      emptyMessage="No data found."
      size="small"
      rowHover
      showGridlines
      globalFilter={globalFilter}
      globalFilterFields={export_columns.map((col) => col.accessor)}
      header={dt_HT()}
    >
      <Column
        field="ached_hname"
        header="Head Name"
        body={ached_hname_BT}
        expander
        sortable
      />
      <Column
        field="ached_hedno"
        header="Sl No"
        body={ached_hedno_BT}
        sortable
      />
      <Column
        field="ached_child"
        header="Is Child"
        body={ached_child_BT}
        sortable
      />
      <Column
        field="ached_alpst"
        header="Posting"
        body={ached_alpst_BT}
        sortable
      />
      <Column field="ached_level" header="Level" className="hidden" sortable />
      <Column header={dataList?.length + " rows"} body={action_BT} />
    </TreeTable>
  ) : (
    <EmptyState />
  );
};

export default HeadsListComp;
