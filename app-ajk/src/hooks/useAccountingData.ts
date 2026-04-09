import { useMemo, useState } from 'react'
import { accountsSeed, bankTxSeed, dailyTxSeed, entriesSeed, invoicesSeed, partiesSeed, paymentsSeed, usersSeed } from '../data/mockData'
import type { Account, AccountType, DailyTransaction, Invoice, JournalEntry, Payment, Role, User } from '../types/accounting'

export function useAccountingData() {
  const [accounts, setAccounts] = useState(accountsSeed)
  const [parties, setParties] = useState(partiesSeed)
  const [users, setUsers] = useState(usersSeed)
  const [entries, setEntries] = useState(entriesSeed)
  const [invoices, setInvoices] = useState(invoicesSeed)
  const [payments, setPayments] = useState(paymentsSeed)
  const [bankTransactions, setBankTransactions] = useState(bankTxSeed)
  const [dailyTransactions, setDailyTransactions] = useState(dailyTxSeed)
  const [sessionUser, setSessionUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')

  const balances = useMemo(() => {
    const map = new Map<string, { debit: number; credit: number; closing: number }>()
    accounts.forEach((a) => map.set(a.id, { debit: 0, credit: 0, closing: a.openingBalance }))
    entries.forEach((e) => e.lines.forEach((l) => {
      const row = map.get(l.accountId)
      if (!row) return
      row.debit += l.debit
      row.credit += l.credit
    }))
    accounts.forEach((a) => {
      const r = map.get(a.id)!
      r.closing = ['asset', 'expense'].includes(a.type) ? a.openingBalance + r.debit - r.credit : a.openingBalance - r.debit + r.credit
    })
    return map
  }, [accounts, entries])

  const totals = useMemo(() => {
    const totalDebit = entries.reduce((sum, e) => sum + e.lines.reduce((s, l) => s + l.debit, 0), 0)
    const totalCredit = entries.reduce((sum, e) => sum + e.lines.reduce((s, l) => s + l.credit, 0), 0)
    const income = accounts.filter((a) => a.type === 'income').reduce((sum, a) => sum + (balances.get(a.id)?.closing ?? 0), 0)
    const expense = accounts.filter((a) => a.type === 'expense').reduce((sum, a) => sum + (balances.get(a.id)?.closing ?? 0), 0)
    return { totalDebit, totalCredit, income, expense, netProfit: income - expense }
  }, [accounts, balances, entries])

  const receivable = parties.filter((p) => p.category === 'customer').reduce((sum, p) => sum + p.due, 0)
  const payable = parties.filter((p) => p.category === 'supplier').reduce((sum, p) => sum + p.due, 0)

  const addEntry = (entry: JournalEntry) => setEntries((prev) => [entry, ...prev])
  const nextCode = (prefix: string, total: number) => `${prefix}-${String(total + 1).padStart(3, '0')}`
  const cashAccountId = 'a1'
  const bankAccountId = 'a2'
  const receivableAccountId = 'a3'
  const payableAccountId = 'a4'
  const salesAccountId = 'a6'
  const cogsAccountId = 'a7'
  const expenseAccountId = 'a8'

  const addAccount = (account: Account) => {
    if (sessionUser?.role !== 'admin') {
      setMessage('Only admin can add accounts.')
      return false
    }
    setAccounts((prev) => [...prev, account])
    setMessage('Account added.')
    return true
  }

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      setMessage('Invalid credentials.')
      return false
    }
    setSessionUser(found)
    setMessage(`Logged in as ${found.name}`)
    return true
  }

  const register = (name: string, email: string, role: Role, password: string) => {
    if (users.some((u) => u.email === email)) {
      setMessage('Email already exists.')
      return false
    }
    setUsers((prev) => [...prev, { id: `u${prev.length + 1}`, name, email, role, password }])
    setMessage('Registration successful.')
    return true
  }

  const changePassword = (current: string, next: string) => {
    if (!sessionUser || sessionUser.password !== current || next.length < 6) {
      setMessage('Password update failed.')
      return false
    }
    setUsers((prev) => prev.map((u) => (u.id === sessionUser.id ? { ...u, password: next } : u)))
    setSessionUser({ ...sessionUser, password: next })
    setMessage('Password changed.')
    return true
  }

  const logout = () => {
    setSessionUser(null)
    setMessage('Logged out.')
  }

  const addDailyTransaction = (tx: Omit<DailyTransaction, 'id'>) => {
    if (tx.amount <= 0) {
      setMessage('Amount must be greater than zero.')
      return false
    }
    const id = nextCode('DT', dailyTransactions.length)
    setDailyTransactions((prev) => [{ id, ...tx }, ...prev])

    const debitCash = tx.channel === 'cash' ? cashAccountId : bankAccountId
    const creditCash = tx.channel === 'cash' ? cashAccountId : bankAccountId

    if (tx.category === 'income') {
      addEntry({
        id: `j${entries.length + 1}`,
        date: tx.date,
        memo: `Daily income - ${tx.reference}`,
        reference: id,
        lines: [{ accountId: debitCash, debit: tx.amount, credit: 0 }, { accountId: salesAccountId, debit: 0, credit: tx.amount }],
      })
    } else if (tx.category === 'expense') {
      addEntry({
        id: `j${entries.length + 1}`,
        date: tx.date,
        memo: `Daily expense - ${tx.reference}`,
        reference: id,
        lines: [{ accountId: expenseAccountId, debit: tx.amount, credit: 0 }, { accountId: creditCash, debit: 0, credit: tx.amount }],
      })
    } else if (tx.category === 'transfer') {
      addEntry({
        id: `j${entries.length + 1}`,
        date: tx.date,
        memo: `Daily transfer - ${tx.reference}`,
        reference: id,
        lines: tx.channel === 'cash'
          ? [{ accountId: cashAccountId, debit: tx.amount, credit: 0 }, { accountId: bankAccountId, debit: 0, credit: tx.amount }]
          : [{ accountId: bankAccountId, debit: tx.amount, credit: 0 }, { accountId: cashAccountId, debit: 0, credit: tx.amount }],
      })
    }

    if (tx.channel === 'bank') {
      setBankTransactions((prev) => [{
        id: nextCode('BT', prev.length),
        bankAccount: 'Main Bank',
        date: tx.date,
        description: `From ${tx.category}: ${tx.reference}`,
        amount: tx.amount,
        direction: tx.category === 'expense' ? 'out' : 'in',
        matched: false,
      }, ...prev])
    }

    setMessage('Daily transaction recorded and posted.')
    return true
  }

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'status'>) => {
    if (invoice.amount <= 0 || invoice.tax < 0) {
      setMessage('Invoice amount is invalid.')
      return false
    }
    const gross = invoice.amount + invoice.tax
    const id = nextCode('INV', invoices.length)
    setInvoices((prev) => [{ ...invoice, id, status: 'open' }, ...prev])
    setParties((prev) => prev.map((p) => (p.id === invoice.partyId ? { ...p, due: p.due + gross } : p)))

    if (invoice.kind === 'sale') {
      addEntry({
        id: `j${entries.length + 1}`,
        date: invoice.date,
        memo: `Sale invoice ${id}`,
        reference: id,
        lines: [{ accountId: receivableAccountId, debit: gross, credit: 0 }, { accountId: salesAccountId, debit: 0, credit: gross }],
      })
    } else {
      addEntry({
        id: `j${entries.length + 1}`,
        date: invoice.date,
        memo: `Purchase invoice ${id}`,
        reference: id,
        lines: [{ accountId: cogsAccountId, debit: gross, credit: 0 }, { accountId: payableAccountId, debit: 0, credit: gross }],
      })
    }

    setMessage('Invoice created and journal posted.')
    return true
  }

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    if (payment.amount <= 0) {
      setMessage('Payment amount is invalid.')
      return false
    }
    const id = nextCode('PAY', payments.length)
    setPayments((prev) => [{ ...payment, id }, ...prev])
    setParties((prev) => prev.map((p) => (p.id === payment.partyId ? { ...p, due: Math.max(0, p.due - payment.amount) } : p)))

    const cashLike = payment.mode === 'cash' ? cashAccountId : bankAccountId
    if (payment.direction === 'collection') {
      addEntry({
        id: `j${entries.length + 1}`,
        date: payment.date,
        memo: `Collection ${id}`,
        reference: id,
        lines: [{ accountId: cashLike, debit: payment.amount, credit: 0 }, { accountId: receivableAccountId, debit: 0, credit: payment.amount }],
      })
    } else {
      addEntry({
        id: `j${entries.length + 1}`,
        date: payment.date,
        memo: `Payment ${id}`,
        reference: id,
        lines: [{ accountId: payableAccountId, debit: payment.amount, credit: 0 }, { accountId: cashLike, debit: 0, credit: payment.amount }],
      })
    }

    if (payment.mode === 'bank') {
      setBankTransactions((prev) => [{
        id: nextCode('BT', prev.length),
        bankAccount: 'Main Bank',
        date: payment.date,
        description: `${payment.direction} ${id}`,
        amount: payment.amount,
        direction: payment.direction === 'collection' ? 'in' : 'out',
        matched: false,
      }, ...prev])
    }

    setMessage('Collection/payment posted.')
    return true
  }

  const transferBalance = (input: { date: string; fromAccountId: string; toAccountId: string; amount: number; memo?: string }) => {
    if (!input.fromAccountId || !input.toAccountId || input.fromAccountId === input.toAccountId || input.amount <= 0) {
      setMessage('Transfer input is invalid.')
      return false
    }

    const reference = nextCode('TRF', entries.length)
    addEntry({
      id: `j${entries.length + 1}`,
      date: input.date,
      memo: input.memo?.trim() || `Balance transfer ${reference}`,
      reference,
      lines: [
        { accountId: input.toAccountId, debit: input.amount, credit: 0 },
        { accountId: input.fromAccountId, debit: 0, credit: input.amount },
      ],
    })
    setMessage('Balance transferred between accounts.')
    return true
  }

  return {
    accounts, parties, users, entries, invoices, payments, bankTransactions, dailyTransactions,
    balances, totals, receivable, payable, sessionUser, message, setMessage,
    addEntry, addAccount, addDailyTransaction, addInvoice, addPayment, transferBalance, login, register, changePassword, logout,
  }
}

export type AccountingStore = ReturnType<typeof useAccountingData>
export type AddAccountInput = { code: string; name: string; type: AccountType; openingBalance: number }
