import type { Account, BankTransaction, DailyTransaction, Invoice, JournalEntry, Party, Payment, User } from '../types/accounting'

export const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export const today = new Date().toISOString().slice(0, 10)

export const accountsSeed: Account[] = [
  { id: 'a1', code: '1001', name: 'Cash on Hand', type: 'asset', openingBalance: 12000 },
  { id: 'a2', code: '1002', name: 'Bank - Main', type: 'asset', openingBalance: 38000 },
  { id: 'a3', code: '1101', name: 'Accounts Receivable', type: 'asset', openingBalance: 5400 },
  { id: 'a4', code: '2001', name: 'Accounts Payable', type: 'liability', openingBalance: 3100 },
  { id: 'a5', code: '3001', name: 'Owner Equity', type: 'equity', openingBalance: 52300 },
  { id: 'a6', code: '4001', name: 'Sales Revenue', type: 'income', openingBalance: 0 },
  { id: 'a7', code: '5001', name: 'Cost of Goods Sold', type: 'expense', openingBalance: 0 },
  { id: 'a8', code: '5002', name: 'Office Expense', type: 'expense', openingBalance: 0 },
]

export const partiesSeed: Party[] = [
  { id: 'p1', name: 'Acme Retail', category: 'customer', due: 2400 },
  { id: 'p2', name: 'Metro Wholesale', category: 'customer', due: 1300 },
  { id: 'p3', name: 'SupplyHub Ltd', category: 'supplier', due: 1850 },
  { id: 'p4', name: 'TechSource Inc', category: 'supplier', due: 920 },
]

export const usersSeed: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@sgd.com', role: 'admin', password: '123456' },
  { id: 'u2', name: 'Accountant', email: 'accounts@company.com', role: 'accountant', password: 'acc123' },
]

export const entriesSeed: JournalEntry[] = [
  { id: 'j1', date: '2026-04-01', memo: 'Invoice to Acme Retail', reference: 'INV-001', lines: [{ accountId: 'a3', debit: 2700, credit: 0 }, { accountId: 'a6', debit: 0, credit: 2700 }] },
  { id: 'j2', date: '2026-04-02', memo: 'Collection from Acme', reference: 'RCV-001', lines: [{ accountId: 'a1', debit: 1500, credit: 0 }, { accountId: 'a3', debit: 0, credit: 1500 }] },
]

export const invoicesSeed: Invoice[] = [
  { id: 'INV-001', date: '2026-04-01', partyId: 'p1', kind: 'sale', amount: 2500, tax: 200, status: 'open' },
  { id: 'INV-002', date: '2026-04-02', partyId: 'p3', kind: 'purchase', amount: 1200, tax: 96, status: 'paid' },
]

export const paymentsSeed: Payment[] = [
  { id: 'PAY-001', date: '2026-04-02', partyId: 'p1', amount: 1500, mode: 'cash', direction: 'collection' },
  { id: 'PAY-002', date: '2026-04-03', partyId: 'p3', amount: 1200, mode: 'bank', direction: 'payment' },
]

export const bankTxSeed: BankTransaction[] = [
  { id: 'BT-001', bankAccount: 'Main Bank', date: '2026-04-04', description: 'Cash transfer in', amount: 3000, direction: 'in', matched: true },
  { id: 'BT-002', bankAccount: 'Main Bank', date: '2026-04-05', description: 'Utility payment', amount: 420, direction: 'out', matched: false },
]

export const dailyTxSeed: DailyTransaction[] = [
  { id: 'DT-001', date: '2026-04-01', category: 'income', amount: 2700, channel: 'bank', reference: 'INV-001' },
  { id: 'DT-002', date: '2026-04-03', category: 'expense', amount: 650, channel: 'cash', reference: 'BIL-001' },
]
