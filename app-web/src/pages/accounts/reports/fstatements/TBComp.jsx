import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtAmt = (val) =>
  Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

// ─── component ──────────────────────────────────────────────────────────────
const TBComp = ({ pageAuth, dataList }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Type",    accessor: "chtac_ctype" },
    { header: "Name",    accessor: "chtac_cname" },
    { header: "Debit",   accessor: "dr" },
    { header: "Credit",  accessor: "cr" },
  ];

  // ── body templates ──────────────────────────────────────────────────────
  const dr_BT = (row) => fmtAmt(row.dr);
  const cr_BT = (row) => fmtAmt(row.cr);

  const runBal_BT = (row) => {
    const bal = Number(row.dr) - Number(row.cr);
    if (bal === 0) return <span style={{ color: "#6b7280" }}>—</span>;
    return bal > 0
      ? <span style={{ color: "#16a34a" }}>{fmtAmt(bal)} Dr</span>
      : <span style={{ color: "#dc2626" }}>{fmtAmt(Math.abs(bal))} Cr</span>;
  };

  // ── totals ──────────────────────────────────────────────────────────────
  const totalDr   = dataList?.reduce((s, r) => s + Number(r.dr  || 0), 0) ?? 0;
  const totalCr   = dataList?.reduce((s, r) => s + Number(r.cr  || 0), 0) ?? 0;
  const totalDiff = totalDr - totalCr;

  const nameFT = () => (
    <span style={{ fontWeight: 600 }}>
      Difference&nbsp;:&nbsp;
      <span style={{ color: totalDiff === 0 ? "#16a34a" : "#dc2626" }}>
        {fmtAmt(Math.abs(totalDiff))}
      </span>
    </span>
  );
  const drFT = () => <span style={{ fontWeight: 600 }}>{fmtAmt(totalDr)}</span>;
  const crFT = () => <span style={{ fontWeight: 600 }}>{fmtAmt(totalCr)}</span>;

  // ── header ──────────────────────────────────────────────────────────────
  const dt_HT = () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
      }}
    >
      <div className="p-inputgroup" style={{ maxWidth: "22rem", flex: "1 1 14rem" }}>
        <span className="p-inputgroup-addon bg-gray-100">
          <i className="pi pi-search" />
        </span>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="p-inputtext-sm"
        />
      </div>
      <CSVExport
        data={dataList}
        fileName={`trial-balance-${new Date().toISOString().slice(0, 10)}`}
        columns={export_columns}
        disable={pageAuth?.extpr}
      />
    </div>
  );

  if (!dataList || dataList.length === 0) return <EmptyState />;

  return (
    <DataTable
      value={dataList}
      paginator
      rows={25}
      rowsPerPageOptions={[25, 50, 100, 200]}
      emptyMessage="No records found."
      size="small"
      rowHover
      showGridlines
      globalFilter={globalFilter}
      globalFilterFields={export_columns.map((c) => c.accessor)}
      header={dt_HT}
      style={{ fontSize: "0.875rem" }}
    >
      <Column header="#"          style={{ width: "3rem", textAlign: "center" }}
              body={(_, opt) => opt.rowIndex + 1} />
      <Column field="chtac_ctype" header="Type"       style={{ width: "9rem" }} />
      <Column field="chtac_cname" header="Account"    footer={nameFT} />
      <Column field="dr"          header="Total Debit"
              body={dr_BT} footer={drFT}
              style={{ width: "10rem", textAlign: "right" }} />
      <Column field="cr"          header="Total Credit"
              body={cr_BT} footer={crFT}
              style={{ width: "10rem", textAlign: "right" }} />
      <Column header="Running Balance"
              body={runBal_BT}
              style={{ width: "11rem", textAlign: "right" }} />
    </DataTable>
  );
};

export default TBComp;
