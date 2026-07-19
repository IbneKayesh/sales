import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";
import "./GLedgerComp.css";

const fmtAmt = (val) => Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

const GLedgerComp = ({ pageAuth, dataList }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  if (!dataList || dataList.length === 0) return <EmptyState />;

  const export_columns = [
    { header: "Date", accessor: "mjrnl_trdat" },
    { header: "Type", accessor: "mjrnl_trtyp" },
    { header: "Voucher No", accessor: "mjrnl_trnno" },
    { header: "Account", accessor: "chtac_cname" },
    { header: "Narration", accessor: "djrnl_descr" },
    { header: "Debit", accessor: "djrnl_drval" },
    { header: "Credit", accessor: "djrnl_crval" },
  ];

  const date_BT = (row) => new Date(row.mjrnl_trdat).toLocaleDateString();
  const dr_BT = (row) => fmtAmt(row.djrnl_drval);
  const cr_BT = (row) => fmtAmt(row.djrnl_crval);

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
          fileName={`general-ledger-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth?.extpr}
        />
        <Button label="Print" icon="pi pi-print" size="small" severity="info" onClick={() => window.print()} />
      </div>
    </div>
  );

  return (
    <div className="gledger-wrapper">
      <div className="gledger-title">General Ledger</div>
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
        <Column field="chtac_cname" header="Account" />
        <Column field="djrnl_descr" header="Narration" />
        <Column field="djrnl_drval" header="Debit" body={dr_BT} style={{ width: '10rem', textAlign: 'right' }} />
        <Column field="djrnl_crval" header="Credit" body={cr_BT} style={{ width: '10rem', textAlign: 'right' }} />
      </DataTable>
    </div>
  );
};
export default GLedgerComp;
