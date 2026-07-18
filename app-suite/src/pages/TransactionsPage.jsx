import { useState, useMemo, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useUI } from '../context/AppUIContext'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import Button from '../components/Button'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import InputCalendar from '../components/InputCalendar'
import Dropdown from '../components/Dropdown'
import DataTable from '../components/DataTable'
import DataCard, { DataCardGrid } from '../components/DataCard'
import { toast } from '../components/ToastBox'
import Badge from '../components/Badge'
import StatListItem from '../components/StatListItem'
import {
  IconClose, IconPlus, IconEdit, IconDelete, IconSave,
  IconDollar, IconBox, IconActivity, IconDownload,
  IconCheck, IconWarning, IconInfo,
} from '../icons'

/* ========================================================================
   Helpers
   ======================================================================== */

function fmtCurrency(n, fractionDigits = 2) {
  const sign = n < 0 ? '−' : ''
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ========================================================================
   Form state
   ======================================================================== */

const initialForm = {
  date: '',
  description: '',
  category: '',
  type: 'expense',
  amount: '',
  status: 'pending',
  userId: '',
}

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending',   label: 'Pending' },
  { value: 'failed',    label: 'Failed' },
  { value: 'refunded',  label: 'Refunded' },
]

/* ========================================================================
   Component
   ======================================================================== */

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, users } = useApp()
  const { totalRevenue, totalExpenses, pendingCount, failedCount } = useMemo(() => {
    const revenue = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const pending = transactions.filter((t) => t.status === 'pending').length
    const failed = transactions.filter((t) => t.status === 'failed').length
    return { totalRevenue: revenue, totalExpenses: expenses, pendingCount: pending, failedCount: failed }
  }, [transactions])
  const netIncome = totalRevenue - totalExpenses

  const [categoryFilter, setCategoryFilter] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const { confirm, alert, isBusy, setIsBusy } = useUI()

  // Column definitions — inside component to access openEditForm & handleDelete
  const txnColumns = [
    { key: 'date', header: 'Date', width: '110px', render: (v) => <span style={{ whiteSpace: 'nowrap' }}>{formatDate(v)}</span> },
    { key: 'description', header: 'Description', width: 'auto' },
    { key: 'category', header: 'Category', width: '120px', render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    { key: 'type', header: 'Type', width: '80px', render: (v) => <Badge type={v}>{v === 'income' ? 'Income' : 'Expense'}</Badge> },
    {
      key: 'amount',
      header: 'Amount',
      width: '110px',
      render: (v, row) => (
        <span className={`text-mono text-mono--${row.type === 'income' ? 'success' : 'danger'}`}>
          {row.type === 'income' ? '+' : '–'}{fmtCurrency(Math.abs(v), 2)}
        </span>
      ),
    },
    { key: 'status', header: 'Status', width: '110px', render: (v) => <Badge variant={v === 'completed' ? 'success' : v === 'pending' ? 'warning' : v === 'failed' ? 'danger' : 'muted'} icon={v === 'completed' ? <IconCheck size={12} /> : v === 'pending' ? <IconWarning size={12} /> : v === 'failed' ? <IconClose size={12} /> : <IconInfo size={12} />}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      width: '110px',
      sortable: false,
      render: (_, row) => (
        <span className="d-inline-flex gap-1">
          <Button variant="ghost" size="sm" title="Edit"
            onClick={(e) => { e.stopPropagation(); openEditForm(row) }}>
            <IconEdit size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="btn--icon-danger" title="Delete"
            onClick={(e) => { e.stopPropagation(); handleDelete(row) }}>
            <IconDelete size={14} />
          </Button>
        </span>
      ),
    },
  ]

  const displayedData = useMemo(() => {
    if (categoryFilter && categoryFilter !== 'all') {
      const cats = categoryFilter === 'income'
        ? transactions.filter((t) => t.type === 'income')
        : categoryFilter === 'expense'
          ? transactions.filter((t) => t.type === 'expense')
          : transactions.filter((t) => t.category === categoryFilter)
      return cats
    }
    return transactions
  }, [transactions, categoryFilter])

  const filterOptions = useMemo(() => [
    { value: 'all', label: 'All Transactions' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expenses' },
    ...Array.from(new Set(transactions.map((t) => t.category))).map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ], [transactions])

  const userOptions = useMemo(() =>
    users.map((u) => ({ value: String(u.id), label: u.name })),
    [users],
  )

  const openAddForm = useCallback(() => {
    setForm({ ...initialForm })
    setFormErrors({})
    setEditingId(null)
    setFormMode('add')
  }, [])

  const openEditForm = useCallback((txn) => {
    setForm({
      date: txn.date || '',
      description: txn.description || '',
      category: txn.category || '',
      type: txn.type || 'expense',
      amount: txn.amount != null ? String(txn.amount) : '',
      status: txn.status || 'pending',
      userId: txn.userId != null ? String(txn.userId) : '',
    })
    setFormErrors({})
    setEditingId(txn.id)
    setFormMode('edit')
  }, [])

  const closeForm = useCallback(() => {
    setFormMode(null)
    setEditingId(null)
    setForm(initialForm)
    setFormErrors({})
  }, [])

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  function validate() {
    const errors = {}
    if (!form.date) errors.date = 'Date is required'
    if (!form.description.trim()) errors.description = 'Description is required'
    if (!form.category) errors.category = 'Category is required'
    if (!form.amount) {
      errors.amount = 'Amount is required'
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      errors.amount = 'Must be a positive number'
    }
    if (!form.userId) errors.userId = 'User is required'
    return errors
  }

  const handleSave = useCallback(async () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.warning('Please fix the form errors before saving.')
      return
    }
    setIsBusy(true)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      const data = {
        ...form,
        amount: parseFloat(form.amount),
        userId: parseInt(form.userId, 10),
      }
      if (formMode === 'add') {
        addTransaction(data)
        toast.success(`Transaction "${form.description}" created!`)
      } else {
        updateTransaction(editingId, data)
        toast.success(`Transaction "${form.description}" updated!`)
      }
      closeForm()
    } catch {
      toast.error('An error occurred while saving.')
    } finally {
      setIsBusy(false)
    }
  }, [form, formMode, editingId, addTransaction, updateTransaction, closeForm, setIsBusy])

  const handleDelete = useCallback(async (txn) => {
    const confirmed = await confirm({
      title: 'Delete Transaction',
      message: `Are you sure you want to delete "${txn.description}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    })

    if (!confirmed) return

    setIsBusy(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      deleteTransaction(txn.id)
      setIsBusy(false)
      await alert({
        title: 'Transaction Deleted',
        message: `"${txn.description}" has been permanently removed from the system.`,
        variant: 'success',
        confirmText: 'Done',
      })
    } catch {
      setIsBusy(false)
      await alert({
        title: 'Deletion Failed',
        message: `An error occurred while deleting "${txn.description}". Please try again.`,
        variant: 'danger',
        confirmText: 'Dismiss',
      })
    }
  }, [deleteTransaction, confirm, alert, setIsBusy])

  return (
    <div className="page-wrap">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--sp-4)',
        flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{
            fontSize: 'var(--fs-2xl)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            Transactions
          </h2>
          <p style={{
            fontSize: 'var(--fs-sm)',
            color: 'var(--text-muted)',
            margin: 'var(--sp-1) 0 0',
          }}>
            {transactions.length} records &middot; Net {netIncome >= 0 ? '+' : '–'}{fmtCurrency(Math.abs(netIncome), 0)}
          </p>
        </div>
        {!formMode && (
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexShrink: 0 }}>
            <Dropdown
              options={filterOptions}
              value={categoryFilter || 'all'}
              onChange={(e) => setCategoryFilter(e.target.value === 'all' ? '' : e.target.value)}
              dense
            />
            <Button variant="secondary" size="sm">
              <IconDownload size={14} />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={openAddForm}>
              <IconPlus size={14} />
              New Transaction
            </Button>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <DataCardGrid>
        <DataCard
          variant="success"
          icon={<IconDollar size={22} />}
          value={fmtCurrency(totalRevenue, 0)}
          label="Revenue"
          badge="Income"
          trend="up"
        />
        <DataCard
          variant="danger"
          icon={<IconBox size={22} />}
          value={fmtCurrency(totalExpenses, 0)}
          label="Expenses"
          badge="Outflow"
          trend="down"
        />
        <DataCard
          variant="secondary"
          icon={<IconActivity size={22} />}
          value={fmtCurrency(netIncome, 0)}
          label="Net Income"
          badge={netIncome >= 0 ? 'Profitable' : 'Loss'}
          trend={netIncome >= 0 ? 'up' : 'down'}
          valueStyle={{ color: netIncome >= 0 ? 'var(--success)' : 'var(--danger)' }}
        />
        <DataCard
          variant="warning"
          icon={<IconActivity size={22} />}
          value={pendingCount + failedCount}
          label="Pending + Failed"
          badge={failedCount > 0 ? `${failedCount} failed` : `${pendingCount} pending`}
          trend={failedCount > 0 ? 'down' : undefined}
        />
      </DataCardGrid>

      {/* Main Content */}
      <div className="grid" style={{ gap: 'var(--sp-4)' }}>
        <div className={`col-span-${formMode ? '12' : '8'}`}>
          <PageCard>
            <PageCardHeader>
              <PageCardTitle
                title={formMode === 'add' ? 'New Transaction' : formMode === 'edit' ? 'Edit Transaction' : 'All Transactions'}
                subtitle={
                  formMode
                    ? `Fill in the details below to ${formMode === 'add' ? 'create' : 'update'} the transaction`
                    : `${displayedData.length} of ${transactions.length} records`
                }
              />
              {formMode && (
                <PageCardActions>
                  <Button variant="ghost" size="sm" onClick={closeForm} disabled={isBusy}>
                    <IconClose size={14} />
                    Cancel
                  </Button>
                </PageCardActions>
              )}
            </PageCardHeader>

            {formMode ? (
              <PageCardBody>
                <div className="form-wrap">
                  <div className="grid">
                    <div className="col-span-4">
                      <InputCalendar
                        label="Date"
                        value={form.date}
                        name="date"
                        onChange={handleFormChange}
                        error={formErrors.date}
                        required
                        disabled={isBusy}
                      />
                    </div>
                    <div className="col-span-8">
                      <InputText
                        label="Description"
                        placeholder="e.g. Office supplies — Staples"
                        value={form.description}
                        name="description"
                        onChange={handleFormChange}
                        error={formErrors.description}
                        required
                        disabled={isBusy}
                      />
                    </div>
                    <div className="col-span-4">
                      <Dropdown
                        label="Type"
                        options={[
                          { value: 'expense', label: 'Expense' },
                          { value: 'income', label: 'Income' },
                        ]}
                        value={form.type}
                        name="type"
                        onChange={(e) => {
                          handleFormChange(e)
                          if (e.target.value === 'income' && !form.category) {
                            setForm((prev) => ({ ...prev, category: 'revenue' }))
                          }
                        }}
                        disabled={isBusy}
                      />
                    </div>
                    <div className="col-span-4">
                      <Dropdown
                        label="Category"
                        options={
                          form.type === 'income'
                            ? [{ value: 'revenue', label: 'Revenue' }]
                            : [
                                { value: 'software', label: 'Software & SaaS' },
                                { value: 'office', label: 'Office Supplies' },
                                { value: 'utilities', label: 'Utilities' },
                                { value: 'payroll', label: 'Payroll' },
                                { value: 'marketing', label: 'Marketing' },
                                { value: 'travel', label: 'Travel' },
                                { value: 'misc', label: 'Miscellaneous' },
                              ]
                        }
                        value={form.category}
                        name="category"
                        onChange={handleFormChange}
                        placeholder="Select category..."
                        error={formErrors.category}
                        searchable
                        disabled={isBusy}
                      />
                    </div>
                    <div className="col-span-4">
                      <InputNumber
                        label="Amount"
                        placeholder="0.00"
                        value={form.amount}
                        name="amount"
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                            handleFormChange({ target: { name: 'amount', value: val } })
                          }
                        }}
                        error={formErrors.amount}
                        min={0}
                        step={0.01}
                        required
                        disabled={isBusy}
                      />
                    </div>
                    <div className="col-span-6">
                      <Dropdown
                        label="Assigned User"
                        options={userOptions}
                        value={form.userId}
                        name="userId"
                        onChange={handleFormChange}
                        placeholder="Select user..."
                        error={formErrors.userId}
                        searchable
                        disabled={isBusy}
                      />
                    </div>
                    <div className="col-span-6">
                      <Dropdown
                        label="Status"
                        options={statusOptions}
                        value={form.status}
                        name="status"
                        onChange={handleFormChange}
                        placeholder="Select status..."
                        disabled={isBusy}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <Button variant="secondary" onClick={closeForm} disabled={isBusy}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={isBusy}>
                      <IconSave size={16} />
                      {formMode === 'add' ? 'Create Transaction' : 'Update Transaction'}
                    </Button>
                  </div>
                </div>
              </PageCardBody>
            ) : (
              <PageCardBody>
                <DataTable
                  columns={txnColumns}
                  data={displayedData}
                  pageSize={8}
                  sortable
                  searchable
                  striped
                  hoverable
                  exportable
                  exportFilename="transactions-export.csv"
                  onRowClick={(row) => openEditForm(row)}
                  emptyMessage="No transactions found"
                />
              </PageCardBody>
            )}
          </PageCard>
        </div>

        {/* Sidebar — hidden when form is open */}
        {!formMode && (
          <div className="col-span-4">
            <PageCard>
              <PageCardHeader>
                <PageCardTitle
                  title="Summary"
                  subtitle="Financial breakdown"
                />
              </PageCardHeader>
              <PageCardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  <StatListItem label="Total Revenue" value={fmtCurrency(totalRevenue, 0)} sub={`${transactions.filter((t) => t.type === 'income').length} transactions`} color="var(--success)" />
                  <StatListItem label="Total Expenses" value={fmtCurrency(totalExpenses, 0)} sub={`${transactions.filter((t) => t.type === 'expense').length} transactions`} color="var(--danger)" />
                  <StatListItem label="Net Income" value={fmtCurrency(netIncome, 0)} sub={netIncome >= 0 ? 'Positive cash flow' : 'Negative cash flow'} color={netIncome >= 0 ? 'var(--success)' : 'var(--danger)'} />
                  <StatListItem label="Pending Review" value={pendingCount} sub={`${failedCount} failed require attention`} color={pendingCount > 0 || failedCount > 0 ? 'var(--warning)' : 'var(--text-muted)'} />
                </div>
              </PageCardBody>
            </PageCard>
          </div>
        )}
      </div>

      {/* Global Confirm dialog handles the confirmation UI via useUI().confirm() */}
    </div>
  )
}
