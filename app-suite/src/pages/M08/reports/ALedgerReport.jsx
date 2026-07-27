import { IconFile, IconSearch } from "@/icons";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const ALedgerReport = ({ data, isLoading, fmt, accountOptions, selectedAccount, onAccountChange }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading account ledger..." />;

  return (
    <div>
      <div className="mb-3">
        <Dropdown label="Select Account" options={accountOptions} value={selectedAccount}
          onChange={(e) => onAccountChange(e.target.value)} optionValue="id" optionLabel="name" placeholder="Choose an account..." />
      </div>

      {!selectedAccount ? (
        <EmptyState icon={<IconSearch size={32} />} title="Select Account" message="Select an account to view its ledger." />
      ) : !data ? (
        <EmptyState icon={<IconFile size={32} />} title="No Data" message="No transactions found for this account." />
      ) : (
        <>
          <DataCardGrid cols={4} gap={8} style={{ marginBottom: 16 }}>
            <DataCard variant="accent" value={data.account.name} label="Account" />
            <DataCard variant="accent" value={data.account.chartNo} label="Chart No" />
            <DataCard variant="accent" value={`${data.account.type} (${data.account.ntype})`} label="Type" />
            <DataCard variant={data.closingBalance >= 0 ? "success" : "danger"} value={fmt(data.closingBalance)} label="Closing Balance" />
          </DataCardGrid>

          <DataTable columns={[
            { key: "date", header: "Date", width: "100px" },
            { key: "trnType", header: "Type", width: "80px" },
            { key: "trnNo", header: "Trn No", width: "80px" },
            { key: "narration", header: "Narration", width: "200px" },
            { key: "party", header: "Party", width: "140px" },
            { key: "debit", header: "Debit", width: "120px", align: "right", render: (v) => v > 0 ? fmt(v) : "—" },
            { key: "credit", header: "Credit", width: "120px", align: "right", render: (v) => v > 0 ? fmt(v) : "—" },
            { key: "runningBalance", header: "Balance", width: "140px", align: "right", render: (v) => <span className="fw-semibold">{fmt(v)}</span> },
          ]} data={data.transactions} pageSize={25} sortable searchable striped hoverable dense emptyMessage="No transactions" />

          <div className="page-card__footer">
            <span className="fw-semibold">Total</span>
            <div className="d-flex gap-4">
              <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(data.totalDr)}</span>
              <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(data.totalCr)}</span>
              <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(data.closingBalance)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ALedgerReport;
