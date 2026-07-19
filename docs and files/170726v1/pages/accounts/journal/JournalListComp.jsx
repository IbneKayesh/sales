import { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/datetime";

const JournalListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Type", accessor: "mjrnl_trtyp" },
    { header: "Trn No", accessor: "mjrnl_trnno" },
    { header: "Date", accessor: "mjrnl_trdat" },
    { header: "Ref No", accessor: "mjrnl_refno" },
    { header: "Narration", accessor: "mjrnl_narrt" },
    { header: "Debit", accessor: "mjrnl_drval" },
    { header: "Credit", accessor: "mjrnl_crval" },
    { header: "Status", accessor: "mjrnl_stats" },
  ];

  const mjrnl_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{rowData.mjrnl_trnno}</span>
        <span className="text-gray-600 text-sm mt-1">
          {rowData.mjrnl_trtyp}
        </span>
      </div>
    );
  };

  const mjrnl_trdat_BT = (rowData) => {
    return formatDate(rowData.mjrnl_trdat);
  };

  const mjrnl_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{rowData.mjrnl_refno}</span>
        <span className="text-gray-600 text-sm mt-1">
          {rowData.mjrnl_narrt}
        </span>
      </div>
    );
  };
  const mjrnl_drval_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Dr: {rowData.mjrnl_drval}</span>
        <span className="text-sm">Cr: {rowData.mjrnl_crval}</span>
      </div>
    );
  };

  const mjrnl_stats_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Status: {rowData.mjrnl_stats}</span>
        <span className="text-sm">Approved: {formatDate(rowData.mjrnl_apdat)}</span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.brand_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.brand_actve
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
            fileName={`journal-${new Date().toISOString().slice(0, 10)}`}
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
      <Column field="mjrnl_trnno" header="No" body={mjrnl_trnno_BT} sortable />
      <Column
        field="mjrnl_trdat"
        header="Date"
        body={mjrnl_trdat_BT}
        sortable
      />
      <Column field="mjrnl_refno" header="Ref" body={mjrnl_refno_BT} sortable />
      <Column
        field="mjrnl_drval"
        header="Value"
        body={mjrnl_drval_BT}
        sortable
      />
      <Column
        field="mjrnl_stats"
        header="Status"
        body={mjrnl_stats_BT}
        sortable
      />
      <Column header={dataList?.length + " rows"} body={action_BT} />
    </DataTable>
  ) : (
    <EmptyState />
  );
};
export default JournalListComp;
