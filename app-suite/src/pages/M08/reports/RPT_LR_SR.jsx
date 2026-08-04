import { useEffect, useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import { DataCard, DataCardGrid } from "@/components/DataCard";
import ReportEmpty from "./ReportEmpty";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_LR_SR = ({ listData, onRegisterExport }) => {
  // Build party options from data (parties present in journal lines)
  const partyOptions = useMemo(() => {
    const map = {};
    listData.forEach((row) => {
      const key = row.jrnlc_party;
      if (!key) return;
      if (!map[key]) {
        map[key] = {
          id: key,
          name: row.party_cname,
          ptype: row.party_ptype,
        };
      }
    });
    return Object.values(map);
  }, [listData]);

  const [selectedParty, setSelectedParty] = useState("");
  const party = partyOptions.find((p) => p.id === selectedParty);

  // Transactions for the selected party
  const { transactions, totalDr, totalCr, balance, ntypes } = useMemo(() => {
    if (!selectedParty) {
      return { transactions: [], totalDr: 0, totalCr: 0, balance: 0, ntypes: [] };
    }
    const lines = listData
      .filter((r) => r.jrnlc_party === selectedParty)
      .sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));

    const txns = lines.map((line, i) => ({
      id: line.id || `${selectedParty}-${i}`,
      date: (line.jrnlm_trdat || "").split("T")[0],
      trnType: line.jrnlm_trtyp || "",
      trnNo: line.jrnlm_refno || "",
      accountName: line.chtac_cname || "Unknown",
      description: line.jrnlc_descr || line.jrnlm_narrt || "",
      debit: Number(line.jrnlc_drval) || 0,
      credit: Number(line.jrnlc_crval) || 0,
    }));
    const dr = txns.reduce((s, t) => s + t.debit, 0);
    const cr = txns.reduce((s, t) => s + t.credit, 0);
    return {
      transactions: txns,
      totalDr: dr,
      totalCr: cr,
      balance: dr - cr,
      ntypes: [...new Set(lines.map((l) => l.chtac_ntype).filter(Boolean))],
    };
  }, [listData, selectedParty]);

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!transactions.length) {
      onRegisterExport(null);
      return;
    }
    const rows = transactions.map((t) => ({
      date: t.date,
      trnNo: t.trnNo,
      type: t.trnType,
      account: t.accountName,
      description: t.description,
      debit: t.debit,
      credit: t.credit,
    }));
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["date", "trnNo", "type", "account", "description", "debit", "credit"],
          ["Date", "Trn No", "Type", "Account", "Description", "Debit", "Credit"],
        ),
        "sub-ledger.csv",
      ),
    );
  }, [onRegisterExport, transactions]);

  const columns = [
    { key: "date", header: "Date", width: "100px" },
    { key: "trnType", header: "Type", width: "110px" },
    { key: "trnNo", header: "Trn No", width: "130px" },
    { key: "accountName", header: "Account", width: "180px" },
    { key: "description", header: "Description", width: "200px" },
    {
      key: "debit",
      header: "Debit",
      width: "120px",
      align: "right",
      render: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "credit",
      header: "Credit",
      width: "120px",
      align: "right",
      render: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <Dropdown
          label="Select Party"
          options={partyOptions}
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          optionValue="id"
          optionLabel="name"
          placeholder="Choose a party..."
        />
      </div>

      {!selectedParty ? (
        <ReportEmpty
          title="Select Party"
          message="Select a party to view their sub-ledger."
        />
      ) : (
        <>
          <DataCardGrid cols={3} gap={8} style={{ marginBottom: 16 }}>
            <DataCard variant="accent" value={party?.name} label="Party Name" />
            <DataCard
              variant="accent"
              value={party ? `${party.ptype} (${ntypes.join(", ") || "—"})` : ""}
              label="Type"
            />
            <DataCard
              variant={balance >= 0 ? "success" : "danger"}
              value={`${formatNumber(Math.abs(balance))} ${
                balance >= 0 ? "Dr" : "Cr"
              }`}
              label="Net Balance"
            />
          </DataCardGrid>

          <DataTable
            columns={columns}
            data={transactions}
            pageSize={25}
            sortable
            searchable
            striped
            hoverable
            dense
          />

          <ReportFooter label="Total" values={[totalDr, totalCr]} />
        </>
      )}
    </div>
  );
};

export default RPT_LR_SR;
