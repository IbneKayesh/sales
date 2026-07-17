import { useState } from 'react'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody, PageCardFooter } from '../components/PageCard'
import Button from '../components/Button'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import InputCalendar from '../components/InputCalendar'
import Dropdown from '../components/Dropdown'
import GroupButton from '../components/GroupButton'
import Checkbox from '../components/Checkbox'
import DataTable from '../components/DataTable'
import Confirm from '../components/Confirm'
import { toast } from '../components/ToastBox'
import DataCard, { DataCardGrid } from '../components/DataCard'
import { IconUsers, IconDollar, IconBox, IconActivity, IconPhone, IconEdit, IconDelete, IconSave } from '../icons'

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
]

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'contributor', label: 'Contributor' },
]

const statusColors = {
  Active: { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' },
  Pending: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  Inactive: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
  Archived: { bg: 'rgba(107, 114, 128, 0.12)', color: '#6b7280' },
}

const StatusBadge = ({ status }) => {
  const colors = statusColors[status] || statusColors.Archived
  return (
    <span style={{
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
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: colors.color,
      }} />
      {status}
    </span>
  )
}

const ActionButtons = ({ row }) => (
  <span style={{ display: 'inline-flex', gap: 4 }}>
    <button
      onClick={(e) => { e.stopPropagation(); toast.info(`Editing ${row.name}`) }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        border: 'none',
        borderRadius: 5,
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        transition: 'all 0.12s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--code-bg)'; e.currentTarget.style.color = 'var(--text-h)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
    >
      <IconEdit size={14} />
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); toast.error(`Deleted ${row.name}`) }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        border: 'none',
        borderRadius: 5,
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        transition: 'all 0.12s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
    >
      <IconDelete size={14} />
    </button>
  </span>
)

const tableColumns = [
  { key: 'name', header: 'Name', width: '180px' },
  { key: 'email', header: 'Email', width: '240px' },
  { key: 'role', header: 'Role', width: '120px' },
  { 
    key: 'status', 
    header: 'Status', 
    width: '130px',
    render: (val) => <StatusBadge status={val} />,
  },
  { 
    key: 'actions', 
    header: 'Actions', 
    width: '100px', 
    sortable: false,
    render: (_, row) => <ActionButtons row={row} />,
  },
]

const tableData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Pending' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Contributor', status: 'Inactive' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Editor', status: 'Active' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'Archived' },
  { id: 7, name: 'Grace Wilson', email: 'grace@example.com', role: 'Admin', status: 'Active' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'Contributor', status: 'Pending' },
  { id: 9, name: 'Ivy Anderson', email: 'ivy@example.com', role: 'Editor', status: 'Active' },
  { id: 10, name: 'Jack Thomas', email: 'jack@example.com', role: 'Viewer', status: 'Active' },
  { id: 11, name: 'Kate Garcia', email: 'kate@example.com', role: 'Admin', status: 'Inactive' },
  { id: 12, name: 'Leo Martinez', email: 'leo@example.com', role: 'Contributor', status: 'Active' },
]

export default function HomePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    salary: '',
    birthDate: '',
    joinDate: '',
    status: '',
    role: 'editor',
    department: '',
  })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [allChecked, setAllChecked] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    toast.success('User details saved successfully!')
    setConfirmOpen(false)
  }

  const handleSaveClick = () => {
    setConfirmOpen(true)
  }

  const showInfo = () => toast.info('This is an informational message.')
  const showWarning = () => toast.warning('Please review your input data.')
  const showError = () => toast.error('An error occurred while processing your request.')

  return (
    <div className="home-page">
      {/* Overview Cards */}
      <DataCardGrid>
        <DataCard variant="secondary" icon={<IconUsers size={22} />} value="1,284" label="Total Users" badge="+12.5%" trend="up" />
        <DataCard variant="success" icon={<IconDollar size={22} />} value="$48,290" label="Revenue" badge="+8.2%" trend="up" />
        <DataCard variant="warning" icon={<IconBox size={22} />} value="643" label="Orders" badge="-3.1%" trend="down" />
        <DataCard variant="accent" icon={<IconActivity size={22} />} value="97.8%" label="Uptime" badge="+0.4%" trend="up" />
      </DataCardGrid>

      {/* Form Card */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="User Details"
            subtitle="Fill in the form below to manage user information"
          />
          <PageCardActions>
            <GroupButton
              options={[
                { value: 'edit', label: 'Edit' },
                { value: 'view', label: 'View' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={formData.role}
              name="role"
              onChange={handleChange}
              size="sm"
            />
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-4">
              <InputText
                label="First Name"
                placeholder="Enter first name"
                value={formData.firstName}
                name="firstName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-4">
              <InputText
                label="Last Name"
                placeholder="Enter last name"
                value={formData.lastName}
                name="lastName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-4">
              <InputText
                label="Email"
                placeholder="Enter email address"
                value={formData.email}
                name="email"
                onChange={handleChange}
                type="email"
                required
              />
            </div>
            <div className="col-span-4">
              <InputText
                label="Phone"
                placeholder="Enter phone number"
                value={formData.phone}
                name="phone"
                onChange={handleChange}
                icon={<IconPhone size={16} />}
              />
            </div>
            <div className="col-span-4">
              <InputNumber
                label="Age"
                placeholder="Age"
                value={formData.age}
                min={0}
                max={150}
                name="age"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-4">
              <InputNumber
                label="Salary"
                placeholder="Annual salary"
                value={formData.salary}
                min={0}
                step={1000}
                name="salary"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-4">
              <InputCalendar
                label="Birth Date"
                value={formData.birthDate}
                name="birthDate"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-4">
              <InputCalendar
                label="Join Date"
                value={formData.joinDate}
                name="joinDate"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-4">
              <Dropdown
                label="Status"
                options={statusOptions}
                value={formData.status}
                name="status"
                onChange={handleChange}
                placeholder="Select status..."
                searchable
                clearable
              />
            </div>
            <div className="col-span-4">
              <Dropdown
                label="Department"
                options={[
                  { value: 'engineering', label: 'Engineering' },
                  { value: 'design', label: 'Design' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'sales', label: 'Sales' },
                  { value: 'support', label: 'Customer Support' },
                  { value: 'hr', label: 'Human Resources' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'operations', label: 'Operations' },
                ]}
                value={formData.department}
                name="department"
                onChange={handleChange}
                placeholder="Select department..."
                searchable
              />
            </div>
          </div>
          <div className="home-page__checks">
            <Checkbox
              label="Subscribe to newsletter"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <Checkbox
              label="Agree to terms & conditions (indeterminate example)"
              indeterminate={indeterminate}
              onChange={() => {
                setIndeterminate(!indeterminate)
                setAllChecked(false)
              }}
            />
            <Checkbox
              label="Select all"
              checked={allChecked}
              onChange={() => setAllChecked(!allChecked)}
            />
          </div>
        </PageCardBody>
        <PageCardFooter>
          <Button variant="secondary" onClick={showInfo}>Info Toast</Button>
          <Button variant="secondary" onClick={showWarning}>Warning Toast</Button>
          <Button variant="secondary" onClick={showError}>Error Toast</Button>
          <Button variant="primary" onClick={handleSaveClick}>
            <IconSave size={16} />
            Save Changes
          </Button>
        </PageCardFooter>
      </PageCard>

      {/* Data Table Card */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Team Members"
            subtitle="View and manage all team members in your organization"
          />
        </PageCardHeader>
        <PageCardBody>
          <DataTable
            columns={tableColumns}
            data={tableData}
            pageSize={5}
            sortable
            searchable
            striped
            hoverable
            onRowClick={(row) => toast.info(`Selected: ${row.name}`)}
            emptyMessage="No team members found"
          />
        </PageCardBody>
      </PageCard>

      {/* Confirm Dialog */}
      <Confirm
        open={confirmOpen}
        title="Save Changes"
        message="Are you sure you want to save these user details? This action will update the user profile immediately."
        confirmText="Save"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleSubmit}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
