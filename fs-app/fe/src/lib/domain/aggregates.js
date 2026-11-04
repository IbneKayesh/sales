const sumBy = (list, selector) =>
  list.reduce((total, item) => total + (Number(selector(item)) || 0), 0);

export function entriesOf(transaction) {
  return Array.isArray(transaction?.entries) ? transaction.entries : [];
}

export function debitEntry(transaction) {
  return entriesOf(transaction).find((entry) => entry.side === "debit") ?? null;
}

export function creditEntry(transaction) {
  return entriesOf(transaction).find((entry) => entry.side === "credit") ?? null;
}

/**
 * Balance of one sub account (Savings / DPS / FD) from the journal.
 * Sub accounts are assets: debits increase them, credits decrease them.
 */
export function subAccountBalance(account, transactions) {
  const opening = Number(account?.openingBalance) || 0;

  return transactions.reduce((total, tx) => {
    for (const entry of entriesOf(tx)) {
      if (entry.kind !== "child" || entry.id !== account?._id) continue;

      const amount = Number(entry.amount) || 0;
      total += entry.side === "debit" ? amount : -amount;
    }

    return total;
  }, opening);
}

/**
 * Balance of a bank account: its opening balance plus every debit and credit
 * posted to its sub accounts.
 */
export function accountBalance(account, transactions) {
  const opening = Number(account?.openingBalance) || 0;

  return transactions.reduce((total, tx) => {
    for (const entry of entriesOf(tx)) {
      if (entry.kind !== "child" || entry.accountId !== account?._id) continue;

      const amount = Number(entry.amount) || 0;
      total += entry.side === "debit" ? amount : -amount;
    }

    return total;
  }, opening);
}

/** Total balance of one bank: the sum of its bank account balances. */
export function bankTotalBalance(bank, accounts, transactions) {
  return accounts
    .filter((account) => account.bankId === bank?._id)
    .reduce(
      (total, account) => total + accountBalance(account, transactions),
      0
    );
}

/**
 * Net bank movement of one transaction. Sub-account transfers inside the same
 * bank net to zero; cross-bank transfers show as an outflow and an inflow.
 */
export function transactionFlow(transaction) {
  const perBank = new Map();

  for (const entry of entriesOf(transaction)) {
    if (entry.kind !== "child" || !entry.bankId) continue;

    const amount = Number(entry.amount) || 0;
    const signed = entry.side === "debit" ? amount : -amount;

    perBank.set(entry.bankId, (perBank.get(entry.bankId) || 0) + signed);
  }

  let moneyIn = 0;
  let moneyOut = 0;

  for (const net of perBank.values()) {
    if (net >= 0) moneyIn += net;
    else moneyOut += -net;
  }

  return { moneyIn, moneyOut, net: moneyIn - moneyOut };
}

/** DPS completion percentage (0-100). */
export function dpsProgress(account) {
  const total = Number(account?.installmentsTotal) || 0;
  const paid = Number(account?.installmentsPaid) || 0;
  if (!total) return 0;
  return Math.min(100, Math.round((paid / total) * 100));
}

export function monthOf(date) {
  return String(date || "").slice(0, 7);
}

/** Distinct months (newest first) that contain at least one transaction. */
export function availableMonths(transactions) {
  const months = new Set(
    transactions.map((tx) => monthOf(tx.date)).filter(Boolean)
  );
  return [...months].sort((a, b) => b.localeCompare(a));
}

/**
 * Monthly cash flow per bank, derived from the debit/credit legs: the leg
 * posted to a bank's sub account is the money movement, the counter leg
 * (another sub account or a system income/expense account) classifies it.
 */
export function buildCashFlow(banks, transactions, month) {
  const rows = banks.map((bank) => {
    let deposits = 0;
    let profit = 0;
    let withdrawals = 0;
    let transfers = 0;
    let charges = 0;
    let moneyIn = 0;
    let moneyOut = 0;
    let count = 0;

    for (const tx of transactions) {
      if (monthOf(tx.date) !== month) continue;

      const entries = entriesOf(tx);
      const legs = entries.filter(
        (entry) => entry.kind === "child" && entry.bankId === bank._id
      );

      if (!legs.length) continue;

      count += 1;

      // Both legs belong to this bank: an internal sub-account transfer.
      if (legs.length > 1) {
        transactions;
        transfers += sumBy(legs, (entry) => entry.amount) / 2;
        continue;
      }

      const leg = legs[0];
      const counter = entries.find((entry) => entry !== leg) ?? {};
      const amount = Number(leg.amount) || 0;

      if (leg.side === "debit") {
        moneyIn += amount;

        if (counter.kind === "system" && counter.type === "PROFIT") {
          profit += amount;
        } else if (counter.kind === "system") {
          deposits += amount;
        } else {
          transfers += amount;
        }
      } else {
        moneyOut += amount;

        if (counter.kind === "system" && counter.type === "CHARGES") {
          charges += amount;
        } else if (counter.kind === "system" && counter.type === "EXTERNAL") {
          withdrawals += amount;
        } else {
          transfers += amount;
        }
      }
    }

    return {
      bank,
      deposits,
      profit,
      withdrawals,
      transfers,
      charges,
      moneyIn,
      moneyOut,
      net: moneyIn - moneyOut,
      count,
    };
  });

  const totals = rows.reduce(
    (acc, row) => ({
      deposits: acc.deposits + row.deposits,
      profit: acc.profit + row.profit,
      withdrawals: acc.withdrawals + row.withdrawals,
      transfers: acc.transfers + row.transfers,
      charges: acc.charges + row.charges,
      moneyIn: acc.moneyIn + row.moneyIn,
      moneyOut: acc.moneyOut + row.moneyOut,
      net: acc.net + row.net,
      count: acc.count + row.count,
    }),
    {
      deposits: 0,
      profit: 0,
      withdrawals: 0,
      transfers: 0,
      charges: 0,
      moneyIn: 0,
      moneyOut: 0,
      net: 0,
      count: 0,
    }
  );

  return { rows, totals };
}

export function portfolioSummary({ banks, accounts, savings, dps, fd, transactions }) {
  return {
    dps,
    fd,
    savings,
    accountCount: accounts.length,
    subAccountCount: savings.length + dps.length + fd.length,
    totalBalance: accounts.reduce(
      (total, account) => total + accountBalance(account, transactions),
      0
    ),
    dpsPaid: sumBy(dps, (account) => account.totalPaid),
    dpsPayable: sumBy(dps, (account) => account.totalPayable),
    dpsInterest: sumBy(dps, (account) => account.interestEarned),
    fdPrincipal: sumBy(fd, (account) => account.principal),
    fdInterest: sumBy(fd, (account) => account.totalInterest),
    bankCount: banks.length,
  };
}

export function upcomingInstallments(dps, limit = 5) {
  return dps
    .filter(
      (account) =>
        account.status !== "closed" &&
        Number(account.installmentsPaid) < Number(account.installmentsTotal)
    )
    .sort((a, b) =>
      String(a.nextInstallmentDate).localeCompare(String(b.nextInstallmentDate))
    )
    .slice(0, limit);
}

export function recentTransactions(transactions, limit = 7) {
  return [...transactions]
    .sort(
      (a, b) =>
        String(b.date).localeCompare(String(a.date)) ||
        String(b.createdAt).localeCompare(String(a.createdAt))
    )
    .slice(0, limit);
}
