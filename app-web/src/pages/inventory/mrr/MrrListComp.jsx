import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/datetime";

const MrrListComp = ({ pageAuth, dataList, onEdit, onDelete }) => {
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

  const mrrmt_trnno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm font-bold">{rowData.mrrmt_trnno}</span>
        <span className="text-gray-600 text-sm mt-1">
          {formatDate(rowData.mrrmt_trdat)}
        </span>
        <span className="text-sm">{rowData.cntct_cntnm}</span>
      </div>
    );
  };

  const mrrmt_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{rowData.mrrmt_refno || "No Ref"}</span>
        <span className="text-sm mt-1">{rowData.mrrmt_notes || "N/A"}</span>
      </div>
    );
  };
  const mrrmt_tramt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Total: {Number(rowData.mrrmt_tramt || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Item Discount: {Number(rowData.mrrmt_itmds || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Invoice Discount: {Number(rowData.mrrmt_invds || 0).toFixed(3)}
        </span>
      </div>
    );
  };
  const mrrmt_vtamt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          VAT: {Number(rowData.mrrmt_vtamt || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          TAX: {Number(rowData.mrrmt_txamt || 0).toFixed(3)}
        </span>
      </div>
    );
  };
  const mrrmt_icamt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Include: {Number(rowData.mrrmt_icamt || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Exclude: {Number(rowData.mrrmt_ecamt || 0).toFixed(3)}
        </span>
      </div>
    );
  };

  const mrrmt_pyamt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Payable: {Number(rowData.mrrmt_pyamt || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Paid: {Number(rowData.mrrmt_pdamt || 0).toFixed(3)}
        </span>
        <span className="text-sm mt-1">
          Due: {Number(rowData.mrrmt_duamt || 0).toFixed(3)}
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
      <Column field="mrrmt_trnno" header="Trn" body={mrrmt_trnno_BT} />
      <Column field="mrrmt_refno" header="Ref" body={mrrmt_refno_BT} />
      <Column field="mrrmt_tramt" header="Amount" body={mrrmt_tramt_BT} />
      <Column field="mrrmt_vtamt" header="VAT/TAX" body={mrrmt_vtamt_BT} />
      <Column field="mrrmt_icamt" header="Cost" body={mrrmt_icamt_BT} />
      <Column field="mrrmt_pyamt" header="Payment" body={mrrmt_pyamt_BT} />
      <Column header={dataList?.length + " rows"} body={action_BT} />
    </DataTable>
  ) : (
    <EmptyState />
  );
};
export default MrrListComp;
