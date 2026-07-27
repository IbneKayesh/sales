import { IconFile, IconSearch } from "@/icons";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const SLedgerReport = ({ data, isLoading, fmt, partyOptions, selectedParty, onPartyChange }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading sub-ledger..." />;

  return (
    <div>
      <div className="mb-3">
        <Dropdown label="Select Party" options={partyOptions} value={selectedParty}
          onChange={(e) => onPartyChange(e.target.value)} optionValue="id" optionLabel="name" placeholder="Choose a party..." />
      </div>

      {!selectedParty ? (
        <EmptyState icon={<IconSearch size={32} />} title="Select Party" message="Select a party to view their sub-ledger." />
      ) : !data ? (
        <EmptyState icon={<IconFile size={32} />} title="No Data" message="No transactions found for this party." />
      ) : (
        <>
          <DataCardGrid cols={3} gap={8} style={{ marginBottom: 16 }}>
            <DataCard variant="accent" value={data.party.name} label="Party Name" />
            <DataCard variant="accent" value={data.party.type} label="Type" />
            <DataCard variant={data.balance >= 0 ? "success" : "danger"} value={`${fmt(Math.abs(data.balance))} ${data.balance >= 0 ? "Dr" : "Cr"}`} label="Net Balance" />
          </DataCardGrid>

          <DataTable columns={[
            { key: "date", header: "Date", width: "100px" },
            { key: "trnType", header: "Type", width: "80px" },
            { key: "trnNo", header: "Trn No", width: "80px" },
            { key: "accountName", header: "Account", width: "180px" },
            { key: "description", header: "Description", width: "200px" },
            { key: "debit", header: "Debit", width: "120px", align: "right", render: (v) => v > 0 ? fmt(v) : "—" },
            { key: "credit", header: "Credit", width: "120px", align: "right", render: (v) => v > 0 ? fmt(v) : "—" },
          ]} data={data.transactions} pageSize={25} sortable searchable striped hoverable dense emptyMessage="No transactions" />

          <div className="page-card__footer">
            <span className="fw-semibold">Total</span>
            <div className="d-flex gap-4">
              <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(data.totalDr)}</span>
              <span className="fw-bold" style={{ minWidth: "120px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(data.totalCr)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SLedgerReport;
