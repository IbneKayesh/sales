import { useState } from "react";
import { IconDollar } from "@/icons";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const CashBankReport = ({ data, isLoading, fmt }) => {
  const [accountFilter, setAccountFilter] = useState("");

  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading cash book..." />;
  if (!data || !data.items?.length) return <EmptyState icon={<IconDollar size={32} />} title="No Data" message="No cash/bank transactions found." />;

  const { items, totalDr, totalCr, closingBalance, accounts } = data;
  const filtered = accountFilter ? items.filter((i) => i.accountName === accounts.find((a) => a.id === accountFilter)?.name) : items;

  const columns = [
    { key: "date", header: "Date", width: "100px" },
    { key: "accountName", header: "Account", width: "150px" },
    { key: "trnType", header: "Type", width: "80px" },
    { key: "trnNo", header: "Trn No", width: "80px" },
    { key: "narration", header: "Narration", width: "200px" },
    { key: "debit", header: "Receipts (Dr)", width: "120px", align: "right", render: (v) => v > 0 ? fmt(v) : "—" },
    { key: "credit", header: "Payments (Cr)", width: "120px", align: "right", render: (v) => v > 0 ? fmt(v) : "—" },
    { key: "runningBalance", header: "Balance", width: "140px", align: "right", render: (v) => <span className="fw-semibold">{fmt(v)}</span> },
  ];

  return (
    <div>
      {accounts.length > 1 && (
        <div className="d-flex align-end gap-3 mb-3">
          <div style={{ minWidth: 200 }}>
            <Dropdown label="Account" options={[{ id: "", name: "All Accounts" }, ...accounts]} value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)} optionValue="id" optionLabel="name" />
          </div>
        </div>
      )}
      <DataCardGrid cols={4} gap={8} style={{ marginBottom: 16 }}>
        <DataCard variant="success" value={fmt(totalDr)} label="Total Receipts (Dr)" />
        <DataCard variant="danger" value={fmt(totalCr)} label="Total Payments (Cr)" />
        <DataCard variant={closingBalance >= 0 ? "success" : "danger"} value={fmt(closingBalance)} label="Closing Balance" />
        <DataCard variant="accent" value={String(filtered.length)} label="Transactions" />
      </DataCardGrid>
      <DataTable columns={columns} data={filtered} pageSize={25} sortable searchable striped hoverable dense exportable exportFilename="cash-book.csv" emptyMessage="No transactions" />
      <div className="page-card__footer">
        <span className="fw-semibold">Total</span>
        <div className="d-flex gap-4">
          <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(totalDr)}</span>
          <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(totalCr)}</span>
          <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(closingBalance)}</span>
        </div>
      </div>
    </div>
  );
};

export default CashBankReport;
