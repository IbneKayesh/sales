import { useMemo, useCallback } from "react";
import GroupButton from "@/components/GroupButton";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import {
  IconRefresh,
  IconSearch,
  IconChart,
  IconPieChart,
  IconActivity,
  IconDollar,
  IconFile,
  IconUsers,
  IconReceipt,
} from "@/icons";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import TabPage from "@/components/TabPage";
import ReportExportBar from "@/components/ReportExportBar";
import { exportToCSV, printReport, buildColumns } from "@/utils/export";
import useReports from "@/hooks/M08/useReports";

// Financial Statements
import PnLReport from "./PnLReport";
import BalanceSheetReport from "./BalanceSheetReport";
import TrialBalanceReport from "./TrialBalanceReport";
import CashFlowReport from "./CashFlowReport";

// Ledger Reports
import GLedgerReport from "./GLedgerReport";
import JRegisterReport from "./JRegisterReport";
import ALedgerReport from "./ALedgerReport";
import SLedgerReport from "./SLedgerReport";

// Receivable & Payable
import ARReport from "./ARReport";
import APReport from "./APReport";
import OutStandReport from "./OutStandReport";

// Banking & Cash
import BankRecReport from "./BankRecReport";
import CashBankReport from "./CashBankReport";

const categoryIcons = {
  0: <IconChart size={16} />,
  1: <IconFile size={16} />,
  2: <IconUsers size={16} />,
  3: <IconDollar size={16} />,
};

const categoryLabels = [
  "Financial Statements",
  "Ledger Reports",
  "Receivable & Payable",
  "Banking & Cash",
];

const Fstatements_bk = () => {
  const {
    reportCategory,
    setReportCategory,
    activeTab,
    setActiveTab,
    selectedDepartment,
    setSelectedDepartment,
    selectedFiscalYear,
    setSelectedFiscalYear,
    selectedPeriod,
    setSelectedPeriod,
    departmentOptions,
    fiscalYearOptions,
    periodOptions,
    selectedAccount,
    setSelectedAccount,
    selectedParty,
    setSelectedParty,
    accountOptions,
    partyOptions,
    reportData,
    isLoading,
    handleRefresh,
    fmt,
  } = useReports();

  // ── Export Handlers ──────────────────────────────────────

  const exportPnL = useCallback(() => {
    const d = reportData?.pnl;
    if (!d) return;
    const rows = [
      ...d.incomeItems.map((i) => ({
        account: i.name,
        chartNo: i.chartNo,
        type: "Income",
        amount: Math.abs(i.balance),
      })),
      ...d.expenseItems.map((i) => ({
        account: i.name,
        chartNo: i.chartNo,
        type: "Expense",
        amount: Math.abs(i.balance),
      })),
    ];
    rows.push({
      account: "Net Profit/Loss",
      chartNo: "",
      type: "",
      amount: d.netProfit,
    });
    exportToCSV(
      rows,
      buildColumns(
        ["account", "chartNo", "type", "amount"],
        ["Account", "Chart No", "Type", "Amount"],
      ),
      "profit-and-loss.csv",
    );
  }, [reportData]);

  const printPnL = useCallback(
    () => printReport("Profit & Loss Statement"),
    [],
  );

  const exportBalanceSheet = useCallback(() => {
    const d = reportData?.balanceSheet;
    if (!d) return;
    const rows = [
      ...d.assetItems.map((i) => ({
        section: "Assets",
        account: i.name,
        amount: i.balance,
      })),
      { section: "", account: "Total Assets", amount: d.totalAssets },
      ...d.liabilityItems.map((i) => ({
        section: "Liabilities",
        account: i.name,
        amount: i.balance,
      })),
      { section: "", account: "Total Liabilities", amount: d.totalLiabilities },
      ...d.equityItems.map((i) => ({
        section: "Equity",
        account: i.name,
        amount: i.balance,
      })),
      { section: "", account: "Current Year Earnings", amount: d.netProfit },
      {
        section: "",
        account: "Total Liabilities & Equity",
        amount: d.totalLiabilities + d.totalEquity,
      },
    ];
    exportToCSV(
      rows,
      buildColumns(
        ["section", "account", "amount"],
        ["Section", "Account", "Amount"],
      ),
      "balance-sheet.csv",
    );
  }, [reportData]);

  const printBS = useCallback(() => printReport("Balance Sheet"), []);

  const exportTB = useCallback(() => {
    const d = reportData?.trialBalance;
    if (!d) return;
    const rows = d.items.map((i) => ({
      account: i.name,
      chartNo: i.chartNo,
      type: i.type,
      debit: i.drVal,
      credit: i.crVal,
    }));
    rows.push({
      account: "Total",
      chartNo: "",
      type: "",
      debit: d.totalDr,
      credit: d.totalCr,
    });
    exportToCSV(
      rows,
      buildColumns(
        ["account", "chartNo", "type", "debit", "credit"],
        ["Account", "Chart No", "Type", "Debit", "Credit"],
      ),
      "trial-balance.csv",
    );
  }, [reportData]);

  const printTB = useCallback(() => printReport("Trial Balance"), []);

  const exportCashFlow = useCallback(() => {
    const d = reportData?.cashFlow;
    if (!d) return;
    const rows = [
      ...d.cashAccounts.map((a) => ({
        account: a.name,
        type: "Cash Account",
        amount: a.balance,
      })),
      {
        account: "Operating Activities",
        type: "Flow",
        amount: d.operatingFlow,
      },
      {
        account: "Investing Activities",
        type: "Flow",
        amount: d.investingFlow,
      },
      {
        account: "Financing Activities",
        type: "Flow",
        amount: d.financingFlow,
      },
      { account: "Net Cash Flow", type: "Total", amount: d.netCashFlow },
      { account: "Closing Balance", type: "Total", amount: d.closingBalance },
    ];
    exportToCSV(
      rows,
      buildColumns(
        ["account", "type", "amount"],
        ["Account", "Type", "Amount"],
      ),
      "cash-flow.csv",
    );
  }, [reportData]);

  const printCF = useCallback(() => printReport("Cash Flow Statement"), []);

  const exportGL = useCallback(() => {
    const d = reportData?.generalLedger;
    if (!d) return;
    const rows = [];
    d.accounts.forEach((a) => {
      a.transactions.forEach((t) => {
        rows.push({
          account: a.accountName,
          date: t.date,
          trnNo: t.trnNo,
          type: t.trnType,
          narration: t.narration,
          debit: t.debit,
          credit: t.credit,
          balance: t.runningBalance,
        });
      });
    });
    exportToCSV(
      rows,
      buildColumns(
        [
          "account",
          "date",
          "trnNo",
          "type",
          "narration",
          "debit",
          "credit",
          "balance",
        ],
        [
          "Account",
          "Date",
          "Trn No",
          "Type",
          "Narration",
          "Debit",
          "Credit",
          "Balance",
        ],
      ),
      "general-ledger.csv",
    );
  }, [reportData]);

  const printGL = useCallback(() => printReport("General Ledger"), []);

  const exportJR = useCallback(() => {
    const d = reportData?.journalRegister;
    if (!d) return;
    const rows = [];
    d.entries.forEach((e) => {
      e.lines.forEach((l) => {
        rows.push({
          date: e.date,
          trnNo: e.trnNo,
          type: e.trnType,
          narration: e.narration,
          account: l.accountName,
          debit: l.debit,
          credit: l.credit,
        });
      });
    });
    exportToCSV(
      rows,
      buildColumns(
        ["date", "trnNo", "type", "narration", "account", "debit", "credit"],
        ["Date", "Trn No", "Type", "Narration", "Account", "Debit", "Credit"],
      ),
      "journal-register.csv",
    );
  }, [reportData]);

  const printJR = useCallback(() => printReport("Journal Register"), []);

  // ── Build tabs with embedded export bars ────────────────

  const wrapWithExport = (content, onExport, onPrint) => (
    <div className="report-print-area">
      <ReportExportBar
        onPrint={onPrint}
        onExportCSV={onExport}
        isDisabled={isLoading}
        compact
      />
      {content}
    </div>
  );

  const categoryTabs = useMemo(
    () => [
      // Category 0: Financial Statements
      [
        {
          label: "Profit & Loss",
          icon: <IconChart size={15} />,
          content: wrapWithExport(
            <PnLReport
              data={reportData?.pnl}
              isLoading={isLoading}
              fmt={fmt}
            />,
            exportPnL,
            printPnL,
          ),
        },
        {
          label: "Balance Sheet",
          icon: <IconPieChart size={15} />,
          content: wrapWithExport(
            <BalanceSheetReport
              data={reportData?.balanceSheet}
              pnlData={reportData?.pnl}
              isLoading={isLoading}
              fmt={fmt}
            />,
            exportBalanceSheet,
            printBS,
          ),
        },
        {
          label: "Trial Balance",
          icon: <IconActivity size={15} />,
          content: wrapWithExport(
            <TrialBalanceReport
              data={reportData?.trialBalance}
              isLoading={isLoading}
              fmt={fmt}
            />,
            exportTB,
            printTB,
          ),
        },
        {
          label: "Cash Flow",
          icon: <IconDollar size={15} />,
          content: wrapWithExport(
            <CashFlowReport
              data={reportData?.cashFlow}
              isLoading={isLoading}
              fmt={fmt}
            />,
            exportCashFlow,
            printCF,
          ),
        },
      ],
      // Category 1: Ledger Reports
      [
        {
          label: "General Ledger",
          icon: <IconFile size={15} />,
          content: wrapWithExport(
            <GLedgerReport
              data={reportData?.generalLedger}
              isLoading={isLoading}
              fmt={fmt}
            />,
            exportGL,
            printGL,
          ),
        },
        {
          label: "Journal Register",
          icon: <IconReceipt size={15} />,
          content: wrapWithExport(
            <JRegisterReport
              data={reportData?.journalRegister}
              isLoading={isLoading}
              fmt={fmt}
            />,
            exportJR,
            printJR,
          ),
        },
        {
          label: "Account Ledger",
          icon: <IconSearch size={15} />,
          content: wrapWithExport(
            <ALedgerReport
              data={reportData?.accountLedger}
              isLoading={isLoading}
              fmt={fmt}
              accountOptions={accountOptions}
              selectedAccount={selectedAccount}
              onAccountChange={setSelectedAccount}
            />,
            () => {
              const d = reportData?.accountLedger;
              if (!d) return;
              const rows = d.transactions.map((t) => ({
                date: t.date,
                trnNo: t.trnNo,
                type: t.trnType,
                narration: t.narration,
                party: t.party,
                debit: t.debit,
                credit: t.credit,
                balance: t.runningBalance,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  [
                    "date",
                    "trnNo",
                    "type",
                    "narration",
                    "party",
                    "debit",
                    "credit",
                    "balance",
                  ],
                  [
                    "Date",
                    "Trn No",
                    "Type",
                    "Narration",
                    "Party",
                    "Debit",
                    "Credit",
                    "Balance",
                  ],
                ),
                "account-ledger.csv",
              );
            },
            () => printReport("Account Ledger"),
          ),
        },
        {
          label: "Sub-ledgers",
          icon: <IconUsers size={15} />,
          content: wrapWithExport(
            <SLedgerReport
              data={reportData?.subLedger}
              isLoading={isLoading}
              fmt={fmt}
              partyOptions={partyOptions}
              selectedParty={selectedParty}
              onPartyChange={setSelectedParty}
            />,
            () => {
              const d = reportData?.subLedger;
              if (!d) return;
              const rows = d.transactions.map((t) => ({
                date: t.date,
                trnNo: t.trnNo,
                type: t.trnType,
                account: t.accountName,
                description: t.description,
                debit: t.debit,
                credit: t.credit,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  [
                    "date",
                    "trnNo",
                    "type",
                    "account",
                    "description",
                    "debit",
                    "credit",
                  ],
                  [
                    "Date",
                    "Trn No",
                    "Type",
                    "Account",
                    "Description",
                    "Debit",
                    "Credit",
                  ],
                ),
                "sub-ledger.csv",
              );
            },
            () => printReport("Sub-ledger"),
          ),
        },
      ],
      // Category 2: Receivable & Payable
      [
        {
          label: "AR Aging",
          icon: <IconUsers size={15} />,
          content: wrapWithExport(
            <ARReport
              data={reportData?.arAging}
              isLoading={isLoading}
              fmt={fmt}
            />,
            () => {
              const d = reportData?.arAging;
              if (!d) return;
              const rows = d.items.map((i) => ({
                customer: i.name,
                lastTxn: i.lastTransaction?.split("T")[0] || "",
                days: i.daysOverdue,
                bucket: i.bucket,
                balance: i.balance,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  ["customer", "lastTxn", "days", "bucket", "balance"],
                  ["Customer", "Last Transaction", "Days", "Bucket", "Balance"],
                ),
                "ar-aging.csv",
              );
            },
            () => printReport("AR Aging Report"),
          ),
        },
        {
          label: "AP Aging",
          icon: <IconUsers size={15} />,
          content: wrapWithExport(
            <APReport
              data={reportData?.apAging}
              isLoading={isLoading}
              fmt={fmt}
            />,
            () => {
              const d = reportData?.apAging;
              if (!d) return;
              const rows = d.items.map((i) => ({
                supplier: i.name,
                lastTxn: i.lastTransaction?.split("T")[0] || "",
                days: i.daysOverdue,
                bucket: i.bucket,
                balance: i.balance,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  ["supplier", "lastTxn", "days", "bucket", "balance"],
                  ["Supplier", "Last Transaction", "Days", "Bucket", "Balance"],
                ),
                "ap-aging.csv",
              );
            },
            () => printReport("AP Aging Report"),
          ),
        },
        {
          label: "Outstanding",
          icon: <IconDollar size={15} />,
          content: wrapWithExport(
            <OutStandReport
              data={reportData?.outstanding}
              isLoading={isLoading}
              fmt={fmt}
            />,
            () => {
              const d = reportData?.outstanding;
              if (!d) return;
              const rows = d.items.map((i) => ({
                party: i.name,
                type: i.type,
                accounts: i.accountNames,
                txns: i.transactionCount,
                side: i.balanceType,
                balance: i.balance,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  ["party", "type", "accounts", "txns", "side", "balance"],
                  [
                    "Party",
                    "Type",
                    "Accounts",
                    "Transactions",
                    "Side",
                    "Balance",
                  ],
                ),
                "outstanding.csv",
              );
            },
            () => printReport("Outstanding Report"),
          ),
        },
      ],
      // Category 3: Banking & Cash
      [
        {
          label: "Bank Reconciliation",
          icon: <IconReceipt size={15} />,
          content: wrapWithExport(
            <BankRecReport
              data={reportData?.bankReconciliation}
              isLoading={isLoading}
              fmt={fmt}
            />,
            () => {
              const d = reportData?.bankReconciliation;
              if (!d) return;
              const rows = d.accounts.map((a) => ({
                account: a.accountName,
                chartNo: a.chartNo,
                totalDr: a.totalDr,
                totalCr: a.totalCr,
                balance: a.bookBalance,
                txns: a.transactionCount,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  [
                    "account",
                    "chartNo",
                    "totalDr",
                    "totalCr",
                    "balance",
                    "txns",
                  ],
                  [
                    "Account",
                    "Chart No",
                    "Total Debit",
                    "Total Credit",
                    "Book Balance",
                    "Transactions",
                  ],
                ),
                "bank-reconciliation.csv",
              );
            },
            () => printReport("Bank Reconciliation"),
          ),
        },
        {
          label: "Cash Book",
          icon: <IconDollar size={15} />,
          content: wrapWithExport(
            <CashBankReport
              data={reportData?.cashBook}
              isLoading={isLoading}
              fmt={fmt}
            />,
            () => {
              const d = reportData?.cashBook;
              if (!d) return;
              const rows = d.items.map((i) => ({
                date: i.date,
                account: i.accountName,
                type: i.trnType,
                trnNo: i.trnNo,
                narration: i.narration,
                dr: i.debit,
                cr: i.credit,
                balance: i.runningBalance,
              }));
              exportToCSV(
                rows,
                buildColumns(
                  [
                    "date",
                    "account",
                    "type",
                    "trnNo",
                    "narration",
                    "dr",
                    "cr",
                    "balance",
                  ],
                  [
                    "Date",
                    "Account",
                    "Type",
                    "Trn No",
                    "Narration",
                    "Debit",
                    "Credit",
                    "Balance",
                  ],
                ),
                "cash-book.csv",
              );
            },
            () => printReport("Cash Book"),
          ),
        },
      ],
    ],
    [
      reportData,
      isLoading,
      fmt,
      accountOptions,
      selectedAccount,
      setSelectedAccount,
      partyOptions,
      selectedParty,
      setSelectedParty,
      exportPnL,
      printPnL,
      exportBalanceSheet,
      printBS,
      exportTB,
      printTB,
      exportCashFlow,
      printCF,
      exportGL,
      printGL,
      exportJR,
      printJR,
    ],
  );

  const currentCategoryTabs = categoryTabs[reportCategory] || [];

  const subtitle = !reportData
    ? "Loading..."
    : `${reportData.journalCount} entries · ${reportData.lineCount} lines · ${reportData.partyCount} parties`;

  const handleCategoryChange = (idx) => {
    setReportCategory(idx);
    setActiveTab(0);
  };

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Financial Reports" subtitle={subtitle} />
          <PageCardActions>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <IconRefresh size={14} className="icon-left" />
              Refresh
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {/* Filter Bar */}
          <div className="form-wrap mb-4">
            <div className="grid">
              <div className="col-span-3">
                <Dropdown
                  label="Department"
                  options={departmentOptions}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  optionValue="id"
                  optionLabel="dpart_cname"
                  placeholder="Select..."
                />
              </div>
              <div className="col-span-3">
                <Dropdown
                  label="Fiscal Year"
                  options={fiscalYearOptions}
                  value={selectedFiscalYear}
                  onChange={(e) => setSelectedFiscalYear(e.target.value)}
                  optionValue="id"
                  optionLabel="fsyar_cname"
                  placeholder="Select..."
                />
              </div>
              <div className="col-span-3">
                <Dropdown
                  label="Period"
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  optionValue="id"
                  optionLabel="acprd_cname"
                  placeholder="Select..."
                />
              </div>
              <div className="col-span-3" style={{ paddingTop: "var(--sp-6)" }}>
                <Button
                  variant="info"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full"
                >
                  <IconSearch size={14} className="icon-left" />
                  Generate
                </Button>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div style={{ marginBottom: "16px" }}>
            <GroupButton
              options={categoryLabels.map((label, idx) => ({
                value: idx,
                icon: categoryIcons[idx],
                label: (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {label}
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        padding: "1px 6px",
                        borderRadius: "10px",
                        background:
                          reportCategory === idx
                            ? "var(--primary)"
                            : "var(--bg-muted)",
                        color:
                          reportCategory === idx
                            ? "white"
                            : "var(--text-muted)",
                      }}
                    >
                      {categoryTabs[idx]?.length || 0}
                    </span>
                  </span>
                ),
              }))}
              value={reportCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            />
          </div>

          {/* Report Sub-tabs */}
          <TabPage
            tabs={currentCategoryTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
            size="sm"
          />
        </PageCardBody>
      </PageCard>
    </div>
  );
};

export default Fstatements_bk;
