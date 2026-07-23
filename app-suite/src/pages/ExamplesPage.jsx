import { useState, useEffect, useCallback } from 'react'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody, PageCardFooter } from '@/components/PageCard'
import Button from '@/components/Button'
import InputText from '@/components/InputText'
import InputNumber from '@/components/InputNumber'
import InputCalendar from '@/components/InputCalendar'
import InputLabel from '@/components/InputLabel'
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
import Confirm from '@/components/Confirm'
import SaveOverlay from '@/components/SaveOverlay'
import { toast } from '@/components/ToastBox'
import Badge from '@/components/Badge'
import EmptyState from '@/components/EmptyState'
import ErrorBoundary from '@/components/ErrorBoundary'
import ActionButton from '@/components/ActionButton'
import AuditData from '@/components/AuditData'
import StatListItem from '@/components/StatListItem'
import NotificationBell from '@/components/NotificationBell'
import KanbanBoard from '@/components/KanbanBoard'
import TabPage from '@/components/TabPage'
import StepPage from '@/components/StepPage'
import Chip from '@/components/Chip'
import InputTime from '@/components/InputTime'
import InputSlider from '@/components/InputSlider'
import InputRating from '@/components/InputRating'
import InputTextArea from '@/components/InputTextArea'
import InputColor from '@/components/InputColor'
import InputSwitch from '@/components/InputSwitch'
import TreeView from '@/components/TreeView'
import TreeDataTable from '@/components/TreeDataTable'
import AccordionCard from '@/components/AccordionCard'
import Breadcrumb from '@/components/Breadcrumb'
import Drawer, { DrawerHeader, DrawerBody, DrawerGroup, DrawerItem, DrawerFooter } from '@/components/Drawer'
import Carousel from '@/components/Carousel'
import ImageGallery from '@/components/ImageGallery'
import { IconUsers, IconDollar, IconBox, IconActivity, IconSave, IconCheck, IconClose, IconInfo, IconWarning, IconEdit, IconDelete, IconSearch, IconPhone, IconHome, IconChevronRight, IconChart, IconUser, IconTag, IconCalendar, IconSettings, IconShield, IconLock, IconTrendingUp, IconStar } from '@/icons'

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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmResult, setConfirmResult] = useState(null)
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
  const [kanbanColumns] = useState([
    {
      id: 'todo', title: 'To Do', cards: [
        { id: 'k1', title: 'Design new dashboard layout', description: 'Create wireframes for the analytics dashboard with real-time widgets', labels: [{ text: 'Design', color: 'var(--primary)' }], assignees: [{ name: 'Alice' }, { name: 'Bob' }] },
        { id: 'k2', title: 'Implement user authentication', description: 'Add OAuth2 support with Google and GitHub providers', labels: [{ text: 'Backend', color: 'var(--accent)' }], assignees: [{ name: 'Carol' }] },
        { id: 'k3', title: 'Write API documentation', description: 'Document all REST endpoints with request/response examples', labels: [{ text: 'Docs', color: 'var(--info)' }], assignees: [{ name: 'Dave' }, { name: 'Eve' }] },
      ],
    },
    {
      id: 'in-progress', title: 'In Progress', cards: [
        { id: 'k4', title: 'Refactor data layer', description: 'Migrate from class-based to functional data access patterns', labels: [{ text: 'Refactor', color: 'var(--warning)' }], assignees: [{ name: 'Frank' }, { name: 'Grace' }] },
        { id: 'k5', title: 'Add dark mode support', description: 'Implement CSS custom properties for theme switching', labels: [{ text: 'UI', color: 'var(--primary)' }, { text: 'Enhancement', color: 'var(--success)' }], assignees: [{ name: 'Heidi' }] },
      ],
    },
    {
      id: 'review', title: 'Review', cards: [
        { id: 'k6', title: 'Optimize database queries', description: 'Add indexes and query optimization for report generation', labels: [{ text: 'Performance', color: 'var(--danger)' }], assignees: [{ name: 'Ivan' }] },
      ],
    },
    {
      id: 'done', title: 'Done', cards: [
        { id: 'k7', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', labels: [{ text: 'DevOps', color: 'var(--accent)' }], assignees: [{ name: 'Judy' }] },
        { id: 'k8', title: 'Create onboarding guide', description: 'Write a getting-started guide for new team members', labels: [{ text: 'Docs', color: 'var(--info)' }], assignees: [{ name: 'Mallory' }] },
        { id: 'k9', title: 'Deploy staging environment', description: 'Set up staging server with production-like configuration', labels: [{ text: 'DevOps', color: 'var(--accent)' }], assignees: [{ name: 'Niaj' }] },
      ],
    },
  ])

  const [sliderVolume, setSliderVolume] = useState(65)
  const [sliderPrice, setSliderPrice] = useState(50)
  const [sliderDecimal, setSliderDecimal] = useState(3.5)
  const [ratingSat, setRatingSat] = useState(3.5)
  const [ratingNps, setRatingNps] = useState(7)
  const [ratingService, setRatingService] = useState(4)
  const [ratingCustom, setRatingCustom] = useState(5)
  const [ratingMinimal, setRatingMinimal] = useState(2)
  const [textareaVal, setTextareaVal] = useState('')
  const [textareaDesc, setTextareaDesc] = useState('This is a read-only description with some pre-filled content for demonstration purposes.')
  const [colorPrimary, setColorPrimary] = useState('#7c3aed')
  const [colorAccent, setColorAccent] = useState('#10b981')
  const [switchNotif, setSwitchNotif] = useState(true)
  const [switchDark, setSwitchDark] = useState(false)
  const [switchEmail, setSwitchEmail] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [treeChecked, setTreeChecked] = useState([])
  const treeData = [
    {
      id: 'cat-1', label: 'Electronics',
      children: [
        { id: 'sub-1', label: 'Laptops', children: [{ id: 'item-1', label: 'Gaming Laptop' }, { id: 'item-2', label: 'Ultrabook' }] },
        { id: 'sub-2', label: 'Phones', children: [{ id: 'item-3', label: 'Smartphone' }, { id: 'item-4', label: 'Feature Phone' }] },
      ],
    },
    {
      id: 'cat-2', label: 'Furniture',
      children: [
        { id: 'sub-3', label: 'Chairs', children: [{ id: 'item-5', label: 'Office Chair' }, { id: 'item-6', label: 'Gaming Chair' }] },
        { id: 'sub-4', label: 'Desks', children: [{ id: 'item-7', label: 'Standing Desk' }, { id: 'item-8', label: 'Corner Desk' }] },
      ],
    },
  ]
  const treeColumns = [
    { key: 'name', header: 'Category / Item', width: '200px' },
    { key: 'code', header: 'Code', width: '100px' },
    { key: 'qty', header: 'Qty', width: '80px' },
    {
      key: 'status', header: 'Status', width: '100px',
      render: (v) => <Badge variant={v === 'active' ? 'success' : v === 'pending' ? 'warning' : 'danger'} dot>{v ? v.charAt(0).toUpperCase() + v.slice(1) : '—'}</Badge>,
    },
  ]
  const treeTableData = [
    {
      id: 't1', name: 'Warehouse A', code: 'WH-A', qty: 1200, status: 'active',
      children: [
        { id: 't1a', name: 'Electronics', code: 'WH-A-EL', qty: 450, status: 'active',
          children: [
            { id: 't1a1', name: 'Laptops', code: 'WH-A-EL-LP', qty: 120, status: 'active' },
            { id: 't1a2', name: 'Phones', code: 'WH-A-EL-PH', qty: 330, status: 'active' },
          ],
        },
        { id: 't1b', name: 'Furniture', code: 'WH-A-FR', qty: 750, status: 'pending',
          children: [
            { id: 't1b1', name: 'Chairs', code: 'WH-A-FR-CH', qty: 400, status: 'active' },
            { id: 't1b2', name: 'Desks', code: 'WH-A-FR-DK', qty: 350, status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 't2', name: 'Warehouse B', code: 'WH-B', qty: 890, status: 'active',
      children: [
        { id: 't2a', name: 'Accessories', code: 'WH-B-AC', qty: 890, status: 'active',
          children: [
            { id: 't2a1', name: 'Cables', code: 'WH-B-AC-CB', qty: 500, status: 'active' },
            { id: 't2a2', name: 'Chargers', code: 'WH-B-AC-CG', qty: 390, status: 'active' },
          ],
        },
      ],
    },
  ]

  const [sampleNotifications] = useState([
    { id: '1', title: 'New order received', description: 'Order #1024 from Acme Corp — $12,500', time: '2m ago', type: 'success', read: false },
    { id: '2', title: 'Payment failed', description: 'Invoice #INV-2024-089 was declined by the bank', time: '15m ago', type: 'error', read: false },
    { id: '3', title: 'Inventory low', description: 'SKU-ALUM-001 has only 12 units remaining', time: '1h ago', type: 'warning', read: false },
    { id: '4', title: 'Shipment dispatched', description: 'Tracking #TRK-8842 — ETA 3 business days', time: '2h ago', type: 'info', read: true },
    { id: '5', title: 'New user registered', description: 'john.doe@example.com joined your organization', time: '3h ago', type: 'info', read: true },
  ])
  const [notifications, setNotifications] = useState(sampleNotifications)

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (clicked) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === clicked.id ? { ...n, read: true } : n))
    )
  }

  const handleResetNotifications = () => {
    setNotifications(sampleNotifications.map((n) => ({ ...n })))
  }

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

  // ── Sidebar data ──
  const categoryGroups = [
    { key: 'input-forms', label: 'Input & Forms', items: [
      { id: 'form-inputs', label: 'Form Inputs' },
      { id: 'input-states', label: 'Input States' },
      { id: 'file-upload', label: 'File Upload' },
      { id: 'input-time', label: 'Input Time' },
      { id: 'chip', label: 'Chip' },
      { id: 'input-slider', label: 'Input Slider' },
      { id: 'input-rating', label: 'Input Rating' },
      { id: 'input-textarea', label: 'Text Area' },
      { id: 'input-color', label: 'Color Picker' },
      { id: 'input-switch', label: 'Switch' },
    ]},
    { key: 'data-display', label: 'Data Display', items: [
      { id: 'data-cards', label: 'Data Cards' },
      { id: 'datatable', label: 'Data Table' },
      { id: 'badges', label: 'Badges' },
      { id: 'progress', label: 'Progress' },
      { id: 'stat-list', label: 'Stat Lists' },
      { id: 'audit-data', label: 'Audit Data' },
      { id: 'loadable-card', label: 'Loadable Card' },
      { id: 'tree-view', label: 'Tree View' },
      { id: 'tree-data-table', label: 'Tree Data Table' },
      { id: 'accordion-card', label: 'Accordion Card' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'image-gallery', label: 'Image Gallery' },
    ]},
    { key: 'buttons', label: 'Buttons', items: [
      { id: 'buttons', label: 'Buttons' },
      { id: 'action-buttons', label: 'Action Buttons' },
    ]},
    { key: 'nav-layout', label: 'Navigation & Layout', items: [
      { id: 'pagecard-footer', label: 'PageCard Footer' },
      { id: 'tab-page', label: 'TabPage' },
      { id: 'step-page', label: 'StepPage' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
    ]},
    { key: 'overlays', label: 'Overlays & Dialogs', items: [
      { id: 'overlays', label: 'Overlay Components' },
      { id: 'modal', label: 'Modal' },
      { id: 'sidepanel', label: 'SidePanel' },
      { id: 'standalone-confirm-section', label: 'Standalone Confirm' },
      { id: 'save-overlay', label: 'Save Overlay' },
      { id: 'notification-bell', label: 'Notification Bell' },
      { id: 'ui-controls', label: 'UI Controls' },
      { id: 'kanban-board', label: 'Kanban Board' },
      { id: 'drawer', label: 'Drawer' },
    ]},
    { key: 'feedback', label: 'Feedback', items: [
      { id: 'error-boundary', label: 'Error Boundaries' },
      { id: 'toast-box', label: 'Toast Notifications' },
    ]},
  ]
  const allCategoryKeys = categoryGroups.map((g) => g.key)
  const [expandedCategories, setExpandedCategories] = useState(allCategoryKeys)
  const [activeSection, setActiveSection] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const query = searchQuery.toLowerCase().trim()
  const isFiltering = query.length > 0
  const filteredItems = isFiltering
    ? categoryGroups.flatMap((g) => g.items).filter((item) =>
        item.label.toLowerCase().includes(query)
      )
    : []

  const toggleCategory = useCallback((key) => {
    setExpandedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }, [])

  // Toggle all categories
  const isAllExpanded = expandedCategories.length === allCategoryKeys.length
  const toggleAll = useCallback(() => {
    setExpandedCategories(isAllExpanded ? [] : [...allCategoryKeys])
  }, [isAllExpanded])

  const scrollToSection = useCallback((id) => {
    const el = document.querySelector(`[data-section="${id}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // IntersectionObserver — highlight active section on scroll
  useEffect(() => {
    const allIds = []
    categoryGroups.forEach((g) => g.items.forEach((item) => allIds.push(item.id)))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveSection(visible[0].target.getAttribute('data-section') || '')
        }
      },
      { rootMargin: '-5% 0px -75% 0px', threshold: 0 }
    )

    allIds.forEach((id) => {
      const el = document.querySelector(`[data-section="${id}"]`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Auto-expand category when active section changes
  useEffect(() => {
    if (!activeSection) return
    const group = categoryGroups.find((g) => g.items.some((item) => item.id === activeSection))
    if (group && !expandedCategories.includes(group.key)) {
      setExpandedCategories((prev) => [...prev, group.key])
    }
  }, [activeSection])

  return (
    <div className="examples-page">
      <nav className="examples-page__nav">
        <div className="examples-page__nav-header">
          <span>Components</span>
          <button
            type="button"
            className="examples-page__nav-toggle-all"
            onClick={toggleAll}
            title={isAllExpanded ? 'Collapse all' : 'Expand all'}
            aria-label={isAllExpanded ? 'Collapse all categories' : 'Expand all categories'}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isAllExpanded ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                </>
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </>
              )}
            </svg>
          </button>
        </div>
        <div className="examples-page__nav-search">
          <svg
            className="examples-page__nav-search-icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="examples-page__nav-search-input"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="examples-page__nav-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <ul className="examples-page__nav-list">
          {isFiltering ? (
            filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`examples-page__nav-link examples-page__nav-link--search${activeSection === item.id ? ' examples-page__nav-link--active' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="examples-page__nav-empty">No matches</li>
            )
          ) : (
            categoryGroups.map((group) => {
              const isOpen = expandedCategories.includes(group.key)
              return (
                <li key={group.key} className="examples-page__nav-group">
                  <button
                    type="button"
                    className="examples-page__nav-group-btn"
                    onClick={() => toggleCategory(group.key)}
                    aria-expanded={isOpen}
                  >
                    <svg
                      className={`examples-page__nav-chevron${isOpen ? ' examples-page__nav-chevron--open' : ''}`}
                      viewBox="0 0 16 16"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 4 10 8 6 12" />
                    </svg>
                    {group.label}
                  </button>
                  {isOpen && (
                    <ul className="examples-page__nav-sublist">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={`examples-page__nav-link examples-page__nav-link--sub${activeSection === item.id ? ' examples-page__nav-link--active' : ''}`}
                            onClick={() => scrollToSection(item.id)}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })
          )}
        </ul>
      </nav>
      <div className="examples-page__content">
        <div className="page-wrap">
      {/* ── Section: Form Inputs & Controls ── */}
      <PageCard data-section="form-inputs">
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
      <PageCard data-section="input-states">
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

            {/* InputLabel — read-only display */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>InputLabel (Read-only field)</h4>
              <InputLabel label="Full Name" value="John Doe" />
              <InputLabel label="Email" value="john.doe@company.com" icon={<IconSearch size={14} />} />
              <InputLabel label="Department" value="Engineering" dense />
              <InputLabel label="Employee ID" value="EMP-0042" dense />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: File Upload ── */}
      <PageCard data-section="file-upload">
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

      {/* ── Section: Input Time ── */}
      <PageCard data-section="input-time">
        <PageCardHeader>
          <PageCardTitle title="Input Time" subtitle="Time picker with clock icon, error, required, dense, and disabled states" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputTime label="Start Time" placeholder="HH:MM" />
              <InputTime label="End Time" required placeholder="HH:MM" />
              <InputTime label="Break" dense placeholder="HH:MM" />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputTime label="Disabled" value="09:30" disabled />
              <InputTime label="With Error" value="25:00" error="Invalid time format" />
              <InputTime label="Compact" dense value="14:30" />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputTime label="Overtime Start" placeholder="HH:MM" />
              <InputTime label="Overtime End" placeholder="HH:MM" />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Chip ── */}
      <PageCard data-section="chip">
        <PageCardHeader>
          <PageCardTitle title="Chip" subtitle="Entities represented with icons, avatars, labels, and removable chips — multiple variants and sizes" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Variants</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Chip variant="default">Default</Chip>
                <Chip variant="primary">Primary</Chip>
                <Chip variant="success">Success</Chip>
                <Chip variant="warning">Warning</Chip>
                <Chip variant="danger">Danger</Chip>
              </div>
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>With Icons &amp; Avatars</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', alignItems: 'center' }}>
                <Chip variant="primary" icon={<IconUsers size={14} />}>Team</Chip>
                <Chip variant="success" icon={<IconCheck size={14} />}>Verified</Chip>
                <Chip variant="primary" avatar={<span style={{background:'var(--primary)',color:'var(--primary-on)',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'bold'}}>JD</span>}>John Doe</Chip>
                <Chip variant="warning" icon={<IconWarning size={14} />}>Pending</Chip>
              </div>
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Removable &amp; Disabled</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                <Chip variant="primary" onRemove={() => {}}>Remove me</Chip>
                <Chip variant="success" onRemove={() => {}} icon={<IconCheck size={14} />}>Completed</Chip>
                <Chip variant="default" disabled>Disabled</Chip>
                <Chip variant="danger" onRemove={() => {}}>Dismiss</Chip>
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Input Slider ── */}
      <PageCard data-section="input-slider">
        <PageCardHeader>
          <PageCardTitle title="Input Slider" subtitle="Range slider with value display, customizable min/max/step, and error/disabled states" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <InputSlider label="Volume" value={sliderVolume} onChange={(e) => setSliderVolume(Number(e.target.value))} min={0} max={100} step={1} />
              <InputSlider label="Price Range" value={sliderPrice} onChange={(e) => setSliderPrice(Number(e.target.value))} min={0} max={500} step={5} />
              <InputSlider label="With Error" value={120} min={0} max={100} error="Value exceeds maximum" />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <InputSlider label="Decimal Step" value={sliderDecimal} onChange={(e) => setSliderDecimal(Number(e.target.value))} min={0} max={10} step={0.5} />
              <InputSlider label="Disabled" value={42} disabled />
              <InputSlider label="No Value Display" value={75} showValue={false} />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <InputSlider label="Narrow Range" value={10} min={-20} max={20} />
              <InputSlider label="Dense Variant" value={33} dense />
              <InputSlider label="Full Range" value={100} min={0} max={100} />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Input Rating ── */}
      <PageCard data-section="input-rating">
        <PageCardHeader>
          <PageCardTitle title="Input Rating" subtitle="Star rating with half-star precision, customizable min/max range, and error/disabled states" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <InputRating
                label="Satisfaction"
                value={ratingSat}
                onChange={(e) => setRatingSat(Number(e.target.value))}
                min={0}
                max={5}
              />
              <InputRating
                label="NPS Score"
                value={ratingNps}
                onChange={(e) => setRatingNps(Number(e.target.value))}
                min={0}
                max={10}
              />
              <InputRating label="With Error" value={3} error="Please provide a rating" />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <InputRating
                label="Service Quality"
                value={ratingService}
                onChange={(e) => setRatingService(Number(e.target.value))}
                min={1}
                max={5}
              />
              <InputRating
                label="Custom Range (2-7)"
                value={ratingCustom}
                onChange={(e) => setRatingCustom(Number(e.target.value))}
                min={2}
                max={7}
              />
              <InputRating label="Disabled" value={4} disabled />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <InputRating
                label="Minimal (0-3)"
                value={ratingMinimal}
                onChange={(e) => setRatingMinimal(Number(e.target.value))}
                min={0}
                max={3}
              />
              <InputRating label="Dense Variant" value={2.5} dense />
              <InputRating label="Required" value={0} required />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Text Area ── */}
      <PageCard data-section="input-textarea">
        <PageCardHeader>
          <PageCardTitle title="Text Area" subtitle="Multi-line text input with rows, maxLength, error, disabled, readOnly, and dense states" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputTextArea label="Description" placeholder="Enter a description..." value={textareaVal} onChange={(e) => setTextareaVal(e.target.value)} />
              <InputTextArea label="Read Only" value={textareaDesc} readOnly />
              <InputTextArea label="With Max Length" maxLength={100} placeholder="Max 100 characters..." />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputTextArea label="With Error" value="Invalid content that exceeds the expected format" error="Please provide valid content" />
              <InputTextArea label="Disabled" value="This field is locked" disabled />
              <InputTextArea label="No Resize" resizable={false} placeholder="Fixed height textarea..." />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputTextArea label="Dense" dense placeholder="Compact variant" />
              <InputTextArea label="Required" required placeholder="Required field" />
              <InputTextArea label="5 Rows" rows={5} placeholder="Custom row count..." />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Color Picker ── */}
      <PageCard data-section="input-color">
        <PageCardHeader>
          <PageCardTitle title="Color Picker" subtitle="Native color input with swatch preview, hex display, error, and disabled states" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputColor label="Primary Color" value={colorPrimary} onChange={(e) => setColorPrimary(e.target.value)} />
              <InputColor label="Custom Placeholder" placeholder="Pick a shade..." />
              <InputColor label="With Error" value="#zzz" error="Invalid color code" />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputColor label="Accent Color" value={colorAccent} onChange={(e) => setColorAccent(e.target.value)} />
              <InputColor label="Disabled" value="#6b7280" disabled />
              <InputColor label="Required" required />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <InputColor label="Dense Variant" value="#f59e0b" dense />
              <InputColor label="No Default" value="" placeholder="No color selected" />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Switch ── */}
      <PageCard data-section="input-switch">
        <PageCardHeader>
          <PageCardTitle title="Switch" subtitle="Toggle switches for boolean settings with label, disabled, and dense variants" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Interactive</h4>
              <InputSwitch label="Enable Notifications" checked={switchNotif} onChange={(e) => setSwitchNotif(e.target.checked)} />
              <InputSwitch label="Dark Mode" checked={switchDark} onChange={(e) => setSwitchDark(e.target.checked)} />
              <InputSwitch label="Email Alerts" checked={switchEmail} onChange={(e) => setSwitchEmail(e.target.checked)} />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>States</h4>
              <InputSwitch label="Checked Disabled" checked={true} disabled />
              <InputSwitch label="Unchecked Disabled" checked={false} disabled />
              <InputSwitch label="Required" required />
            </div>
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Dense</h4>
              <InputSwitch label="Compact Toggle" dense />
              <InputSwitch label="Compact Checked" checked={true} dense />
              <InputSwitch label="Compact Disabled" checked={true} dense disabled />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Data Cards ── */}
      <DataCardGrid data-section="data-cards" cols={4}>
        <DataCard variant="secondary" icon={<IconUsers size={22} />} value="1,284" label="Total Users" badge="+12.5%" trend="up" />
        <DataCard variant="success" icon={<IconDollar size={22} />} value="$48,290" label="Revenue" badge="+8.2%" trend="up" />
        <DataCard variant="warning" icon={<IconBox size={22} />} value="643" label="Orders" badge="-3.1%" trend="down" />
        <DataCard variant="accent" icon={<IconActivity size={22} />} value="97.8%" label="Uptime" badge="+0.4%" trend="up" />
      </DataCardGrid>

      {/* ── Section: Data Table ── */}
      <PageCard data-section="datatable">
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
      <PageCard data-section="badges">
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
      <PageCard data-section="progress">
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

      {/* ── Section: Stat List Items ── */}
      <PageCard data-section="stat-list">
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
      <PageCard data-section="audit-data">
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

      {/* ── Section: Loadable Card ── */}
      <LoadableCard data-section="loadable-card"
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

      {/* ── Section: Tree View ── */}
      <PageCard data-section="tree-view">
        <PageCardHeader>
          <PageCardTitle title="Tree View" subtitle="Checkbox tree with expand/collapse, indeterminate parent states, and nested hierarchy" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6">
              <TreeView
                data={treeData}
                checked={treeChecked}
                onCheckedChange={setTreeChecked}
                label="Inventory Categories"
              />
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Selected Items</h4>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {treeChecked.length > 0 ? (
                  <span>{treeChecked.length} item{treeChecked.length !== 1 ? 's' : ''} selected: <strong style={{ color: 'var(--text-primary)' }}>{treeChecked.join(', ')}</strong></span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Click checkboxes above to select items</span>
                )}
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Tree Data Table ── */}
      <PageCard data-section="tree-data-table">
        <PageCardHeader>
          <PageCardTitle title="Tree Data Table" subtitle="Hierarchical data table with expandable rows, checkboxes, sorting, and status badges" />
        </PageCardHeader>
        <PageCardBody>
          <TreeDataTable
            columns={treeColumns}
            data={treeTableData}
            sortable
            striped
            hoverable
            emptyMessage="No inventory data"
          />
        </PageCardBody>
      </PageCard>

      {/* ── Section: Carousel ── */}
      <PageCard data-section="carousel">
        <PageCardHeader>
          <PageCardTitle title="Carousel" subtitle="Auto-rotating slideshow with arrow navigation, dot indicators, and swipe/keyboard support" />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Slide Transition</h4>
              <Carousel
                slides={[
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--primary">
                        <span className="carousel-slide-card__icon"><IconChart size={24} /></span>
                        <h3 className="carousel-slide-card__title">Revenue Analytics</h3>
                        <p className="carousel-slide-card__desc">Real-time revenue tracking with interactive charts and forecasting tools.</p>
                      </div>
                    ),
                    label: 'Revenue Analytics',
                  },
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--success">
                        <span className="carousel-slide-card__icon"><IconUser size={24} /></span>
                        <h3 className="carousel-slide-card__title">User Management</h3>
                        <p className="carousel-slide-card__desc">Manage team members, roles, permissions, and access controls from one place.</p>
                      </div>
                    ),
                    label: 'User Management',
                  },
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--warning">
                        <span className="carousel-slide-card__icon"><IconBox size={24} /></span>
                        <h3 className="carousel-slide-card__title">Inventory Overview</h3>
                        <p className="carousel-slide-card__desc">Track stock levels, manage suppliers, and optimize your supply chain.</p>
                      </div>
                    ),
                    label: 'Inventory Overview',
                  },
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--danger">
                        <span className="carousel-slide-card__icon"><IconActivity size={24} /></span>
                        <h3 className="carousel-slide-card__title">System Health</h3>
                        <p className="carousel-slide-card__desc">Monitor uptime, response times, and infrastructure performance metrics.</p>
                      </div>
                    ),
                    label: 'System Health',
                  },
                ]}
                autoPlay={4000}
                transition="slide"
              />
            </div>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Fade Transition</h4>
              <Carousel
                slides={[
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--accent">
                        <span className="carousel-slide-card__icon"><IconTrendingUp size={24} /></span>
                        <h3 className="carousel-slide-card__title">Growth Trends</h3>
                        <p className="carousel-slide-card__desc">Monthly growth analytics with year-over-year comparisons.</p>
                      </div>
                    ),
                    label: 'Growth Trends',
                  },
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--primary">
                        <span className="carousel-slide-card__icon"><IconStar size={24} /></span>
                        <h3 className="carousel-slide-card__title">Top Performers</h3>
                        <p className="carousel-slide-card__desc">Highlight your best-selling products and top-performing teams.</p>
                      </div>
                    ),
                    label: 'Top Performers',
                  },
                  {
                    content: (
                      <div className="carousel-slide-card carousel-slide-card--success">
                        <span className="carousel-slide-card__icon"><IconCheck size={24} /></span>
                        <h3 className="carousel-slide-card__title">Goals Achieved</h3>
                        <p className="carousel-slide-card__desc">Track quarterly OKRs, milestones, and team accomplishments.</p>
                      </div>
                    ),
                    label: 'Goals Achieved',
                  },
                ]}
                autoPlay={6000}
                transition="fade"
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Image Gallery ── */}
      <PageCard data-section="image-gallery">
        <PageCardHeader>
          <PageCardTitle title="Image Gallery" subtitle="Responsive grid with lightbox preview — click any item to open full view with navigation" />
        </PageCardHeader>
        <PageCardBody>
          <ImageGallery
            columns={3}
            items={[
              {
                icon: <span className="image-gallery__thumb-icon" style={{background:'var(--primary-bg)',color:'var(--primary)',fontSize:'24px'}}><IconChart size={24} /></span>,
                label: 'Revenue Dashboard',
                caption: 'Revenue Dashboard',
                subtitle: 'Q2 2026 performance',
                bg: 'linear-gradient(135deg, var(--primary-bg), var(--surface-alt))',
              },
              {
                icon: <span className="image-gallery__thumb-icon" style={{background:'var(--success-bg)',color:'var(--success)',fontSize:'24px'}}><IconUser size={24} /></span>,
                label: 'User Analytics',
                caption: 'User Analytics',
                subtitle: 'Active users & growth',
                bg: 'linear-gradient(135deg, var(--success-bg), var(--surface-alt))',
              },
              {
                icon: <span className="image-gallery__thumb-icon" style={{background:'var(--warning-bg)',color:'var(--warning)',fontSize:'24px'}}><IconBox size={24} /></span>,
                label: 'Inventory Map',
                caption: 'Inventory Map',
                subtitle: 'Warehouse distribution',
                bg: 'linear-gradient(135deg, var(--warning-bg), var(--surface-alt))',
              },
              {
                icon: <span className="image-gallery__thumb-icon" style={{background:'var(--danger-bg)',color:'var(--danger)',fontSize:'24px'}}><IconActivity size={24} /></span>,
                label: 'System Monitor',
                caption: 'System Monitor',
                subtitle: 'Real-time infrastructure',
                bg: 'linear-gradient(135deg, var(--danger-bg), var(--surface-alt))',
              },
              {
                icon: <span className="image-gallery__thumb-icon" style={{background:'var(--accent-bg)',color:'var(--accent)',fontSize:'24px'}}><IconStar size={24} /></span>,
                label: 'Performance Metrics',
                caption: 'Performance Metrics',
                subtitle: 'KPI tracking dashboard',
                bg: 'linear-gradient(135deg, var(--accent-bg), var(--surface-alt))',
              },
              {
                icon: <span className="image-gallery__thumb-icon" style={{background:'var(--info-bg)',color:'var(--info)',fontSize:'24px'}}><IconSettings size={24} /></span>,
                label: 'Settings Panel',
                caption: 'Settings Panel',
                subtitle: 'Configuration overview',
                bg: 'linear-gradient(135deg, var(--info-bg), var(--surface-alt))',
              },
            ]}
          />
        </PageCardBody>
      </PageCard>

      {/* ── Section: Accordion Card ── */}
      <PageCard data-section="accordion-card">
        <PageCardHeader>
          <PageCardTitle title="Accordion Card" subtitle="Collapsible sections with single/multi-expand, disabled items, and keep-mounted content" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6">
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Single Expand (default)</h4>
              <AccordionCard
                items={[
                  {
                    title: 'General Settings',
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Configure system preferences, language, and regional settings for your workspace.</div>,
                  },
                  {
                    title: 'Notifications',
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Manage email, push, and in-app notification preferences per channel.</div>,
                  },
                  {
                    title: 'Security',
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Update password, enable two-factor authentication, and review active sessions.</div>,
                  },
                  {
                    title: 'Disabled Section',
                    disabled: true,
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>This section is not available.</div>,
                  },
                ]}
              />
            </div>
            <div className="col-span-6">
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Multiple Expand (allowMultiple)</h4>
              <AccordionCard
                allowMultiple
                items={[
                  {
                    title: 'FAQ: Getting Started',
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Sign up for an account, verify your email, and complete your profile to get started.</div>,
                  },
                  {
                    title: 'FAQ: Billing',
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Billing cycles, invoicing, and payment methods — everything you need to manage subscriptions.</div>,
                  },
                  {
                    title: 'FAQ: Integrations',
                    content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Connect with third-party tools using our API and pre-built connectors.</div>,
                  },
                ]}
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Buttons ── */}
      <PageCard data-section="buttons">
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

      {/* ── Section: Action Buttons ── */}
      <PageCard data-section="action-buttons">
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

      {/* ── Section: PageCard with Footer ── */}
      <PageCard data-section="pagecard-footer">
        <PageCardHeader>
          <PageCardTitle title="PageCard With Footer" subtitle="A complete PageCard with Header, Body, and Footer — footer typically holds actions" />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              The <code>PageCardFooter</code> component provides a bottom section for action buttons, usually Cancel on the left and primary actions on the right.
            </p>
            <div className="grid" style={{ gap: 'var(--sp-3)' }}>
              <div className="col-span-4">
                <InputText label="Project Name" placeholder="Enter project name" />
              </div>
              <div className="col-span-4">
                <Dropdown
                  label="Status"
                  options={[
                    { value: 'planning', label: 'Planning' },
                    { value: 'active', label: 'Active' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                  placeholder="Select status..."
                />
              </div>
              <div className="col-span-4" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <InputCalendar label="Due Date" dense placeholder="Pick a date" />
              </div>
            </div>
          </div>
        </PageCardBody>
        <PageCardFooter>
          <Button variant="secondary" size="sm" onClick={() => toast.info('Cancelled')}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => toast.success('Project saved!')}>
            <IconSave size={14} className="icon-left" />
            Save Project
          </Button>
        </PageCardFooter>
      </PageCard>

      {/* ── Section: Tab Page ── */}
      <PageCard data-section="tab-page">
        <PageCardHeader>
          <PageCardTitle title="Tab Page" subtitle="Underline, pills, and buttons variants with badges and icons" />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Underline</h4>
              <TabPage
                variant="underline"
                tabs={[
                  { label: 'Overview', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Overview content — general account information and quick stats.</div> },
                  { label: 'Settings', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Settings panel — configure preferences and notifications.</div> },
                  { label: 'Billing', badge: 3, content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Billing section — invoices, payment methods, and plans.</div> },
                  { label: 'Disabled', disabled: true, content: <div /> },
                ]}
              />
            </div>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Pills</h4>
              <TabPage
                variant="pills"
                tabs={[
                  { icon: <IconUsers size={14} />, label: 'Users', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>User management — add, edit, and deactivate team members.</div> },
                  { icon: <IconBox size={14} />, label: 'Products', badge: 12, content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Product catalog — manage inventory and pricing.</div> },
                  { icon: <IconActivity size={14} />, label: 'Activity', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Activity log — track changes and user actions.</div> },
                ]}
              />
            </div>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Buttons</h4>
              <TabPage
                variant="buttons"
                tabs={[
                  { label: 'Details', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Detailed view with comprehensive data and metadata.</div> },
                  { label: 'History', badge: 7, content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Change history — full audit trail of modifications.</div> },
                  { label: 'Attachments', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Attachments — uploaded files, documents, and images.</div> },
                ]}
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Step Page ── */}
      <PageCard data-section="step-page">
        <PageCardHeader>
          <PageCardTitle title="Step Page" subtitle="Horizontal and vertical step wizards with navigation controls and completion states" />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Horizontal</h4>
              <StepPage
                orientation="horizontal"
                steps={[
                  { label: 'Account', description: 'Basic info', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Enter your email and create a password for your account.</div> },
                  { label: 'Profile', description: 'Personal details', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Fill in your name, avatar, and contact information.</div> },
                  { label: 'Preferences', description: 'Notifications & privacy', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Configure your notification preferences and privacy settings.</div> },
                  { label: 'Confirm', description: 'Review & submit', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Review all information and submit your registration.</div> },
                ]}
              />
            </div>
            <div>
              <h4 className="h4" style={{ margin: '0 0 var(--sp-3)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Vertical</h4>
              <StepPage
                orientation="vertical"
                steps={[
                  { label: 'Upload', description: 'Source files', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Upload your source code, images, and assets.</div> },
                  { label: 'Configure', description: 'Build settings', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Select your build configuration, environment, and target platform.</div> },
                  { label: 'Deploy', description: 'Release', content: <div style={{ padding: 'var(--sp-3)', color: 'var(--text-secondary)' }}>Deploy to production or staging environment.</div> },
                ]}
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Breadcrumb ── */}
      <PageCard data-section="breadcrumb">
        <PageCardHeader>
          <PageCardTitle title="Breadcrumb" subtitle="Navigation breadcrumbs with home icon, custom separators, and active page indicator" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div>
                <h4 className="h4" style={{ margin: '0 0 var(--sp-2)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Standard</h4>
                <Breadcrumb
                  items={[
                    { label: 'Dashboard', href: '#' },
                    { label: 'Reports', href: '#' },
                    { label: 'Sales Report' },
                  ]}
                />
              </div>
              <div>
                <h4 className="h4" style={{ margin: '0 0 var(--sp-2)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>With Icons</h4>
                <Breadcrumb
                  items={[
                    { label: 'Home', href: '#', icon: <IconHome size={14} /> },
                    { label: 'Settings', href: '#', icon: <IconChevronRight size={14} /> },
                    { label: 'Profile' },
                  ]}
                  homeIcon={false}
                />
              </div>
            </div>
            <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div>
                <h4 className="h4" style={{ margin: '0 0 var(--sp-2)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Long Path</h4>
                <Breadcrumb
                  items={[
                    { label: 'Organization' },
                    { label: 'Engineering' },
                    { label: 'Projects' },
                    { label: 'Cloud Migration' },
                    { label: 'Architecture' },
                  ]}
                />
              </div>
              <div>
                <h4 className="h4" style={{ margin: '0 0 var(--sp-2)', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>No Home Icon</h4>
                <Breadcrumb
                  homeIcon={false}
                  items={[
                    { label: 'Products' },
                    { label: 'Categories' },
                    { label: 'Electronics' },
                    { label: 'Laptops' },
                  ]}
                />
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Modal / SidePanel / Confirm ── */}
      <PageCard data-section="overlays">
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
      <Modal data-section="modal" open={modalOpen} onClose={() => setModalOpen(false)} size="lg">
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
      <SidePanel data-section="sidepanel" open={panelOpen} onClose={() => setPanelOpen(false)} position={panelSide} size="md">
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

      {/* ── Section: Standalone Confirm ── */}
      <PageCard data-section="standalone-confirm-section">
        <PageCardHeader>
          <PageCardTitle title="Confirm (Standalone)" subtitle="Direct Confirm component with local state — onConfirm/onCancel callbacks" />
          <PageCardActions>
            <Button size="sm" variant="danger" onClick={() => { setConfirmOpen(true); setConfirmResult(null) }}>
              Open Confirm
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Unlike the global confirm from <code>useUI()</code>, this uses the <code>Confirm</code> component directly with local <code>open</code> state and <code>onConfirm</code> / <code>onCancel</code> callbacks.
            </p>
            {confirmResult !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontSize: 'var(--fs-sm)' }}>
                <Badge variant={confirmResult ? 'success' : 'muted'} dot>
                  {confirmResult ? 'Confirmed' : 'Cancelled'}
                </Badge>
                <span style={{ color: 'var(--text-muted)' }}>
                  User {confirmResult ? 'accepted' : 'declined'} the action
                </span>
              </div>
            )}
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Standalone Confirm ── */}
      <Confirm
        open={confirmOpen}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          setConfirmOpen(false)
          setConfirmResult(true)
          toast.error('Record deleted!')
        }}
        onCancel={() => {
          setConfirmOpen(false)
          setConfirmResult(false)
          toast.info('Delete cancelled')
        }}
      />
      {/* ── Section: Save with Overlay Modal ── */}
      <PageCard data-section="save-overlay">
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

      {/* ── Section: Notification Bell ── */}
      <PageCard data-section="notification-bell">
        <PageCardHeader>
          <PageCardTitle title="Notification Bell" subtitle="Dropdown notification panel with unread badge, type icons, timestamps, and mark-all-read" />
          <PageCardActions>
            <Button size="sm" variant="outline" onClick={handleResetNotifications}>
              Reset Notifications
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Click the bell icon to open the notification panel. Notifications with a blue dot are unread.
              Click a notification to mark it as read. Use "Mark all as read" to clear all unread badges.
              The bell shows an unread count badge — up to 99+.
            </p>
            <div className="notification-bell-demo-area">
              <NotificationBell
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>


      {/* ── Section: Global UI Controls ── */}
      <PageCard data-section="ui-controls">
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

      {/* ── Section: Kanban Board ── */}
      <PageCard data-section="kanban-board">
        <PageCardHeader>
          <PageCardTitle title="Kanban Board" subtitle="Drag-and-drop task board with columns, cards, labels, assignee avatars, and animations" />
        </PageCardHeader>
        <PageCardBody>
          <div className="kanban-board-demo">
            <KanbanBoard
              columns={kanbanColumns}
              onCardClick={(card) => toast.info(`Card: ${card.title}`)}
              onCardMove={(cardId, from, to) =>
                toast.success(`Moved card from ${from} to ${to}`)
              }
            />
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Drawer ── */}
      <PageCard data-section="drawer">
        <PageCardHeader>
          <PageCardTitle title="Drawer" subtitle="Slide-in navigation overlay with groups, items, badges, and active/disabled states" />
          <PageCardActions>
            <Button size="sm" variant="primary" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Click "Open Drawer" to see the slide-in navigation overlay. The drawer includes collapsible groups,
              navigation items with icons, active page indicators, badges, and a close button. Press Escape or click
              the backdrop to dismiss.
            </p>
            <div className="drawer-demo-area">
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                position="left"
                size="sm"
              >
                <DrawerHeader title="Navigation" onClose={() => setDrawerOpen(false)} />
                <DrawerBody>
                  <DrawerGroup label="Main" defaultOpen>
                    <DrawerItem icon={<IconHome size={16} />} label="Dashboard" active onClick={() => {}} />
                    <DrawerItem icon={<IconChart size={16} />} label="Analytics" onClick={() => {}} badge="New" />
                    <DrawerItem icon={<IconUser size={16} />} label="Users" onClick={() => {}} badge="12" />
                  </DrawerGroup>
                  <DrawerGroup label="Workspace" defaultOpen={false}>
                    <DrawerItem icon={<IconEdit size={16} />} label="Projects" onClick={() => {}} />
                    <DrawerItem icon={<IconTag size={16} />} label="Tasks" onClick={() => {}} badge="3" />
                    <DrawerItem icon={<IconCalendar size={16} />} label="Calendar" disabled />
                  </DrawerGroup>
                  <DrawerGroup label="System">
                    <DrawerItem icon={<IconSettings size={16} />} label="Settings" onClick={() => {}} />
                    <DrawerItem icon={<IconShield size={16} />} label="Security" onClick={() => {}} />
                    <DrawerItem icon={<IconLock size={16} />} label="Permissions" disabled />
                  </DrawerGroup>
                </DrawerBody>
                <DrawerFooter>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                    v2.4.1 • {drawerOpen ? 'Open' : 'Closed'}
                  </span>
                </DrawerFooter>
              </Drawer>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Toast Notifications ── */}
      <PageCard data-section="toast-box">
        <PageCardHeader>
          <PageCardTitle title="Toast Notifications" subtitle="Trigger toast messages — success, error, info, and warning variants with auto-dismiss" />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: 'var(--sp-5)' }}>
            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Success</h4>
              <Button variant="primary" size="sm" onClick={() => toast.success('Data saved successfully!')}>
                Show Success
              </Button>
              <Button variant="primary" size="sm" onClick={() => toast.success('User account created. Welcome to the platform!', { duration: 5000 })}>
                Long Success
              </Button>
            </div>
            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Error</h4>
              <Button variant="danger" size="sm" onClick={() => toast.error('Failed to save. Please try again.')}>
                Show Error
              </Button>
              <Button variant="danger" size="sm" onClick={() => toast.error('Connection lost. Check your network and retry.', { duration: 6000 })}>
                Long Error
              </Button>
            </div>
            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Info</h4>
              <Button variant="secondary" size="sm" onClick={() => toast.info('New updates are available.')}>
                Show Info
              </Button>
              <Button variant="secondary" size="sm" onClick={() => toast.info('Your report has been generated and is ready for download.', { duration: 5000 })}>
                Long Info
              </Button>
            </div>
            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <h4 className="h4" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Warning</h4>
              <Button variant="outline" size="sm" onClick={() => toast.warning('Your session is about to expire.')}>
                Show Warning
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.warning('Low disk space — only 2GB remaining. Please clean up old files.', { duration: 6000 })}>
                Long Warning
              </Button>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Section: Error Boundary & Empty States ── */}
      <PageCard data-section="error-boundary">
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

        </div>
      </div>
    </div>
  )
}