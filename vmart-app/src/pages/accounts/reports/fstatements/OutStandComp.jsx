import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";
import "./OutStandComp.css";

const fmtAmt = (val) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

const OutStandComp = ({ pageAuth, dataList }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  if (!dataList || dataList.length === 0) return <EmptyState />;

  const export_columns = [
    { header: "Date", accessor: "mjrnl_trdat" },
    { header: "Voucher No", accessor: "mjrnl_trnno" },
    { header: "Party", accessor: "party_pname" },
    { header: "Narration", accessor: "djrnl_descr" },
    { header: "Outstanding Amount", accessor: "amount" },
  ];

  const date_BT = (row) => new Date(row.mjrnl_trdat).toLocaleDateString();
  const amt_BT = (row) => fmtAmt(Math.abs(Number(row.djrnl_drval) - Number(row.djrnl_crval)));

  const dt_HT = () => (
    <div className="flex justify-content-between align-items-center">
      <div className="p-inputgroup w-20rem">
        <span className="p-inputgroup-addon"><i className="pi pi-search" /></span>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="p-inputtext-sm"
        />
      </div>
      <div className="flex gap-2 hide-on-print">
        <CSVExport
          data={dataList}
          fileName={`outstanding-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth?.extpr}
        />
        <Button label="Print" icon="pi pi-print" size="small" severity="info" onClick={() => window.print()} />
      </div>
    </div>
  );

  return (
    <div className="outstand-wrapper">
      <div className="outstand-title">Outstanding</div>
      <DataTable
        value={dataList}
        paginator
        rows={25}
        rowsPerPageOptions={[25, 50, 100]}
        emptyMessage="No records found."
        size="small"
        rowHover
        showGridlines
        globalFilter={globalFilter}
        globalFilterFields={export_columns.map(c => c.accessor)}
        header={dt_HT}
      >
        <Column header="Date" body={date_BT} style={{ width: '8rem' }} />
        <Column field="mjrnl_trnno" header="Voucher No" style={{ width: '12rem' }} />
        <Column field="party_pname" header="Party" />
        <Column field="djrnl_descr" header="Narration" />
        <Column header="Outstanding Amount" body={amt_BT} style={{ width: '12rem', textAlign: 'right' }} />
      </DataTable>
    </div>
  );
};
export default OutStandComp;
