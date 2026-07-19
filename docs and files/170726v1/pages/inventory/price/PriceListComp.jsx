import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

const PriceListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Code", accessor: "price_pcode" },
    { header: "Item", accessor: "items_iname" },
    { header: "LP", accessor: "price_lprat" },
    { header: "DP", accessor: "price_dprat" },
    { header: "TP", accessor: "price_tprat" },
    { header: "MRP", accessor: "price_mrrat" },
    { header: "Active", accessor: "price_actve" },
  ];

  const items_iname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm font-bold">
          <ActiveRowCell
            text={rowData.items_iname}
            status={rowData.price_actve}
          />
        </span>
        <span className="text-gray-600 text-sm mt-1">
          {rowData.price_pcode || "No Code"}
        </span>
      </div>
    );
  };

  const price_lprat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          LP: {Number(rowData.price_lprat || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          DP: {Number(rowData.price_dprat || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          TP: {Number(rowData.price_tprat || 0).toFixed(3)}
        </span>
      </div>
    );
  };

  const price_dspct_BT = (rowData) => {
    return Number(rowData.price_dspct || 0).toFixed(3);
  };

  const price_gdstk_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Good: {Number(rowData.price_gdstk || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Bad: {Number(rowData.price_bdstk || 0).toFixed(3)}
        </span>
      </div>
    );
  };

  const price_mnqty_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Min: {Number(rowData.price_mnqty || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Max: {Number(rowData.price_mxqty || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Purchase Booking: {Number(rowData.price_pbqty || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Sales Booking: {Number(rowData.price_sbqty || 0).toFixed(3)}
        </span>
      </div>
    );
  };

  const action_BT = (rowData) => {
    let menuItems = [
      {
        label: rowData.price_actve ? "Deactivate" : "Activate",
        icon: `pi ${
          rowData.price_actve
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
            fileName={`price-${new Date().toISOString().slice(0, 10)}`}
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
        field="items_iname"
        header="Product"
        sortable
        body={items_iname_BT}
      />
      <Column
        field="price_lprat"
        header="Rates (LP/DP/TP)"
        body={price_lprat_BT}
      />
      <Column field="price_mrrat" header="MRP" />
      <Column field="price_dspct" header="Discount%" body={price_dspct_BT} />
      <Column field="price_gdstk" header="Stock" body={price_gdstk_BT} />
      <Column
        field="price_mnqty"
        header="Inventory Control"
        body={price_mnqty_BT}
      />
      <Column header={dataList?.length + " rows"} body={action_BT} />
    </DataTable>
  ) : (
    <EmptyState />
  );
};
export default PriceListComp;
