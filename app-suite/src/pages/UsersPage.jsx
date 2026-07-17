import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useUI } from '../context/AppUIContext'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import Button from '../components/Button'
import InputText from '../components/InputText'
import Dropdown from '../components/Dropdown'
import DataTable from '../components/DataTable'
import { toast } from '../components/ToastBox'
import Badge from '../components/Badge'
import { IconClose, IconPlus, IconEdit, IconDelete, IconCheck, IconSave, IconWarning, IconInfo } from '../icons'

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
  const { confirm, showLoading, hideLoading } = useUI()

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

    showLoading(
      formMode === 'add' ? 'Creating user...' : 'Updating user...',
      'Please wait, saving the data'
    )
    try {
      await new Promise((r) => setTimeout(r, 1200)) // simulate async

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
      hideLoading()
    }
  }, [form, formMode, editingId, addUser, updateUser, closeForm, validate, showLoading, hideLoading])

  const handleDelete = useCallback(async (user) => {
    const confirmed = await confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete "${user.name}"? This action cannot be undone and will permanently remove the user from the system.`,
      confirmText: 'Delete',
      variant: 'danger',
    })

    if (!confirmed) return

    showLoading(`Deleting "${user.name}"...`, 'Removing user from system')
    try {
      await new Promise((r) => setTimeout(r, 500))
      deleteUser(user.id)
      toast.error(`User "${user.name}" has been deleted.`)
    } catch {
      toast.error('Failed to delete user.')
    } finally {
      hideLoading()
    }
  }, [deleteUser, confirm, showLoading, hideLoading])

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
              borderRadius: 'var(--radius-md)',
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
      render: (val) => {
        const v = val || ''
        return <Badge variant={v === 'active' || v === 'completed' ? 'success' : v === 'pending' ? 'warning' : v === 'inactive' || v === 'failed' ? 'danger' : 'muted'} icon={v === 'active' || v === 'completed' ? <IconCheck size={12} /> : v === 'pending' ? <IconWarning size={12} /> : v === 'inactive' || v === 'failed' ? <IconClose size={12} /> : <IconInfo size={12} />}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
      },
    },
    {
      key: 'department',
      header: 'Department',
      width: '150px',
      render: (val) => {
        const dept = departmentOptions.find((d) => d.value === val)
        return <span className="small">{dept?.label || val || '—'}</span>
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '110px',
      sortable: false,
      render: (_, row) => (
        <span className="d-inline-flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              openEditForm(row)
            }}
            title="Edit user"
          >
            <IconEdit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="btn--icon-danger"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row)
            }}
            title="Delete user"
          >
            <IconDelete size={14} />
          </Button>
        </span>
      ),
    },
  ]

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="User Management"
            subtitle={`${users.length} users · ${roles.length} roles`}
          />
          <PageCardActions>
            {formMode ? (
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            ) : (
              <Button size="sm" onClick={openAddForm}>
                <IconPlus size={14} className="icon-left" />
                Add User
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>

        {formMode ? (
          /* ---- Create/Edit Form ---- */
          <PageCardBody>
            <div className="form-wrap">
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

              <div className="form-actions">
                <Button variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  <IconSave size={16} className="icon-left" />
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

      {/* Delete progress indicator */}
      {/* Global Confirm dialog handles the confirmation UI via useUI().confirm() */}
    </div>
  )
}
