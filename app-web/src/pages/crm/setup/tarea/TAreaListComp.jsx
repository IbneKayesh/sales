import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

const TAreaListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "DZone", accessor: "tarea_dzone" },
    { header: "Code", accessor: "tarea_tcode" },
    { header: "Name", accessor: "tarea_tname" },
    { header: "Active", accessor: "tarea_actve" },
  ];

  const tarea_tname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          <ActiveRowCell
            text={rowData.tarea_tname}
            status={rowData.tarea_actve}
          />
        </span>
        <span className="text-gray-600 text-sm mt-1">
          {rowData.tarea_tcode}
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.tarea_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.tarea_actve
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
            fileName={`dzone-${new Date().toISOString().slice(0, 10)}`}
            columns={export_columns}
            disable={pageAuth.extpr}
          />
        </div>
      </div>
    );
  };

  return dataList.length > 0 ? (
    <DataTable
      value={dataList}
      paginator
      rows={25}
      rowsPerPageOptions={[25, 50, 100, 200]}
      emptyMessage="No data found."
      size="small"
      rowHover
      showGridlines
      globalFilter={globalFilter}
      globalFilterFields={export_columns.map((col) => col.accessor)}
      header={dt_HT}
    >
      <Column header="Sl" body={(rowData, options) => options.rowIndex + 1} />
      <Column
        field="tarea_tname"
        header="Name"
        sortable
        body={tarea_tname_BT}
      />
      <Column field="dzone_dname" header="D/Zone" sortable />
      <Column header={dataList?.length + " rows"} body={action_BT} />
    </DataTable>
  ) : (
    <EmptyState />
  );
};
export default TAreaListComp;
