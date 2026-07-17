import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import Button from '../components/Button'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import InputCalendar from '../components/InputCalendar'
import Dropdown from '../components/Dropdown'
import DataTable from '../components/DataTable'
import Confirm from '../components/Confirm'
import { toast } from '../components/ToastBox'
import DataCard, { DataCardGrid } from '../components/DataCard'
import { IconClose, IconPlus, IconEdit, IconDelete, IconSave, IconDownload, IconDollar, IconBox, IconActivity } from '../icons'

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const badgeClass = (status) => {
  const map = {
    active: 'badge--success', completed: 'badge--success',
    pending: 'badge--warning',
    inactive: 'badge--danger', failed: 'badge--danger',
    archived: 'badge--muted', refunded: 'badge--muted',
  }
  return `badge ${map[status] || 'badge--muted'}`
}

function fmtCurrency(n) {
  const sign = n < 0 ? '-' : ''
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const StatusBadge = ({ status }) => (
  <span className={badgeClass(status)}>
    <span className="badge__dot" />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

const TypeBadge = ({ type }) => (
  <span className={`type-badge type-badge--${type}`}>
    {type === 'income' ? 'Income' : 'Expense'}
  </span>
)

const initialForm = {
  date: '',
  description: '',
  category: '',
  type: 'expense',
  amount: '',
  status: 'pending',
  userId: '',
}

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, users } = useApp()
  const [formMode, setFormMode] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')

  const totalRevenue = transactions
    .filter((t) => t.status === 'completed' && t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.status === 'completed' && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const pendingTxns = transactions.filter((t) => t.status === 'pending').length
  const failedTxns = transactions.filter((t) => t.status === 'failed').length
  const netIncome = totalRevenue - totalExpenses

  const displayedData = categoryFilter
    ? transactions.filter((t) => t.category === categoryFilter)
    : transactions

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
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
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
      setSaving(false)
    }
  }, [form, formMode, editingId, addTransaction, updateTransaction, closeForm, validate])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await new Promise((r) => setTimeout(r, 200))
      deleteTransaction(deleteTarget.id)
      toast.error(`Transaction "${deleteTarget.description}" has been deleted.`)
    } catch {
      toast.error('Failed to delete transaction.')
    } finally {
      setDeleteTarget(null)
    }
  }, [deleteTarget, deleteTransaction])

  const userOptions = users.map((u) => ({ value: String(u.id), label: u.name }))

  // Category filter options: unique categories from transactions
  const filterOptions = [
    { value: '', label: 'All Categories' },
    ...Array.from(new Set(transactions.map((t) => t.category))).map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ]

  const transactionColumns = [
    { key: 'id', header: 'ID', width: '60px' },
    { key: 'date', header: 'Date', width: '110px' },
    { key: 'description', header: 'Description', width: '240px' },
    {
      key: 'category',
      header: 'Category',
      width: '130px',
      render: (val) => (
        <span className="small">
          {val ? val.charAt(0).toUpperCase() + val.slice(1) : '—'}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '80px',
      render: (val) => <TypeBadge type={val} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '120px',
      render: (val, row) => {
        const sign = row.type === 'income' ? '+' : '-'
        const cls = `text-mono ${row.type === 'income' ? 'text-mono--success' : 'text-mono--danger'}`
        return <span className={cls}>{sign}{fmtCurrency(val)}</span>
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '90px',
      sortable: false,
      render: (_, row) => (
        <span className="d-inline-flex gap-1">
          <button type="button" className="action-btn" title="Edit"
            onClick={(e) => { e.stopPropagation(); openEditForm(row) }}>
            <IconEdit size={14} />
          </button>
          <button type="button" className="action-btn action-btn--danger" title="Delete"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(row) }}>
            <IconDelete size={14} />
          </button>
        </span>
      ),
    },
  ]

  return (
    <div className="txn-page">
      {/* Stats Cards */}
      <DataCardGrid>
        <DataCard variant="success" icon={<IconDollar size={22} />} value={fmtCurrency(totalRevenue)} label="Revenue (Completed)" badge="Income" trend="up" />
        <DataCard variant="danger" icon={<IconBox size={22} />} value={fmtCurrency(totalExpenses)} label="Expenses (Completed)" badge="Outflow" trend="down" />
        <DataCard variant="secondary" icon={<IconActivity size={22} />} value={fmtCurrency(netIncome)} label="Net Income" badge={netIncome >= 0 ? 'Profitable' : 'Loss'} trend={netIncome >= 0 ? 'up' : 'down'} valueStyle={{ color: netIncome >= 0 ? 'var(--success)' : 'var(--danger)' }} />
        <DataCard variant="warning" icon={<IconActivity size={22} />} value={pendingTxns + failedTxns} label="Pending + Failed" badge={failedTxns > 0 ? `${failedTxns} failed` : `${pendingTxns} pending`} trend="down" />
      </DataCardGrid>

      {/* Main Card */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Transactions"
            subtitle={`${transactions.length} records · Net ${fmtCurrency(netIncome)}`}
          />
          <PageCardActions>
            {formMode ? (
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            ) : (
              <>
                <Dropdown
                  options={filterOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  placeholder="All Categories"
                  className="txn__filter-dropdown"
                />
                <Button size="sm" variant="outline">
                  <IconDownload size={14} className="icon-left" />
                  Export
                </Button>
                <Button size="sm" onClick={openAddForm}>
                  <IconPlus size={14} className="icon-left" />
                  New Transaction
                </Button>
              </>
            )}
          </PageCardActions>
        </PageCardHeader>

        {formMode ? (
          <PageCardBody>
            <div className="form-wrap">
              <div className="grid">
                <div className="col-span-6">
                  <InputCalendar
                    label="Date"
                    value={form.date}
                    name="date"
                    onChange={handleFormChange}
                    error={formErrors.date}
                    required
                  />
                </div>
                <div className="col-span-6">
                  <InputText
                    label="Description"
                    placeholder="e.g. Office supplies - Staples"
                    value={form.description}
                    name="description"
                    onChange={handleFormChange}
                    error={formErrors.description}
                    required
                  />
                </div>
                <div className="col-span-6">
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
                  />
                </div>
                <div className="col-span-6">
                  <Dropdown
                    label="Category"
                    options={[
                      ...(form.type === 'income'
                        ? [{ value: 'revenue', label: 'Revenue' }]
                        : [
                          { value: 'software', label: 'Software & SaaS' },
                          { value: 'office', label: 'Office Supplies' },
                          { value: 'utilities', label: 'Utilities' },
                          { value: 'payroll', label: 'Payroll' },
                          { value: 'marketing', label: 'Marketing' },
                          { value: 'travel', label: 'Travel' },
                          { value: 'misc', label: 'Miscellaneous' },
                        ]),
                    ]}
                    value={form.category}
                    name="category"
                    onChange={handleFormChange}
                    placeholder="Select category..."
                    error={formErrors.category}
                    searchable
                  />
                </div>
                <div className="col-span-6">
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
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button variant="secondary" onClick={closeForm} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} loading={saving}>
                  <IconSave size={16} className="icon-left" />
                  {formMode === 'add' ? 'Create Transaction' : 'Update Transaction'}
                </Button>
              </div>
            </div>
          </PageCardBody>
        ) : (
          <PageCardBody>
            <DataTable
              columns={transactionColumns}
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

      <Confirm
        open={!!deleteTarget}
        title="Delete Transaction"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.description}" (${fmtCurrency(deleteTarget.amount)})? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}


