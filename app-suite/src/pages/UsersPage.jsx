import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import Button from '../components/Button'
import InputText from '../components/InputText'
import Dropdown from '../components/Dropdown'
import DataTable from '../components/DataTable'
import Confirm from '../components/Confirm'
import { toast } from '../components/ToastBox'
import { IconClose, IconPlus, IconEdit, IconDelete, IconCheck, IconSave } from '../icons'

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
]

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Customer Support' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
]

const statusColors = {
  active: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' },
  pending: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  inactive: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
  archived: { bg: 'rgba(107, 114, 128, 0.12)', color: '#6b7280' },
}

const StatusBadge = ({ status }) => {
  const colors = statusColors[status] || statusColors.archived
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 10px',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '20px',
        borderRadius: 100,
        background: colors.bg,
        color: colors.color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors.color,
        }}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  status: 'pending',
}

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser, roles } = useApp()
  const [formMode, setFormMode] = useState(null) // null | 'add' | 'edit'
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openAddForm = useCallback(() => {
    setForm({ ...initialForm })
    setFormErrors({})
    setEditingId(null)
    setFormMode('add')
  }, [])

  const openEditForm = useCallback((user) => {
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      role: user.role || '',
      status: user.status || 'pending',
    })
    setFormErrors({})
    setEditingId(user.id)
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
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format'
    }
    if (!form.role) errors.role = 'Role is required'
    if (!form.department) errors.department = 'Department is required'
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
      await new Promise((r) => setTimeout(r, 300)) // simulate async

      if (formMode === 'add') {
        addUser(form)
        toast.success(`User "${form.name}" created successfully!`)
      } else if (formMode === 'edit') {
        updateUser(editingId, form)
        toast.success(`User "${form.name}" updated successfully!`)
      }
      closeForm()
    } catch {
      toast.error('An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }, [form, formMode, editingId, addUser, updateUser, closeForm, validate])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await new Promise((r) => setTimeout(r, 200))
      deleteUser(deleteTarget.id)
      toast.error(`User "${deleteTarget.name}" has been deleted.`)
    } catch {
      toast.error('Failed to delete user.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, deleteUser])

  const userColumns = [
    { key: 'name', header: 'Name', width: '180px' },
    { key: 'email', header: 'Email', width: '220px' },
    {
      key: 'role',
      header: 'Role',
      width: '130px',
      render: (val) => {
        const role = roles.find((r) => r.value === val)
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: 5,
              background: role ? `${role.color}18` : 'var(--code-bg)',
              color: role?.color || 'var(--text)',
            }}
          >
            {role?.label || val || '—'}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'department',
      header: 'Department',
      width: '150px',
      render: (val) => {
        const dept = departmentOptions.find((d) => d.value === val)
        return <span style={{ fontSize: '13px', color: 'var(--text)' }}>{dept?.label || val || '—'}</span>
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '110px',
      sortable: false,
      render: (_, row) => (
        <span style={{ display: 'inline-flex', gap: 4 }}>
          <button
            type="button"
            className="users__action-btn"
            onClick={(e) => {
              e.stopPropagation()
              openEditForm(row)
            }}
            title="Edit user"
          >
            <IconEdit size={14} />
          </button>
          <button
            type="button"
            className="users__action-btn users__action-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteTarget(row)
            }}
            title="Delete user"
          >
            <IconDelete size={14} />
          </button>
        </span>
      ),
    },
  ]

  return (
    <div className="users-page">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="User Management"
            subtitle={`${users.length} users · ${roles.length} roles`}
          />
          <PageCardActions>
            {formMode ? (
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <IconClose size={14} style={{ marginRight: 4 }} />
                Cancel
              </Button>
            ) : (
              <Button size="sm" onClick={openAddForm}>
                <IconPlus size={14} style={{ marginRight: 4 }} />
                Add User
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>

        {formMode ? (
          /* ---- Create/Edit Form ---- */
          <PageCardBody>
            <div className="users__form-wrap">
              <div className="grid">
                <div className="col-span-6">
                  <InputText
                    label="Full Name"
                    placeholder="Enter full name"
                    value={form.name}
                    name="name"
                    onChange={handleFormChange}
                    error={formErrors.name}
                    required
                  />
                </div>
                <div className="col-span-6">
                  <InputText
                    label="Email"
                    placeholder="Enter email address"
                    value={form.email}
                    name="email"
                    onChange={handleFormChange}
                    error={formErrors.email}
                    type="email"
                    required
                  />
                </div>
                <div className="col-span-6">
                  <InputText
                    label="Phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    name="phone"
                    onChange={handleFormChange}
                  />
                </div>
                <div className="col-span-6">
                  <Dropdown
                    label="Department"
                    options={departmentOptions}
                    value={form.department}
                    name="department"
                    onChange={handleFormChange}
                    placeholder="Select department..."
                    error={formErrors.department}
                    searchable
                  />
                </div>
                <div className="col-span-6">
                  <Dropdown
                    label="Role"
                    options={roles.map((r) => ({ value: r.value, label: r.label }))}
                    value={form.role}
                    name="role"
                    onChange={handleFormChange}
                    placeholder="Select role..."
                    error={formErrors.role}
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

              {/* Role permissions preview */}
              {form.role && (() => {
                const role = roles.find((r) => r.value === form.role)
                if (!role) return null
                return (
                  <div className="users__permissions-preview">
                    <span className="users__permissions-label">
                      Permissions for <strong>{role.label}</strong>:
                    </span>
                    <div className="users__permissions-list">
                      {role.permissions.map((perm) => (
                        <span key={perm} className="users__permission-tag">
                          <IconCheck size={12} />
                          {perm.charAt(0).toUpperCase() + perm.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })()}

              <div className="users__form-actions">
                <Button variant="secondary" onClick={closeForm} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} loading={saving}>
                  <IconSave size={16} style={{ marginRight: 4 }} />
                  {formMode === 'add' ? 'Create User' : 'Update User'}
                </Button>
              </div>
            </div>
          </PageCardBody>
        ) : (
          /* ---- Data Table ---- */
          <PageCardBody>
            <DataTable
              columns={userColumns}
              data={users}
              pageSize={8}
              sortable
              searchable
              striped
              hoverable
              exportable
              exportFilename="users-export.csv"
              onRowClick={(row) => openEditForm(row)}
              emptyMessage="No users found"
            />
          </PageCardBody>
        )}
      </PageCard>

      {/* Delete Confirmation */}
      <Confirm
        open={!!deleteTarget}
        title="Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone and will permanently remove the user from the system.`
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
