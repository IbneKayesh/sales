export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense'
export type Role = 'admin' | 'accountant' | 'viewer'

export type Account = { id: string; code: string; name: string; type: AccountType; openingBalance: number }
export type Party = { id: string; name: string; category: 'customer' | 'supplier'; due: number }
export type User = { id: string; name: string; email: string; role: Role; password: string }
export type JournalLine = { accountId: string; debit: number; credit: number }
export type JournalEntry = { id: string; date: string; memo: string; lines: JournalLine[]; reference: string }
export type Invoice = { id: string; date: string; partyId: string; kind: 'sale' | 'purchase'; amount: number; tax: number; status: 'open' | 'paid' }
export type Payment = { id: string; date: string; partyId: string; amount: number; mode: 'cash' | 'bank'; direction: 'collection' | 'payment' }
export type BankTransaction = { id: string; bankAccount: string; date: string; description: string; amount: number; direction: 'in' | 'out'; matched: boolean }
export type DailyTransaction = { id: string; date: string; category: 'income' | 'expense' | 'collection' | 'payment' | 'transfer'; amount: number; channel: 'cash' | 'bank'; reference: string }

export type AccountingTab =
  | 'dashboard'
  | 'coa'
  | 'journal'
  | 'ledger'
  | 'trial'
  | 'pl'
  | 'bs'
  | 'daily'
  | 'parties'
  | 'dues'
  | 'invoice'
  | 'payment'
  | 'reports'
  | 'bank'
  | 'settings'
  | 'auth'
