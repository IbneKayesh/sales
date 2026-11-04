import { initializeStorage } from "./storage/index.js";

const pad = (n) => String(n).padStart(2, "0");

/** Add months to a yyyy-mm-dd date, keeping it on the given day of month. */
function addMonths(dateStr, months, day) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  const safeDay = Math.min(Number(day) || 1, 28);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(safeDay)}`;
}

/** Income/expense counter accounts used on the other side of cash movements. */
const SYSTEM_ACCOUNTS = {
  EXTERNAL: { code: "EXTERNAL", name: "External / Cash" },
  PROFIT: { code: "PROFIT", name: "Profit income" },
  CHARGES: { code: "CHARGES", name: "Bank charges" }
};

/* ------------------------------------------------------------------ */
/* Demo data: banks → bank accounts → Savings/DPS/FD sub accounts      */
/* ------------------------------------------------------------------ */

const SEED = [
  {
    bank: {
      name: "Brac Bank Ltd",
      branch: "Gulshan 2",
      status: "active",
      notes: "Primary banking partner"
    },
    account: {
      accountName: "Travel trading",
      accountNo: "15001000001",
      type: "Savings",
      openingBalance: 450000,
      status: "active",
      notes: "Primary operating account for travel bookings"
    },
    dps: [
      { accountNo: "15001000005", label: "1st DPS", installmentAmount: 5000, installmentsTotal: 60, rate: 9.5, totalInterest: 28500, installmentsPaid: 2, interestEarned: 950, installmentDay: 5, openDate: "2026-09-05" },
      { accountNo: "15001000006", label: "2nd DPS", installmentAmount: 3000, installmentsTotal: 36, rate: 8.5, totalInterest: 9180, installmentsPaid: 8, interestEarned: 1200, installmentDay: 10, openDate: "2026-03-10" },
      { accountNo: "15001000007", label: "3rd DPS", installmentAmount: 10000, installmentsTotal: 24, rate: 9, totalInterest: 10800, installmentsPaid: 5, interestEarned: 900, installmentDay: 15, openDate: "2026-06-15" }
    ],
    fd: [
      { accountNo: "15001000008", label: "1st FD", principal: 100000, rate: 10, totalInterest: 10000, interestPaymentType: "Yearly", openDate: "2026-01-10" },
      { accountNo: "15001000009", label: "2nd FD", principal: 50000, rate: 9.5, totalInterest: 4750, interestPaymentType: "Half Yearly", openDate: "2026-06-20" },
      { accountNo: "15001000010", label: "3rd FD", principal: 200000, rate: 11, totalInterest: 22000, interestPaymentType: "Yearly", openDate: "2026-02-12" },
      { accountNo: "15001000011", label: "4th FD", principal: 150000, rate: 10.5, totalInterest: 15750, interestPaymentType: "Yearly", openDate: "2026-05-18" },
      { accountNo: "15001000012", label: "5th FD", principal: 75000, rate: 9, totalInterest: 6750, interestPaymentType: "Half Yearly", openDate: "2026-07-22" }
    ],
    transactions: [
      { date: "2026-01-10", type: "fd-deposit", amount: 100000, debit: "fd:15001000008", credit: "savings", reference: "FD opening", description: "Funded 1st FD from savings" },
      { date: "2026-10-01", type: "deposit", amount: 150000, debit: "savings", credit: "system:EXTERNAL", reference: "TRX-88121", description: "Client payment - Cox's Bazar tour package" },
      { date: "2026-10-05", type: "dps-installment", amount: 5000, debit: "dps:15001000005", credit: "savings", reference: "DPS Oct-26", description: "1st DPS installment" },
      { date: "2026-10-10", type: "dps-installment", amount: 3000, debit: "dps:15001000006", credit: "savings", reference: "DPS Oct-26", description: "2nd DPS installment" },
      { date: "2026-10-20", type: "withdraw", amount: 40000, debit: "system:EXTERNAL", credit: "savings", reference: "CHQ-0041", description: "Supplier payment - hotel booking" },
      { date: "2026-10-31", type: "profit", amount: 2450, debit: "savings", credit: "system:PROFIT", reference: "", description: "Monthly savings profit credited" },
      { date: "2026-10-31", type: "charge", amount: 550, debit: "system:CHARGES", credit: "savings", reference: "", description: "Account maintenance charge" }
    ]
  },
  {
    bank: {
      name: "Dutch-Bangla Bank Ltd",
      branch: "Motijheel",
      status: "active",
      notes: "Vendor payouts"
    },
    account: {
      accountName: "Travel trading",
      accountNo: "1021300045678",
      type: "Savings",
      openingBalance: 280000,
      status: "active",
      notes: "Used for vendor payouts"
    },
    dps: [
      { accountNo: "1021300045680", label: "1st DPS", installmentAmount: 4000, installmentsTotal: 48, rate: 8.75, totalInterest: 8400, installmentsPaid: 12, interestEarned: 2100, installmentDay: 7, openDate: "2025-12-07" },
      { accountNo: "1021300045681", label: "2nd DPS", installmentAmount: 2000, installmentsTotal: 24, rate: 8, totalInterest: 1920, installmentsPaid: 4, interestEarned: 320, installmentDay: 20, openDate: "2026-07-20" }
    ],
    fd: [
      { accountNo: "1021300045690", label: "1st FD", principal: 250000, rate: 10.25, totalInterest: 25625, interestPaymentType: "Half Yearly", openDate: "2026-03-14" },
      { accountNo: "1021300045691", label: "2nd FD", principal: 80000, rate: 9.75, totalInterest: 7800, interestPaymentType: "Yearly", openDate: "2026-08-09" },
      { accountNo: "1021300045692", label: "3rd FD", principal: 60000, rate: 9.5, totalInterest: 5700, interestPaymentType: "Half Yearly", openDate: "2026-09-30" }
    ],
    transactions: [
      { date: "2026-09-30", type: "fd-deposit", amount: 60000, debit: "fd:1021300045692", credit: "savings", reference: "FD opening", description: "3rd FD funded" },
      { date: "2026-10-02", type: "deposit", amount: 90000, debit: "savings", credit: "system:EXTERNAL", reference: "TRX-77410", description: "Corporate booking advance" },
      { date: "2026-10-07", type: "dps-installment", amount: 4000, debit: "dps:1021300045680", credit: "savings", reference: "DPS Oct-26", description: "1st DPS installment" },
      { date: "2026-10-18", type: "withdraw", amount: 35000, debit: "system:EXTERNAL", credit: "savings", reference: "ATM-2210", description: "Cash withdrawal for office expenses" },
      { date: "2026-10-28", type: "profit", amount: 1600, debit: "savings", credit: "system:PROFIT", reference: "", description: "Savings profit" },
      { date: "2026-10-28", type: "charge", amount: 400, debit: "system:CHARGES", credit: "savings", reference: "", description: "Quarterly service charge" }
    ]
  },
  {
    bank: {
      name: "City Bank Ltd",
      branch: "Dhanmondi",
      status: "active",
      notes: "Marketing and petty cash"
    },
    account: {
      accountName: "Travel trading",
      accountNo: "1402500012345",
      type: "Savings",
      openingBalance: 175000,
      status: "active",
      notes: "Marketing and petty cash"
    },
    dps: [
      { accountNo: "1402500012346", label: "1st DPS", installmentAmount: 2500, installmentsTotal: 36, rate: 8.5, totalInterest: 4590, installmentsPaid: 6, interestEarned: 765, installmentDay: 12, openDate: "2026-05-12" }
    ],
    fd: [
      { accountNo: "1402500012350", label: "1st FD", principal: 50000, rate: 9.25, totalInterest: 4625, interestPaymentType: "Yearly", openDate: "2026-04-25" },
      { accountNo: "1402500012351", label: "2nd FD", principal: 120000, rate: 10, totalInterest: 12000, interestPaymentType: "Half Yearly", openDate: "2026-06-30" }
    ],
    transactions: [
      { date: "2026-10-03", type: "deposit", amount: 60000, debit: "savings", credit: "system:EXTERNAL", reference: "TRX-55102", description: "Visa processing fees collected" },
      { date: "2026-10-12", type: "dps-installment", amount: 2500, debit: "dps:1402500012346", credit: "savings", reference: "DPS Oct-26", description: "1st DPS installment" },
      { date: "2026-10-22", type: "withdraw", amount: 20000, debit: "system:EXTERNAL", credit: "savings", reference: "CHQ-0012", description: "Facebook ads campaign" },
      { date: "2026-10-30", type: "profit", amount: 900, debit: "savings", credit: "system:PROFIT", reference: "", description: "Savings profit" }
    ]
  },
  {
    bank: {
      name: "Eastern Bank Ltd",
      branch: "Banani",
      status: "active",
      notes: "Reserve account"
    },
    account: {
      accountName: "Travel trading",
      accountNo: "1011200089012",
      type: "Savings",
      openingBalance: 320000,
      status: "active",
      notes: "Reserve account"
    },
    dps: [
      { accountNo: "1011200089015", label: "1st DPS", installmentAmount: 10000, installmentsTotal: 60, rate: 9.25, totalInterest: 55500, installmentsPaid: 3, interestEarned: 1387.5, installmentDay: 8, openDate: "2026-08-08" },
      { accountNo: "1011200089016", label: "2nd DPS", installmentAmount: 1500, installmentsTotal: 24, rate: 7.5, totalInterest: 1350, installmentsPaid: 10, interestEarned: 540, installmentDay: 25, openDate: "2026-01-25" }
    ],
    fd: [
      { accountNo: "1011200089020", label: "1st FD", principal: 300000, rate: 11.25, totalInterest: 33750, interestPaymentType: "Half Yearly", openDate: "2026-02-05" },
      { accountNo: "1011200089021", label: "2nd FD", principal: 90000, rate: 10.5, totalInterest: 9450, interestPaymentType: "Yearly", openDate: "2026-07-11" }
    ],
    transactions: [
      { date: "2026-07-11", type: "fd-deposit", amount: 90000, debit: "fd:1011200089021", credit: "savings", reference: "FD opening", description: "2nd FD funded" },
      { date: "2026-10-06", type: "deposit", amount: 120000, debit: "savings", credit: "system:EXTERNAL", reference: "TRX-99331", description: "Hajj package payment" },
      { date: "2026-10-08", type: "dps-installment", amount: 10000, debit: "dps:1011200089015", credit: "savings", reference: "DPS Oct-26", description: "1st DPS installment" },
      { date: "2026-10-25", type: "dps-installment", amount: 1500, debit: "dps:1011200089016", credit: "savings", reference: "DPS Oct-26", description: "2nd DPS installment" },
      { date: "2026-10-31", type: "charge", amount: 600, debit: "system:CHARGES", credit: "savings", reference: "", description: "Account maintenance charge" }
    ]
  }
];

const EXAMPLE_DOCS = [
  {
    title: "Monthly savings target",
    owner: "Travel trading",
    amount: 50000,
    currency: "BDT",
    month: "2026-11",
    tags: ["savings", "target"],
    done: false,
    note: "Free-form JSON document - edit this directly to see CRUD on any shape of data"
  },
  {
    title: "Bank visit checklist",
    owner: "Travel trading",
    done: true,
    steps: ["Collect DPS passbook", "Submit FD renewal form", "Verify Q3 profit credit"]
  }
];

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

function buildDps(bank, account, item) {
  return {
    bankId: bank._id,
    bankName: bank.name,
    accountId: account._id,
    parentAccountNo: account.accountNo,
    accountNo: item.accountNo,
    label: item.label,
    type: "DPS",
    status: item.status || "active",
    installmentAmount: item.installmentAmount,
    installmentsTotal: item.installmentsTotal,
    installmentDay: item.installmentDay,
    totalPayable: item.installmentAmount * item.installmentsTotal,
    rate: item.rate,
    totalInterest: item.totalInterest,
    installmentsPaid: item.installmentsPaid,
    totalPaid: item.installmentAmount * item.installmentsPaid,
    interestEarned: item.interestEarned,
    openDate: item.openDate,
    closeDate: addMonths(item.openDate, item.installmentsTotal, item.installmentDay),
    lastInstallmentDate:
      item.installmentsPaid > 0
        ? addMonths(item.openDate, item.installmentsPaid - 1, item.installmentDay)
        : null,
    nextInstallmentDate: addMonths(item.openDate, item.installmentsPaid, item.installmentDay),
    notes: item.notes || ""
  };
}

function buildFd(bank, account, item) {
  const termMonths = item.termMonths || 12;
  const day = Number(item.openDate.slice(8, 10));
  const interval = item.interestPaymentType === "Half Yearly" ? 6 : 12;

  return {
    bankId: bank._id,
    bankName: bank.name,
    accountId: account._id,
    parentAccountNo: account.accountNo,
    accountNo: item.accountNo,
    label: item.label,
    type: "FD",
    status: item.status || "active",
    principal: item.principal,
    rate: item.rate,
    totalInterest: item.totalInterest,
    maturityAmount: item.principal + item.totalInterest,
    interestPaymentType: item.interestPaymentType,
    interestPaymentDate: item.openDate,
    nextInterestPaymentDate: addMonths(item.openDate, interval, day),
    openDate: item.openDate,
    closeDate: addMonths(item.openDate, termMonths, day),
    notes: item.notes || ""
  };
}

function buildSavings(bank, account) {
  return {
    bankId: bank._id,
    bankName: bank.name,
    accountId: account._id,
    parentAccountNo: account.accountNo,
    accountNo: account.accountNo,
    label: "Savings",
    type: "Savings",
    status: "active",
    rate: 0,
    openDate: "2025-07-01",
    closeDate: null,
    notes: "Operating sub account for daily deposits, withdrawals, profit and charges"
  };
}

/** Resolve "savings", "dps:<no>", "fd:<no>" or "system:<CODE>" into a journal leg. */
function buildEntry(side, descriptor, amount, bank, account, children) {
  if (descriptor.startsWith("system:")) {
    const code = descriptor.slice("system:".length);
    const system = SYSTEM_ACCOUNTS[code];

    return {
      side,
      kind: "system",
      id: code,
      type: code,
      accountId: "",
      accountNo: "",
      name: system.name,
      bankId: "",
      bankName: "",
      amount
    };
  }

  let child;

  if (descriptor === "savings") {
    child = children.savings;
  } else {
    child = children.byAccountNo[descriptor.split(":")[1]];
  }

  return {
    side,
    kind: "child",
    id: child._id,
    type: child.type,
    accountId: account._id,
    accountNo: child.accountNo,
    name: `${child.type} · ${child.accountNo}`,
    bankId: bank._id,
    bankName: bank.name,
    amount
  };
}

/* ------------------------------------------------------------------ */
/* Runner                                                              */
/* ------------------------------------------------------------------ */

async function seed() {
  const db = await initializeStorage();

  if ((await db.collection("banks").count()) > 0) {
    console.log("Banking data already present - skipping seed.");
    return;
  }

  console.log("Seeding double-entry banking data…");

  const bankColl = db.collection("banks");
  const accountColl = db.collection("accounts");
  const savingsColl = db.collection("savings");
  const dpsColl = db.collection("dps");
  const fdColl = db.collection("fd");
  const txColl = db.collection("transactions");
  const exampleColl = db.collection("example_docs");

  for (const entry of SEED) {
    const bank = await bankColl.insert(entry.bank);

    const account = await accountColl.insert({
      ...entry.account,
      bankId: bank._id,
      bankName: bank.name,
      branch: bank.branch
    });

    const savings = await savingsColl.insert(buildSavings(bank, account));

    const children = { savings, byAccountNo: {} };

    for (const item of entry.dps) {
      const child = await dpsColl.insert(buildDps(bank, account, item));
      children.byAccountNo[child.accountNo] = child;
    }

    for (const item of entry.fd) {
      const child = await fdColl.insert(buildFd(bank, account, item));
      children.byAccountNo[child.accountNo] = child;
    }

    for (const tx of entry.transactions) {
      const entries = [
        buildEntry("debit", tx.debit, tx.amount, bank, account, children),
        buildEntry("credit", tx.credit, tx.amount, bank, account, children)
      ];

      await txColl.insert({
        date: tx.date,
        type: tx.type,
        amount: tx.amount,
        entries,
        debitTotal: tx.amount,
        creditTotal: tx.amount,
        bankId: bank._id,
        bankName: bank.name,
        reference: tx.reference || "",
        description: tx.description || ""
      });
    }
  }

  for (const doc of EXAMPLE_DOCS) {
    await exampleColl.insert(doc);
  }

  console.log("Seeding complete!");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
