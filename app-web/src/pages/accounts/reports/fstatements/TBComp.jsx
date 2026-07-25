import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";
import "./TBComp.css";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtAmt = (val) =>
  Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

// ─── component ──────────────────────────────────────────────────────────────
const TBComp = ({ pageAuth, dataList }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const export_columns = [
    { header: "Type", accessor: "chtac_ctype" },
    { header: "Name", accessor: "chtac_cname" },
    { header: "Debit", accessor: "djrnl_drval" },
    { header: "Credit", accessor: "djrnl_crval" },
  ];

  // ── body templates ──────────────────────────────────────────────────────
  const dr_BT = (row) => fmtAmt(row.djrnl_drval);
  const cr_BT = (row) => fmtAmt(row.djrnl_crval);

  const runBal_BT = (row) => {
    const bal = Number(row.djrnl_drval) - Number(row.djrnl_crval);
    if (bal === 0) return <span className="tb-runbal-zero">—</span>;
    return bal > 0 ? (
      <span className="tb-runbal-dr">{fmtAmt(bal)} Dr</span>
    ) : (
      <span className="tb-runbal-cr">{fmtAmt(Math.abs(bal))} Cr</span>
    );
  };

  // ── totals ──────────────────────────────────────────────────────────────
  const aggList = dataList?.reduce((acc, row) => {
    const existing = acc.find(item => item.chtac_cname === row.chtac_cname);
    if (existing) {
      existing.djrnl_drval = Number(existing.djrnl_drval || 0) + Number(row.djrnl_drval || 0);
      existing.djrnl_crval = Number(existing.djrnl_crval || 0) + Number(row.djrnl_crval || 0);
    } else {
      acc.push({ ...row, djrnl_drval: Number(row.djrnl_drval || 0), djrnl_crval: Number(row.djrnl_crval || 0) });
    }
    return acc;
  }, []) || [];

  const totalDr = aggList.reduce((s, r) => s + Number(r.djrnl_drval || 0), 0);
  const totalCr = aggList.reduce((s, r) => s + Number(r.djrnl_crval || 0), 0);
  const totalDiff = totalDr - totalCr;

  const nameFT = () => (
    <span className="tb-diff-label">
      Difference&nbsp;:&nbsp;
      <span className={totalDiff === 0 ? "tb-diff-success" : "tb-diff-danger"}>
        {fmtAmt(Math.abs(totalDiff))}
      </span>
    </span>
  );
  const drFT = () => <span className="tb-footer-val">{fmtAmt(totalDr)}</span>;
  const crFT = () => <span className="tb-footer-val">{fmtAmt(totalCr)}</span>;

  // ── header ──────────────────────────────────────────────────────────────
  const dt_HT = () => (
    <div className="tb-dt-header">
      <div className="p-inputgroup tb-dt-inputgroup">
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

  if (!aggList || aggList.length === 0) return <EmptyState />;

  return (
    <DataTable
      value={aggList}
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
      <Column
        header="#"
        style={{ width: "3rem", textAlign: "center" }}
        body={(_, opt) => opt.rowIndex + 1}
      />
      <Column field="chtac_ctype" header="Type" style={{ width: "9rem" }} />
      <Column field="chtac_cname" header="Account" footer={nameFT} />
      <Column
        field="djrnl_drval"
        header="Total Debit"
        body={dr_BT}
        footer={drFT}
        style={{ width: "10rem", textAlign: "right" }}
      />
      <Column
        field="djrnl_crval"
        header="Total Credit"
        body={cr_BT}
        footer={crFT}
        style={{ width: "10rem", textAlign: "right" }}
      />
      <Column
        header="Running Balance"
        body={runBal_BT}
        style={{ width: "11rem", textAlign: "right" }}
      />
    </DataTable>
  );
};

export default TBComp;
