import { useState } from 'react'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '@/components/PageCard'
import Button from '@/components/Button'
import InputText from '@/components/InputText'
import InputNumber from '@/components/InputNumber'
import InputCalendar from '@/components/InputCalendar'
import Dropdown from '@/components/Dropdown'
import GroupButton from '@/components/GroupButton'
import Checkbox from '@/components/Checkbox'
import DataTable from '@/components/DataTable'
import DataCard, { DataCardGrid } from '@/components/DataCard'
import { useUI } from '@/context/AppUIContext'
import FileUpload from '@/components/FileUpload'
import Progress from '@/components/Progress'
import LoadableCard from '@/components/LoadableCard'
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/Modal'
import SidePanel, { SidePanelHeader, SidePanelTitle, SidePanelBody, SidePanelFooter } from '@/components/SidePanel'
import SaveOverlay from '@/components/SaveOverlay'
import { toast } from '@/components/ToastBox'
import Badge from '@/components/Badge'
import EmptyState from '@/components/EmptyState'
import ErrorBoundary from '@/components/ErrorBoundary'
import ActionButton from '@/components/ActionButton'
import AuditData from '@/components/AuditData'
import StatListItem from '@/components/StatListItem'
import { IconUsers, IconDollar, IconBox, IconActivity, IconSave, IconCheck, IconClose, IconInfo, IconWarning, IconEdit, IconDelete, IconSearch, IconPhone } from '@/icons'

const sampleColumns = [
  { key: 'name', header: 'Name', width: '160px' },
  { key: 'email', header: 'Email', width: '200px' },
  { key: 'role', header: 'Role', width: '100px' },
  { key: 'status', header: 'Status', width: '100px', render: (v) => <Badge variant={v === 'active' ? 'success' : v === 'pending' ? 'warning' : 'danger'} icon={v === 'active' ? <IconCheck size={12} /> : v === 'pending' ? <IconWarning size={12} /> : <IconClose size={12} />}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge> },
  {
    key: 'actions',
    header: 'Actions',
    width: '110px',
    sortable: false,
    render: (_, row) => (
      <span style={{ display: 'inline-flex', gap: 'var(--sp-1)' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            toast.info(`Editing ${row.name}`)
          }}
          title="Edit"
        >
          <IconEdit size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="btn--icon-danger"
          onClick={(e) => {
            e.stopPropagation()
            toast.warning(`Deleting ${row.name}`)
          }}
          title="Delete"
        >
          <IconDelete size={14} />
        </Button>
      </span>
    ),
  },
]

const sampleData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'pending' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Contributor', status: 'inactive' },
]

export default function ExamplesPage() {
  const [inputValue, setInputValue] = useState('')
  const [numValue, setNumValue] = useState('')
  const [calValue, setCalValue] = useState('')
  const [ddValue, setDdValue] = useState('')
  const [groupValue, setGroupValue] = useState('edit')
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [files, setFiles] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelSide, setPanelSide] = useState('right')
  const { confirmBox: confirm, alertBox: alert, isBusy, setIsBusy } = useUI()
  const [saveLoading, setSaveLoading] = useState(false)
  const [inputRequired, setInputRequired] = useState('')
  const [inputWithIcon, setInputWithIcon] = useState('')
  const [inputError, setInputError] = useState('invalid@')
  const [numError, setNumError] = useState('-5')
  const [ddErrorVal, setDdErrorVal] = useState('')
  const [ddClearVal, setDdClearVal] = useState('')
  const [calErrorVal, setCalErrorVal] = useState('')
  const [checkedDisabled, setCheckedDisabled] = useState(true)
  const [statItems] = useState([
    { label: 'Total Revenue', value: '$52,400', sub: '+12.5% vs last month', color: 'var(--success)' },
    { label: 'Active Users', value: '1,024', sub: '86 new this week', color: 'var(--primary)' },
    { label: 'Bounce Rate', value: '24.3%', sub: '-3.2% improvement', color: 'var(--warning)' },
    { label: 'Avg. Response', value: '1.2s', sub: '98th percentile', color: 'var(--accent)' },
  ])
  const [actionRow] = useState({ prods_cname: 'Production Line A', prods_actve: true })
  const [inactiveRow] = useState({ prods_cname: 'Production Line B', prods_actve: false })

  const handleSaveWithProgress = () => {
    if (saveLoading) return
    setSaveLoading(true)
    setTimeout(() => {
      setSaveLoading(false)
      toast.success('Data saved successfully!')
    }, 2000)
  }

  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState(null)
  const [cardData, setCardData] = useState(null)

  const simulateLoad = () => {
    setCardData(null)
    setCardError(null)
    setCardLoading(true)
    setTimeout(() => {
      setCardData([
        { id: 1, metric: 'Total Revenue', value: '$52,400' },
        { id: 2, metric: 'Active Users', value: '1,024' },
        { id: 3, metric: 'Orders', value: '312' },
        { id: 4, metric: 'Conversion', value: '3.2%' },
        { id: 5, metric: 'Avg. Session', value: '4m 12s' },
      ])
      setCardLoading(false)
    }, 2500)
  }

  const simulateError = () => {
    setCardData(null)
    setCardLoading(false)
    setCardError('Failed to load data. The server returned a 500 error. Please try again.')
  }

  const ddOptions = [
    { value: 'option1', label: 'Option One' },
    { value: 'option2', label: 'Option Two' },
    { value: 'option3', label: 'Option Three' },
  ]

  return (
    <div className="page-wrap">
      {/* ── Section: Data Cards ── */}
      <DataCardGrid cols={4}>
        <DataCard variant="secondary" icon={<IconUsers size={22} />} value="1,284" label="Total Users" badge="+12.5%" trend="up" />
        <DataCard variant="success" icon={<IconDollar size={22} />} value="$48,290" label="Revenue" badge="+8.2%" trend="up" />
        <DataCard variant="warning" icon={<IconBox size={22} />} value="643" label="Orders" badge="-3.1%" trend="down" />
        <DataCard variant="accent" icon={<IconActivity size={22} />} value="97.8%" label="Uptime" badge="+0.4%" trend="up" />
      </DataCardGrid>

      {/* ── Section: Form Inputs & Controls ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Form Inputs & Controls" subtitle="All form input components in action" />
          <PageCardActions>
            <GroupButton
              options={[
                { value: 'edit', label: 'Edit' },
                { value: 'view', label: 'View' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={groupValue}
              name="role"
              onChange={(e) => setGroupValue(e.target.value)}
              size="sm"
            />
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-3">
              <InputText label="Text Input" placeholder="Enter text..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
            <div className="col-span-3">
              <InputNumber label="Number Input" placeholder="0" value={numValue} onChange={(e) => setNumValue(e.target.value)} min={0} />
            </div>
            <div className="col-span-3">
              <InputCalendar label="Calendar" value={calValue} name="cal" onChange={(e) => setCalValue(e.target.value)} />
            </div>
            <div className="col-span-3">
              <Dropdown label="Dropdown" options={ddOptions} value={ddValue} onChange={(e) => setDdValue(e.target.value)} placeholder="Select..." />
            </div>
          </div>
          <div className="home-page__checks">
            <Checkbox label="Checkbox example" checked={checked1} onChange={() => setChecked1(!checked1)} />
            <Checkbox label="Indeterminate checkbox" indeterminate={true} checked={checked2} onChange={() => setChecked2(!checked2)} />
            <Checkbox label="Disabled checkbox" checked={checkedDisabled} disabled onChange={() => {}} />
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Input States (error, required, dense, disabled, icons) ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Input States & Variants" subtitle="Error, required, dense, disabled, readOnly, and icon variants for all form inputs" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            {/* Error states */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Error</h4>
              <InputText label="Email" value={inputError} onChange={(e) => setInputError(e.target.value)} error="Invalid email format" placeholder="email@example.com" />
              <InputNumber label="Age" value={numError} onChange={(e) => setNumError(e.target.value)} error="Must be 0 or higher" min={0} />
              <Dropdown label="Category" options={ddOptions} value={ddErrorVal} onChange={(e) => setDdErrorVal(e.target.value)} error="Please select a category" placeholder="Select..." />
              <InputCalendar label="Date" value={calErrorVal} name="cal-err" onChange={(e) => setCalErrorVal(e.target.value)} error="Date is required" />
            </div>

            {/* Required & Dense */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Required &amp; Dense</h4>
              <InputText label="Full Name" value={inputRequired} onChange={(e) => setInputRequired(e.target.value)} required placeholder="Required field" />
              <InputText label="Compact" dense placeholder="Dense variant" />
              <Dropdown label="Priority" options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]} placeholder="Select..." dense />
              <InputNumber label="Quantity" dense placeholder="0" />
              <InputCalendar label="Date (DD/MM/YYYY)" dense format="DD/MM/YYYY" />
            </div>

            {/* Disabled & Icons */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Disabled &amp; Icons</h4>
              <InputText label="Username" value="john.doe" disabled />
              <InputText
                label="Search"
                value={inputWithIcon}
                onChange={(e) => setInputWithIcon(e.target.value)}
                icon={<IconSearch size={14} />}
                placeholder="Search..."
              />
              <InputText
                label="Phone"
                icon={<IconPhone size={14} />}
                placeholder="+1 (555) 000-0000"
              />
              <Dropdown label="Status" options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]} value={ddClearVal} onChange={(e) => setDdClearVal(e.target.value)} clearable placeholder="Clearable..." />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Buttons ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Button Variants & Sizes" subtitle="All button variants and size options" />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)', alignItems: 'center' }}>
            <Button variant="primary" size="sm">Primary Sm</Button>
            <Button variant="primary" size="md">Primary Md</Button>
            <Button variant="primary" size="lg">Primary Lg</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="outline" size="sm">Outline</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="danger" size="sm">Danger</Button>
            <Button variant="primary" size="sm" loading>Saving</Button>
            <Button variant="primary" size="sm" disabled>Disabled</Button>
            <Button variant="secondary" size="sm" onClick={() => toast.info('Info toast')}>Toast Info</Button>
            <Button variant="secondary" size="sm" onClick={() => toast.success('Success toast')}>Toast Success</Button>
            <Button variant="secondary" size="sm" onClick={() => toast.warning('Warning toast')}>Toast Warning</Button>
            <Button variant="secondary" size="sm" onClick={() => toast.error('Error toast')}>Toast Error</Button>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Data Table ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Data Table" subtitle="Searchable, sortable, exportable table with striped rows" />
        </PageCardHeader>
        <PageCardBody>
          <DataTable
            columns={sampleColumns}
            data={sampleData}
            pageSize={4}
            sortable
            searchable
            striped
            hoverable
            exportable
            exportFilename="example-export.csv"
            emptyMessage="No data"
          />
        </PageCardBody>
      </PageCard>

      {/* ── Section: Badge Variants ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Badge & Type-Badge Variants" subtitle="All badge variants — dots, icons, type badges, and edge cases" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            {/* Dot badges — all variants */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Dot Indicators
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Badge variant="success" dot>Success</Badge>
                <Badge variant="warning" dot>Warning</Badge>
                <Badge variant="danger" dot>Danger</Badge>
                <Badge variant="muted" dot>Muted</Badge>
              </div>
            </div>

            {/* Icon badges — all variants */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Icon Enhanced
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Badge variant="success" icon={<IconCheck size={12} />}>Completed</Badge>
                <Badge variant="warning" icon={<IconWarning size={12} />}>Pending</Badge>
                <Badge variant="danger" icon={<IconClose size={12} />}>Failed</Badge>
                <Badge variant="muted" icon={<IconInfo size={12} />}>Draft</Badge>
              </div>
            </div>

            {/* Type badges */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Type Badges
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Badge type="income">Income</Badge>
                <Badge type="expense">Expense</Badge>
              </div>
              <div className="small" style={{ color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
                Pill-shaped uppercase badges for transaction types
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--sp-5) 0' }} />

          {/* Extended: Icon + Dot edge case, extra variants, inline usage */}
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            {/* Extra variants */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Extra Variants
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Badge variant="primary" dot>Primary</Badge>
                <Badge variant="info" dot>Info</Badge>
                <Badge variant="accent" dot>Accent</Badge>
              </div>
              <div className="small" style={{ color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
                Use when more color cues are needed
              </div>
            </div>

            {/* Dot + Icon combined (rare — stacked indicators) */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Dot + Icon (Edge Case)
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Badge variant="success" dot icon={<IconCheck size={12} />}>Both</Badge>
                <Badge variant="warning" dot icon={<IconWarning size={12} />}>Both</Badge>
                <Badge variant="danger" dot icon={<IconClose size={12} />}>Both</Badge>
              </div>
              <div className="small" style={{ color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
                Dot then icon then label — usually pick one indicator
              </div>
            </div>

            {/* Inline with text */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Inline Usage
              </h4>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Status: <Badge variant="success" icon={<IconCheck size={10} />}>Active</Badge> &middot;
                Role: <Badge variant="info" dot>Admin</Badge>
              </div>
              <div className="small" style={{ color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
                Badges sit inline with surrounding content
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Progress Indicators ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Progress Indicators" subtitle="Determinate and indeterminate progress bars for loading states and API calls" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-primary)' }}>Sizes</h4>
              <Progress size="sm" label="Small" value={33} description="Compact for inline use" />
              <Progress size="md" label="Medium" value={55} description="Default size for forms and cards" />
              <Progress size="lg" label="Large" value={77} description="Prominent for full-page loading" />
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-primary)' }}>Color Variants</h4>
              <Progress variant="primary" label="Primary" value={42} />
              <Progress variant="success" label="Success" value={88} />
              <Progress variant="warning" label="Warning" value={64} />
              <Progress variant="danger" label="Danger" value={25} />
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-primary)' }}>Indeterminate — Scanning Bar</h4>
              <Progress indeterminate size="sm" label="Fetching users..." description="Request in progress — no progress known" />
              <Progress indeterminate size="md" label="Uploading files..." variant="success" />
              <Progress indeterminate size="lg" label="Processing report" variant="warning" description="This may take a few seconds" />
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-primary)' }}>Pulse — Soft Breathing</h4>
              <Progress pulse size="sm" label="Connecting to server..." description="Softer visual — full bar pulses opacity" />
              <Progress pulse size="md" label="Syncing data..." variant="success" />
              <Progress pulse size="lg" label="Running background job" variant="warning" description="Pulse variant is gentler on the eyes" />
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-primary)' }}>Edge Cases</h4>
              <Progress label="No label shown" value={100} showValue={false} description="showValue disabled, value at 100%" />
              <Progress label="Zero percent" value={0} variant="warning" />
              <Progress label="Hidden value text" value={50} showValue={false} />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Save with Overlay Modal ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Save with Overlay" subtitle="Click Save to see a full overlay popup — simulates a 2s API call" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-4">
              <InputText label="Project Name" placeholder="Enter project name" />
            </div>
            <div className="col-span-4">
              <Dropdown label="Priority" options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]} placeholder="Select priority..." />
            </div>
            <div className="col-span-4" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                loading={saveLoading}
                onClick={handleSaveWithProgress}
              >
                <IconSave size={14} className="icon-left" />
                Save Project
              </Button>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* Overlay Modal — appears when saving */}
      <SaveOverlay
        open={saveLoading}
        title="Please wait, saving the data"
        message="Your project is being saved. This will only take a moment."
        progressLabel="Saving project..."
      />

      {/* ── Section: Global UI Controls ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Global UI Controls"
            subtitle="Alert dialog, busy state, and loading overlay — accessible app-wide via useUI()"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            {/* Alert demo */}
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Alert Dialog
              </h4>
              <p className="small" style={{ margin: 0, color: 'var(--text-muted)' }}>
                Show a single-button modal that waits for user acknowledgment.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Button size="sm" variant="outline" onClick={async () => {
                  await alert({ title: 'Information', message: 'This is an informational alert. Click OK to dismiss.', variant: 'primary' })
                  toast.success('Alert acknowledged')
                }}>
                  <IconInfo size={14} className="icon-left" />
                  Info Alert
                </Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  await alert({ title: 'Success', message: 'Operation completed successfully!', variant: 'success', confirmText: 'Great!' })
                  toast.success('Success alert acknowledged')
                }}>
                  <IconCheck size={14} className="icon-left" />
                  Success Alert
                </Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  await alert({ title: 'Warning', message: 'Please review your input before proceeding.', variant: 'warning' })
                  toast.success('Warning alert acknowledged')
                }}>
                  <IconWarning size={14} className="icon-left" />
                  Warning Alert
                </Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  await alert({ title: 'Error', message: 'An unexpected error occurred. Please try again.', variant: 'danger', confirmText: 'Dismiss' })
                  toast.success('Error alert acknowledged')
                }}>
                  <IconClose size={14} className="icon-left" />
                  Error Alert
                </Button>
              </div>
            </div>

            {/* isBusy demo */}
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                Busy State
              </h4>
              <p className="small" style={{ margin: 0, color: 'var(--text-muted)' }}>
                Set <code>isBusy</code> to block UI interactions during critical operations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {/* Busy indicator badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <Badge variant={isBusy ? 'warning' : 'success'} dot>
                    {isBusy ? 'Busy' : 'Idle'}
                  </Badge>
                  <span className="small" style={{ color: isBusy ? 'var(--warning)' : 'var(--success)' }}>
                    {isBusy ? 'UI is currently blocked' : 'UI is free to interact'}
                  </span>
                </div>

                {/* Demo form inputs that disable when busy */}
                <div className="grid" style={{ gap: 'var(--sp-2)' }}>
                  <div className="col-span-6">
                    <InputText
                      label="Username"
                      placeholder="Enter username"
                      disabled={isBusy}
                    />
                  </div>
                  <div className="col-span-6">
                    <Dropdown
                      label="Action"
                      options={[
                        { value: 'save', label: 'Save' },
                        { value: 'delete', label: 'Delete' },
                        { value: 'export', label: 'Export' },
                      ]}
                      placeholder="Select action..."
                      disabled={isBusy}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={isBusy}
                    onClick={async () => {
                      setIsBusy(true)
                      try {
                        await new Promise((r) => setTimeout(r, 2000))
                        toast.success('Operation completed! Use setIsBusy(false) to release the UI.')
                      } finally {
                        setIsBusy(false)
                      }
                    }}
                  >
                    <IconSave size={14} className="icon-left" />
                    Simulate 2s API Call
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!isBusy}
                    onClick={() => {
                      setIsBusy(false)
                      toast.info('Busy state released manually')
                    }}
                  >
                    Release Busy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: File Upload ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="File Upload" subtitle="Drag & drop or browse files with preview" />
        </PageCardHeader>
        <PageCardBody>
          <FileUpload
            label="Upload Documents"
            value={files}
            onChange={setFiles}
            multiple
            accept="image/*,.pdf,.csv"
            maxSize={5 * 1024 * 1024}
            hint="Accepted: images, PDF, CSV — max 5MB"
          />
        </PageCardBody>
      </PageCard>

      {/* ── Section: Loadable Card ── */}
      <LoadableCard
        title="Dashboard Overview"
        subtitle={cardData ? `Last updated — ${new Date().toLocaleTimeString()}` : 'Click "Load Data" to fetch'}
        loading={cardLoading}
        error={cardError}
        loaderLabel="Fetching dashboard data..."
      >
        {cardData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="grid" style={{ gap: 'var(--sp-3)' }}>
              {cardData.map((item) => (
                <div key={item.id} className="col-span-6" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-lg)',
                }}>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{item.metric}</span>
                  <span style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--sp-4)',
            padding: 'var(--sp-8) 0',
            color: 'var(--text-muted)',
          }}>
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>No data loaded yet</p>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              <Button size="sm" variant="primary" onClick={simulateLoad}>
                Load Data
              </Button>
              <Button size="sm" variant="outline" onClick={simulateError}>
                Simulate Error
              </Button>
            </div>
          </div>
        )}
      </LoadableCard>

      {/* ── Section: Error Boundary & Empty States ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Error Boundary & Empty States" subtitle="ErrorBoundary catches render errors; EmptyState shows contextual placeholder UI" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>No Data</h4>
              <EmptyState
                variant="noData"
                title="No records found"
                message="There are no items to display in this view. Create a new record to get started."
                action={<Button size="xs" variant="primary" onClick={() => toast.info('Create new record')}>Create New</Button>}
              />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>No Results</h4>
              <EmptyState
                variant="noResults"
                title="No results found"
                message="Your search did not match any items. Try adjusting your filters or search terms."
                action={<Button size="xs" variant="outline" onClick={() => toast.info('Clearing filters')}>Clear Filters</Button>}
              />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Error / Success / Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                <EmptyState variant="error" compact title="Connection failed" message="Unable to reach the server. Check your network." />
                <EmptyState variant="success" compact title="All systems operational" message="All services are running normally." />
                <EmptyState variant="info" compact title="Scheduled maintenance" message="The system will be down for 2 hours tonight." />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--sp-5) 0' }} />

          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Error Boundary (simulated)</h4>
              <ErrorBoundary
                title="Oops, something broke"
                message="This component caught a simulated error and displayed this fallback instead of crashing the entire page."
              >
                <div style={{ padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Wrap any component with &lt;ErrorBoundary&gt; to catch render errors gracefully.
                </div>
              </ErrorBoundary>
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Custom Fallback</h4>
              <ErrorBoundary
                fallback={({ retry }) => (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--sp-3)',
                    padding: 'var(--sp-6)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--surface-alt)',
                  }}>
                    <IconWarning size={24} style={{ color: 'var(--warning)' }} />
                    <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                      Custom error fallback with a retry button.
                    </p>
                    <Button size="xs" variant="primary" onClick={retry}>Retry</Button>
                  </div>
                )}
              >
                <div style={{ padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  This content is wrapped with a custom fallback.
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Stat List Items ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Stat List Items" subtitle="Label, value, sub-text, and colored dot indicator" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Dashboard Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {statItems.map((item, i) => (
                  <StatListItem key={i} label={item.label} value={item.value} sub={item.sub} color={item.color} />
                ))}
              </div>
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Custom Colors</h4>
              <StatListItem label="Server Uptime" value="99.97%" sub="Last 30 days" color="var(--success)" />
              <StatListItem label="Error Rate" value="0.03%" sub="Within threshold" color="var(--danger)" />
              <StatListItem label="Queue Depth" value="12" sub="2 pending, 10 processed" color="var(--info)" />
              <StatListItem label="Cache Hit Rate" value="94.2%" sub="+2.1% from last week" color="var(--accent)" />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Audit Data ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Audit Data" subtitle="Audit trail row showing active status, created by/date, updated by/date, and revision number" />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <AuditData
              actve={true}
              cname="Admin User"
              cdate="2026-01-15T08:30:00"
              uname="Admin User"
              udate="2026-07-19T14:22:00"
              rvnmr={3}
            />
            <AuditData
              actve={false}
              cname="Jane Smith"
              cdate="2026-03-22T10:15:00"
              uname="Admin User"
              udate="2026-06-10T09:45:00"
              rvnmr={7}
            />
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', paddingLeft: 'var(--sp-2)' }}>
              Columns: Status | Created By | Created Date | Updated By | Updated Date | Revision
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Action Buttons ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Action Buttons" subtitle="Row action buttons for Edit, Activate, and Deactivate — shown conditionally based on active state" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                Active Row — shows Deactivate button
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--sp-3) var(--sp-4)',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <Badge variant="success" dot>{actionRow.prods_cname}</Badge>
                </div>
                <ActionButton
                  rowData={actionRow}
                  actve={actionRow.prods_actve}
                  onEdit={(row) => toast.info(`Editing ${row.prods_cname}`)}
                  onDelete={(row) => toast.warning(`${row.prods_cname} deactivated`)}
                />
              </div>
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
                Inactive Row — shows Activate button
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--sp-3) var(--sp-4)',
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <Badge variant="danger" dot>{inactiveRow.prods_cname}</Badge>
                </div>
                <ActionButton
                  rowData={inactiveRow}
                  actve={inactiveRow.prods_actve}
                  onEdit={(row) => toast.info(`Editing ${row.prods_cname}`)}
                  onDelete={(row) => toast.success(`${row.prods_cname} activated`)}
                />
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Modal / SidePanel / Confirm ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Overlay Components" subtitle="Modal, SidePanel, and Confirm dialogs" />
          <PageCardActions>
            <Button size="sm" variant="outline" onClick={() => { setPanelSide('left'); setPanelOpen(true) }}>
              Open Left Panel
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setPanelSide('right'); setPanelOpen(true) }}>
              Open Right Panel
            </Button>
            <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
            <Button size="sm" variant="danger" onClick={async () => {
              const confirmed = await confirm({
                title: 'Delete Item',
                message: 'Are you sure you want to delete this item? This action cannot be undone.',
                confirmText: 'Delete',
                variant: 'danger',
              })
              if (confirmed) {
                toast.error('Item deleted!')
              }
            }}>
              Open Confirm
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Click the buttons above to open each overlay component. The Modal slides in centered with a backdrop blur.
            The SidePanel slides in from the left or right edge. The Confirm dialog is a compact action confirmation.
          </p>
        </PageCardBody>
      </PageCard>

      {/* ── Modal ── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle
            title="Example Modal"
            subtitle="This modal demonstrates the Modal component with Header, Body, and Footer"
            onClose={() => setModalOpen(false)}
          />
        </ModalHeader>
        <ModalBody>
          <div className="grid">
            <div className="col-span-6">
              <InputText label="First Name" placeholder="Enter first name" />
            </div>
            <div className="col-span-6">
              <InputText label="Last Name" placeholder="Enter last name" />
            </div>
            <div className="col-span-6">
              <InputText label="Email" placeholder="Enter email" type="email" />
            </div>
            <div className="col-span-6">
              <Dropdown label="Role" options={ddOptions} placeholder="Select role..." />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => { toast.success('Saved!'); setModalOpen(false) }}>
            <IconSave size={14} className="icon-left" />
            Save
          </Button>
        </ModalFooter>
      </Modal>

      {/* ── SidePanel ── */}
      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} position={panelSide} size="md">
        <SidePanelHeader>
          <SidePanelTitle
            title={`${panelSide === 'left' ? 'Left' : 'Right'} Panel`}
            subtitle="SidePanel slides in from the edge with a full form layout"
            onClose={() => setPanelOpen(false)}
          />
        </SidePanelHeader>
        <SidePanelBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <InputText label="Full Name" placeholder="Enter name" required />
            <InputText label="Email" placeholder="Enter email" type="email" required />
            <InputText label="Phone" placeholder="Enter phone" />
            <Dropdown label="Department" options={ddOptions} placeholder="Select..." />
            <InputNumber label="Age" placeholder="0" min={0} />
            <InputCalendar label="Date of Birth" />
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button variant="secondary" size="sm" onClick={() => setPanelOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => { toast.success('Panel saved!'); setPanelOpen(false) }}>
            <IconSave size={14} className="icon-left" />
            Save
          </Button>
        </SidePanelFooter>
      </SidePanel>


    </div>
  )
}
