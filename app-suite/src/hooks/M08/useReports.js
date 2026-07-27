import { useEffect, useState, useCallback } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { coaAPI } from "@/api/M08/coaAPI.js";
import { journalAPI } from "@/api/M08/journalAPI.js";
import { fsyarAPI } from "@/api/M08/fsyarAPI.js";
import { acprdAPI } from "@/api/M08/acprdAPI.js";
import { departmentAPI } from "@/api/M01/departmentAPI.js";
import { partyAPI } from "@/api/M08/partyAPI.js";
import { getRelativeDays } from "@/utils/datetime.js";

// Helper: Get opening balance for an account based on nature
const calcBalance = (drTotal, crTotal, ntype) => {
  const balance = ntype === "Dr" ? drTotal - crTotal : crTotal - drTotal;
  return balance;
};

// Helper: Format number for display
const fmt = (val) => {
  const num = Number(val) || 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Helper: Days difference between two dates
const daysDiff = (dateStr) => {
  if (!dateStr) return 0;
  const today = new Date();
  const d = new Date(dateStr.includes("T") ? dateStr.split("T")[0] : dateStr);
  return Math.floor((today - d) / (1000 * 60 * 60 * 24));
};

// Helper: Get aging bucket label
const getAgingBucket = (days) => {
  if (days <= 0) return "Not Due";
  if (days <= 30) return "0-30 Days";
  if (days <= 60) return "31-60 Days";
  if (days <= 90) return "61-90 Days";
  return "90+ Days";
};

const useReports = () => {
  const { showToast } = useUI();

  // Page state
  const [reportCategory, setReportCategory] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Filter state
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [fiscalYearOptions, setFiscalYearOptions] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  // Selector state (for account/party selectors)
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [partyOptions, setPartyOptions] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");

  // Data state
  const [coaData, setCoaData] = useState([]);
  const [journalData, setJournalData] = useState([]);
  const [partyData, setPartyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Load departments for filter
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const resp = await departmentAPI.getAllActive({});
        const list = resp.data || [];
        setDepartmentOptions(list);
        if (list.length > 0) setSelectedDepartment(list[0].id);
      } catch (error) {}
    };
    loadFilters();
  }, []);

  // Load fiscal years when department changes
  useEffect(() => {
    if (!selectedDepartment) return;
    const loadFiscalYears = async () => {
      try {
        const resp = await fsyarAPI.getCurrentByDepartment({
          fsyar_dpart: selectedDepartment,
        });
        const list = resp.data || [];
        setFiscalYearOptions(list);
        if (list.length > 0) setSelectedFiscalYear(list[0].id);
      } catch (error) {}
    };
    loadFiscalYears();
  }, [selectedDepartment]);

  // Load periods when fiscal year changes
  useEffect(() => {
    if (!selectedFiscalYear) return;
    const loadPeriods = async () => {
      try {
        const resp = await acprdAPI.getCurrentByFy({
          acprd_fsyar: selectedFiscalYear,
        });
        const list = resp.data || [];
        setPeriodOptions(list);
        if (list.length > 0) setSelectedPeriod(list[list.length - 1].id);
      } catch (error) {}
    };
    loadPeriods();
  }, [selectedFiscalYear]);

  // Load COA hierarchy
  const loadCoaData = useCallback(async () => {
    try {
      const resp = await coaAPI.getAll({});
      const list = resp.data || [];
      setCoaData(list);

      // Build account options for selectors
      const leafAccounts = list.filter((a) => a.chtac_child && a.chtac_actve);
      setAccountOptions(
        leafAccounts.map((a) => ({ id: a.id, name: a.chtac_cname }))
      );
      return list;
    } catch (error) {
      return [];
    }
  }, []);

  // Load journal data
  const loadJournalData = useCallback(async () => {
    try {
      const resp = await journalAPI.getAll({});
      const list = resp.data || [];
      setJournalData(list);
      return list;
    } catch (error) {
      return [];
    }
  }, []);

  // Load party data
  const loadPartyData = useCallback(async () => {
    try {
      const resp = await partyAPI.getAll({});
      const list = resp.data || [];
      setPartyData(list);
      // Build party options for selectors
      setPartyOptions(
        list.map((p) => ({ id: p.id, name: p.party_cname, type: p.party_ptype }))
      );
      return list;
    } catch (error) {
      return [];
    }
  }, []);

  // Get journal lines for a specific journal entry
  const getJournalLinesForEntry = useCallback(async (journalId) => {
    try {
      const resp = await journalAPI.getChild({ jrnlc_jrnlm: journalId });
      return resp.data || [];
    } catch (error) {
      return [];
    }
  }, []);

  // Load all journal lines for all entries (parallelized)
  const loadAllJournalLines = useCallback(async (journals) => {
    const postedJournals = journals.filter(
      (j) => j.jrnlm_actve && j.jrnlm_stats === "Posted"
    );
    const linesArrays = await Promise.all(
      postedJournals.map((j) => getJournalLinesForEntry(j.id))
    );
    const allLines = linesArrays.flatMap((lines, idx) =>
      lines.map((line) => ({
        ...line,
        jrnlm_trdat: postedJournals[idx].jrnlm_trdat,
        jrnlm_trnno: postedJournals[idx].jrnlm_trnno,
        jrnlm_trtyp: postedJournals[idx].jrnlm_trtyp,
        jrnlm_narrt: postedJournals[idx].jrnlm_narrt,
        jrnlm_refno: postedJournals[idx].jrnlm_refno,
      }))
    );
    return allLines;
  }, [getJournalLinesForEntry]);

  // ─── Main Refresh ─────────────────────────────────

  // Pure calculation functions that accept data as parameters (no state closure dependency)
  const computeReports = useCallback((lines, journals, coa, parties) => {
    // Get account balance using passed coa data
    const getBal = (accountId) => {
      const accountLines = lines.filter((l) => l.jrnlc_chtac === accountId);
      const dr = accountLines.reduce((s, l) => s + (Number(l.jrnlc_drval) || 0), 0);
      const cr = accountLines.reduce((s, l) => s + (Number(l.jrnlc_crval) || 0), 0);
      const acct = coa.find((a) => a.id === accountId);
      return calcBalance(dr, cr, acct?.chtac_ntype || "Dr");
    };

    // Financial Statements
    const incAccts = coa.filter((a) => a.chtac_ctype === "Income" && a.chtac_child && a.chtac_actve);
    const expAccts = coa.filter((a) => a.chtac_ctype === "Expenses" && a.chtac_child && a.chtac_actve);
    const incomeItems = incAccts.map((a) => ({ id: a.id, name: a.chtac_cname, chartNo: a.chtac_chtno, balance: getBal(a.id), ntype: a.chtac_ntype }));
    const expenseItems = expAccts.map((a) => ({ id: a.id, name: a.chtac_cname, chartNo: a.chtac_chtno, balance: getBal(a.id), ntype: a.chtac_ntype }));
    const totalIncome = incomeItems.reduce((s, i) => s + Math.abs(i.balance), 0);
    const totalExpenses = expenseItems.reduce((s, i) => s + Math.abs(i.balance), 0);
    const netProfit = totalIncome - totalExpenses;
    const pnl = { incomeItems: incomeItems.filter((i) => i.balance !== 0), expenseItems: expenseItems.filter((i) => i.balance !== 0), totalIncome, totalExpenses, netProfit };

    // Trial Balance
    const leafAccts = coa.filter((a) => a.chtac_child && a.chtac_actve);
    const tbItems = leafAccts.map((a) => {
      const bal = getBal(a.id);
      return {
        id: a.id, chartNo: a.chtac_chtno, name: a.chtac_cname, type: a.chtac_ctype, ntype: a.chtac_ntype, balance: bal,
        drVal: a.chtac_ntype === "Dr" ? (bal >= 0 ? bal : 0) : (bal < 0 ? Math.abs(bal) : 0),
        crVal: a.chtac_ntype === "Cr" ? (bal >= 0 ? bal : 0) : (bal < 0 ? Math.abs(bal) : 0),
      };
    });
    const tb = { items: tbItems.filter((i) => i.drVal !== 0 || i.crVal !== 0), totalDr: tbItems.reduce((s, i) => s + i.drVal, 0), totalCr: tbItems.reduce((s, i) => s + i.crVal, 0) };

    // Balance Sheet
    const makeItems = (type) => coa.filter((a) => a.chtac_ctype === type && a.chtac_child && a.chtac_actve).map((a) => ({ id: a.id, name: a.chtac_cname, chartNo: a.chtac_chtno, balance: Math.abs(getBal(a.id)), ntype: a.chtac_ntype }));
    const assetItems = makeItems("Assets").filter((i) => i.balance !== 0);
    const liabilityItems = makeItems("Liabilities").filter((i) => i.balance !== 0);
    const equityItems = makeItems("Equity").filter((i) => i.balance !== 0);
    const bs = {
      assetItems, liabilityItems, equityItems,
      totalAssets: assetItems.reduce((s, i) => s + i.balance, 0),
      totalLiabilities: liabilityItems.reduce((s, i) => s + i.balance, 0),
      totalEquity: equityItems.reduce((s, i) => s + i.balance, 0) + netProfit,
      netProfit,
    };

    // Cash Flow
    const cashAccts = coa.filter((a) => a.chtac_ispst && a.chtac_actve && (a.chtac_cname?.toLowerCase().includes("cash") || a.chtac_cname?.toLowerCase().includes("bank")));
    const closingCash = cashAccts.reduce((s, a) => s + Math.abs(getBal(a.id)), 0);
    const incomeLines = lines.filter((l) => { const ac = coa.find((a2) => a2.id === l.jrnlc_chtac); return ac?.chtac_ctype === "Income"; });
    const expenseLines = lines.filter((l) => { const ac = coa.find((a2) => a2.id === l.jrnlc_chtac); return ac?.chtac_ctype === "Expenses"; });
    const opFlow = incomeLines.reduce((s, l) => s + Number(l.jrnlc_crval || 0), 0) - expenseLines.reduce((s, l) => s + Number(l.jrnlc_drval || 0), 0);
    const cf = {
      openingBalance: 0, closingBalance: closingCash, operatingFlow: opFlow, investingFlow: 0, financingFlow: 0, netCashFlow: opFlow,
      cashAccounts: cashAccts.map((a) => ({ id: a.id, name: a.chtac_cname, balance: Math.abs(getBal(a.id)) })),
    };

    // General Ledger
    const glAccts = coa.filter((a) => a.chtac_child && a.chtac_actve).map((account) => {
      const acctLines = lines.filter((l) => l.jrnlc_chtac === account.id).sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));
      let rb = 0;
      const txns = acctLines.map((line) => {
        const dr = Number(line.jrnlc_drval) || 0, cr = Number(line.jrnlc_crval) || 0;
        rb += account.chtac_ntype === "Dr" ? dr - cr : cr - dr;
        return { id: line.id, date: line.jrnlm_trdat, trnNo: line.jrnlm_trnno, trnType: line.jrnlm_trtyp, narration: line.jrnlm_narrt || line.jrnlc_descr || "", refNo: line.jrnlm_refno, debit: dr, credit: cr, runningBalance: rb, partyId: line.jrnlc_party };
      });
      return { accountId: account.id, accountName: account.chtac_cname, chartNo: account.chtac_chtno, accountType: account.chtac_ctype, transactions: txns };
    });
    const gl = { accounts: glAccts.filter((g) => g.transactions.length > 0) };

    // Journal Register
    const postedJ = journals.filter((j) => j.jrnlm_actve && j.jrnlm_stats === "Posted").sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));
    const jrEntries = postedJ.map((journal) => ({
      id: journal.id, date: journal.jrnlm_trdat, trnNo: journal.jrnlm_trnno, trnType: journal.jrnlm_trtyp,
      narration: journal.jrnlm_narrt, refNo: journal.jrnlm_refno, totalDr: journal.jrnlm_drval, totalCr: journal.jrnlm_crval,
      lines: lines.filter((l) => l.jrnlc_jrnlm === journal.id).map((l) => ({
        accountId: l.jrnlc_chtac, accountName: coa.find((a) => a.id === l.jrnlc_chtac)?.chtac_cname || "Unknown",
        debit: Number(l.jrnlc_drval) || 0, credit: Number(l.jrnlc_crval) || 0, description: l.jrnlc_descr || "", partyId: l.jrnlc_party,
      })),
    }));
    const jr = { entries: jrEntries };

    // Account Ledger & Sub Ledger (with selector values)
    const al = selectedAccount && coa.find((a) => a.id === selectedAccount)
      ? (() => {
          const account = coa.find((a) => a.id === selectedAccount);
          const acctLines = lines.filter((l) => l.jrnlc_chtac === selectedAccount).sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));
          let rb = 0;
          const txns = acctLines.map((line) => {
            const dr = Number(line.jrnlc_drval) || 0, cr = Number(line.jrnlc_crval) || 0;
            rb += account.chtac_ntype === "Dr" ? dr - cr : cr - dr;
            return {
              id: line.id, date: getRelativeDays(line.jrnlm_trdat), trnNo: line.jrnlm_trnno || "", trnType: line.jrnlm_trtyp || "",
              narration: line.jrnlm_narrt || line.jrnlc_descr || "", refNo: line.jrnlm_refno || "", debit: dr, credit: cr, runningBalance: rb,
              party: line.jrnlc_party ? (parties.find((p) => p.id === line.jrnlc_party)?.party_cname || "—") : "—",
            };
          });
          return { account: { id: account.id, name: account.chtac_cname, chartNo: account.chtac_chtno, type: account.chtac_ctype, ntype: account.chtac_ntype }, transactions: txns, totalDr: txns.reduce((s, t) => s + t.debit, 0), totalCr: txns.reduce((s, t) => s + t.credit, 0), closingBalance: rb };
        })()
      : null;

    const sl = selectedParty && parties.find((p) => p.id === selectedParty)
      ? (() => {
          const party = parties.find((p) => p.id === selectedParty);
          const partyLines = lines.filter((l) => l.jrnlc_party === selectedParty).sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));
          const txns = partyLines.map((line) => {
            const acct = coa.find((a) => a.id === line.jrnlc_chtac);
            return { id: line.id, date: getRelativeDays(line.jrnlm_trdat), trnNo: line.jrnlm_trnno || "", trnType: line.jrnlm_trtyp || "", accountName: acct?.chtac_cname || "Unknown", description: line.jrnlc_descr || line.jrnlm_narrt || "", debit: Number(line.jrnlc_drval) || 0, credit: Number(line.jrnlc_crval) || 0 };
          });
          return { party: { id: party.id, name: party.party_cname, type: party.party_ptype }, transactions: txns, totalDr: txns.reduce((s, t) => s + t.debit, 0), totalCr: txns.reduce((s, t) => s + t.credit, 0), balance: txns.reduce((s, t) => s + t.debit, 0) - txns.reduce((s, t) => s + t.credit, 0) };
        })()
      : null;

    // AR Aging
    const customers = parties.filter((p) => p.party_ptype === "Customer");
    const arAccountIds = coa.filter((a) => a.chtac_cname?.toLowerCase().includes("receivable") && a.chtac_child && a.chtac_actve).map((a) => a.id);
    const arItems = customers.map((c) => {
      const cLines = lines.filter((l) => l.jrnlc_party === c.id && arAccountIds.includes(l.jrnlc_chtac));
      const bal = cLines.reduce((s, l) => s + (Number(l.jrnlc_drval) || 0), 0) - cLines.reduce((s, l) => s + (Number(l.jrnlc_crval) || 0), 0);
      const dates = cLines.map((l) => l.jrnlm_trdat).filter(Boolean).sort().reverse();
      const dd = dates[0] ? daysDiff(dates[0]) : 0;
      return { id: c.id, name: c.party_cname, balance: Math.abs(bal), lastTransaction: dates[0] || null, daysOverdue: dd, bucket: getAgingBucket(dd), openingBalance: Number(c.party_opbal) || 0 };
    }).filter((c) => c.balance > 0).sort((a, b) => b.daysOverdue - a.daysOverdue);
    const arBuckets = { "Not Due": 0, "0-30 Days": 0, "31-60 Days": 0, "61-90 Days": 0, "90+ Days": 0 };
    arItems.forEach((c) => { arBuckets[c.bucket] += c.balance; });
    const ar = { items: arItems, totalAR: arItems.reduce((s, c) => s + c.balance, 0), buckets: arBuckets };

    // AP Aging
    const suppliers = parties.filter((p) => p.party_ptype === "Supplier");
    const apAccountIds = coa.filter((a) => a.chtac_cname?.toLowerCase().includes("payable") && a.chtac_child && a.chtac_actve).map((a) => a.id);
    const apItems = suppliers.map((s) => {
      const sLines = lines.filter((l) => l.jrnlc_party === s.id && apAccountIds.includes(l.jrnlc_chtac));
      const bal = sLines.reduce((sum, l) => sum + (Number(l.jrnlc_crval) || 0), 0) - sLines.reduce((sum, l) => sum + (Number(l.jrnlc_drval) || 0), 0);
      const dates = sLines.map((l) => l.jrnlm_trdat).filter(Boolean).sort().reverse();
      const dd = dates[0] ? daysDiff(dates[0]) : 0;
      return { id: s.id, name: s.party_cname, balance: Math.abs(bal), lastTransaction: dates[0] || null, daysOverdue: dd, bucket: getAgingBucket(dd) };
    }).filter((s) => s.balance > 0).sort((a, b) => b.daysOverdue - a.daysOverdue);
    const apBuckets = { "Not Due": 0, "0-30 Days": 0, "31-60 Days": 0, "61-90 Days": 0, "90+ Days": 0 };
    apItems.forEach((s) => { apBuckets[s.bucket] += s.balance; });
    const ap = { items: apItems, totalAP: apItems.reduce((s, c) => s + c.balance, 0), buckets: apBuckets };

    // Outstanding
    const osParties = parties.filter((p) => p.party_ptype === "Customer" || p.party_ptype === "Supplier");
    const osItems = osParties.map((p) => {
      const pLines = lines.filter((l) => l.jrnlc_party === p.id);
      const bal = pLines.reduce((s, l) => s + (Number(l.jrnlc_drval) || 0), 0) - pLines.reduce((s, l) => s + (Number(l.jrnlc_crval) || 0), 0);
      const acctNames = [...new Set(pLines.map((l) => coa.find((a) => a.id === l.jrnlc_chtac)?.chtac_cname || "Unknown"))];
      return { id: p.id, name: p.party_cname, type: p.party_ptype, balance: Math.abs(bal), balanceType: bal >= 0 ? "Dr" : "Cr", accountNames: acctNames.slice(0, 3).join(", "), transactionCount: pLines.length };
    }).filter((i) => i.balance > 0).sort((a, b) => b.balance - a.balance);
    const osDr = osItems.filter((i) => i.balanceType === "Dr").reduce((s, i) => s + i.balance, 0);
    const osCr = osItems.filter((i) => i.balanceType === "Cr").reduce((s, i) => s + i.balance, 0);
    const os = { items: osItems, totalOutstandingDr: osDr, totalOutstandingCr: osCr, totalOutstanding: osDr + osCr };

    // Bank Reconciliation
    const bankAccts = coa.filter((a) => a.chtac_child && a.chtac_actve && (a.chtac_cname?.toLowerCase().includes("bank") || a.chtac_cname?.toLowerCase().includes("cash")));
    const brAccounts = bankAccts.map((acct) => {
      const acctLines = lines.filter((l) => l.jrnlc_chtac === acct.id);
      const tDr = acctLines.reduce((s, l) => s + (Number(l.jrnlc_drval) || 0), 0);
      const tCr = acctLines.reduce((s, l) => s + (Number(l.jrnlc_crval) || 0), 0);
      const bb = acct.chtac_ntype === "Dr" ? tDr - tCr : tCr - tDr;
      const sorted = [...acctLines].sort((a, b) => new Date(b.jrnlm_trdat) - new Date(a.jrnlm_trdat));
      return { accountId: acct.id, accountName: acct.chtac_cname, chartNo: acct.chtac_chtno, totalDr: tDr, totalCr: tCr, bookBalance: bb, transactionCount: acctLines.length, lastTransaction: sorted[0]?.jrnlm_trdat || null };
    }).filter((a) => a.transactionCount > 0);
    const br = { accounts: brAccounts };

    // Cash Book
    const cbAccountIds = bankAccts.map((a) => a.id);
    const cbTxns = lines.filter((l) => cbAccountIds.includes(l.jrnlc_chtac)).sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));
    let cbrb = 0;
    const cbItems = cbTxns.map((line) => {
      const acct = bankAccts.find((a) => a.id === line.jrnlc_chtac);
      const dr = Number(line.jrnlc_drval) || 0, cr = Number(line.jrnlc_crval) || 0;
      cbrb += (acct?.chtac_ntype === "Dr" ? dr - cr : cr - dr);
      return { id: line.id, date: getRelativeDays(line.jrnlm_trdat), accountName: acct?.chtac_cname || "Unknown", trnType: line.jrnlm_trtyp || "", trnNo: line.jrnlm_trnno || "", narration: line.jrnlm_narrt || line.jrnlc_descr || "", debit: dr, credit: cr, runningBalance: cbrb };
    });
    const cbTotalDr = cbItems.reduce((s, i) => s + i.debit, 0);
    const cbTotalCr = cbItems.reduce((s, i) => s + i.credit, 0);
    const cb = { items: cbItems, totalDr: cbTotalDr, totalCr: cbTotalCr, closingBalance: cbrb, accounts: bankAccts.map((a) => ({ id: a.id, name: a.chtac_cname })) };

    return { pnl, trialBalance: tb, balanceSheet: bs, cashFlow: cf, generalLedger: gl, journalRegister: jr, accountLedger: al, subLedger: sl, arAging: ar, apAging: ap, outstanding: os, bankReconciliation: br, cashBook: cb };
  }, [selectedAccount, selectedParty]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const coa = await loadCoaData();
      const journals = await loadJournalData();
      const parties = await loadPartyData();
      const allLines = await loadAllJournalLines(journals);

      // Compute all reports with fresh data — no stale closures
      const reports = computeReports(allLines, journals, coa, parties);

      setReportData({
        ...reports,
        lineCount: allLines.length, journalCount: journals.length, partyCount: parties.length,
      });
    } catch (error) {
      showToast("Failed to load report data", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [
    loadCoaData, loadJournalData, loadPartyData, loadAllJournalLines,
    computeReports, showToast,
  ]);

  // Auto-refresh when filters are ready
  useEffect(() => {
    if (selectedPeriod) handleRefresh();
  }, [selectedPeriod]);

  return {
    // Navigation
    reportCategory, setReportCategory,
    activeTab, setActiveTab,

    // Filters
    selectedDepartment, setSelectedDepartment,
    selectedFiscalYear, setSelectedFiscalYear,
    selectedPeriod, setSelectedPeriod,
    departmentOptions, fiscalYearOptions, periodOptions,

    // Selectors
    selectedAccount, setSelectedAccount,
    selectedParty, setSelectedParty,
    accountOptions, partyOptions,

    // Data
    reportData, isLoading,
    coaData, journalData, partyData,

    // Actions
    handleRefresh,

    // Utilities
    fmt,
  };
};

export default useReports;
