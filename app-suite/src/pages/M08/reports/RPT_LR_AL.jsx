import { useEffect, useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import { DataCard, DataCardGrid } from "@/components/DataCard";
import EmptyState from "@/components/EmptyState";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_LR_AL = ({ listData, onRegisterExport }) => {
  // Build account options from data (accounts present in journal lines)
  const accountOptions = useMemo(() => {
    const map = {};
    listData.forEach((row) => {
      const key = row.jrnlc_chtac;
      if (!map[key]) {
        map[key] = {
          id: key,
          name: `${row.chtac_cname} (${row.chtac_chtno})`,
          cname: row.chtac_cname,
          chartNo: row.chtac_chtno,
          ctype: row.chtac_ctype,
          ntype: row.chtac_ntype,
        };
      }
    });
    return Object.values(map);
  }, [listData]);

  const [selectedAccount, setSelectedAccount] = useState("");
  const account = accountOptions.find((a) => a.id === selectedAccount);

  // Transactions for the selected account
  const { transactions, totalDr, totalCr, closingBalance } = useMemo(() => {
    if (!selectedAccount) {
      return { transactions: [], totalDr: 0, totalCr: 0, closingBalance: 0 };
    }
    const lines = listData
      .filter((r) => r.jrnlc_chtac === selectedAccount)
      .sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));

    // Debit/credit nature comes from chtac_ntype (fallback to ctype heuristics)
    const drNature = account?.ntype
      ? account.ntype === "Dr"
      : account?.ctype === "Assets" || account?.ctype === "Expenses";
    let running = 0;
    const txns = lines.map((line, i) => {
      const dr = Number(line.jrnlc_drval) || 0;
      const cr = Number(line.jrnlc_crval) || 0;
      running += drNature ? dr - cr : cr - dr;
      return {
        id: line.id || `${selectedAccount}-${i}`,
        date: (line.jrnlm_trdat || "").split("T")[0],
        trnType: line.jrnlm_trtyp || "",
        trnNo: line.jrnlm_refno || "",
        narration: line.jrnlm_narrt || line.jrnlc_descr || "",
        party: line.party_cname || "—",
        debit: dr,
        credit: cr,
        runningBalance: running,
      };
    });
    return {
      transactions: txns,
      totalDr: txns.reduce((s, t) => s + t.debit, 0),
      totalCr: txns.reduce((s, t) => s + t.credit, 0),
      closingBalance: running,
    };
  }, [listData, selectedAccount, account?.ctype]);

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
      narration: t.narration,
      party: t.party,
      debit: t.debit,
      credit: t.credit,
      balance: t.runningBalance,
    }));
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["date", "trnNo", "type", "narration", "party", "debit", "credit", "balance"],
          ["Date", "Trn No", "Type", "Narration", "Party", "Debit", "Credit", "Balance"],
        ),
        "account-ledger.csv",
      ),
    );
  }, [onRegisterExport, transactions]);

  const columns = [
    { key: "date", header: "Date", width: "100px" },
    { key: "trnType", header: "Type", width: "110px" },
    { key: "trnNo", header: "Trn No", width: "130px" },
    { key: "narration", header: "Narration", width: "200px" },
    { key: "party", header: "Party", width: "140px" },
    {
      key: "debit",
      header: "Debit",
      width: "120px",
      align: "right",
      body: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "credit",
      header: "Credit",
      width: "120px",
      align: "right",
      body: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "runningBalance",
      header: "Balance",
      width: "140px",
      align: "right",
      body: (v) => <span className="fw-semibold">{formatNumber(v)}</span>,
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <Dropdown
          label="Select Account"
          options={accountOptions}
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          optionValue="id"
          optionLabel="name"
          placeholder="Choose an account..."
        />
      </div>

      {!selectedAccount ? (
        <EmptyState
          title="Select Account"
          message="Select an account to view its ledger."
        />
      ) : (
        <>
          <DataCardGrid cols={4} gap={8} style={{ marginBottom: 16 }}>
            <DataCard variant="accent" value={account?.cname} label="Account" />
            <DataCard variant="accent" value={account?.chartNo} label="Chart No" />
            <DataCard
              variant="accent"
              value={account ? `${account.ctype} (${account.ntype || "—"})` : ""}
              label="Type"
            />
            <DataCard
              variant={closingBalance >= 0 ? "success" : "danger"}
              value={formatNumber(closingBalance)}
              label="Closing Balance"
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

          <ReportFooter label="Total" values={[totalDr, totalCr, closingBalance]} />
        </>
      )}
    </div>
  );
};

export default RPT_LR_AL;
