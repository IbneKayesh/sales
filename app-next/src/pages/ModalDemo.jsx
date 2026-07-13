import { useState, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';
import { confirm } from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import FormModal from '../components/ui/FormModal';
import ImageModal from '../components/ui/ImageModal';
import WizardModal from '../components/ui/WizardModal';
import DetailModal from '../components/ui/DetailModal';
import BulkActionModal from '../components/ui/BulkActionModal';
import FilterModal from '../components/ui/FilterModal';
import Badge from '../components/ui/Badge';

const galleryImages = [
  { src: 'https://picsum.photos/seed/erp1/1200/800', alt: 'Dashboard analytics view', title: 'Analytics Dashboard' },
  { src: 'https://picsum.photos/seed/erp2/1200/800', alt: 'Sales order management', title: 'Order Management' },
  { src: 'https://picsum.photos/seed/erp3/1200/800', alt: 'Inventory stock overview', title: 'Inventory Overview' },
  { src: 'https://picsum.photos/seed/erp4/1200/800', alt: 'HR employee directory', title: 'Employee Directory' },
  { src: 'https://picsum.photos/seed/erp5/1200/800', alt: 'Finance reports chart', title: 'Financial Reports' },
];

const wizardDemoSteps = [
  {
    title: 'Basic Information',
    description: 'Enter the core details',
    content: ({ data, setData }) => (
      <div className="demo-wizard-form">
        <div className="form-field">
          <label className="form-label">Project Name</label>
          <input className="form-input" type="text" value={data.projectName || ''}
            onChange={e => setData(prev => ({ ...prev, projectName: e.target.value }))}
            placeholder="Enter project name" />
        </div>
        <div className="form-field">
          <label className="form-label">Department</label>
          <select className="form-select" value={data.department || ''}
            onChange={e => setData(prev => ({ ...prev, department: e.target.value }))}>
            <option value="">Select department</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
          </select>
        </div>
      </div>
    ),
  },
  {
    title: 'Configuration',
    description: 'Set up project parameters',
    content: ({ data, setData }) => (
      <div className="demo-wizard-form">
        <div className="form-field">
          <label className="form-label">Budget ($)</label>
          <input className="form-input" type="number" value={data.budget || ''}
            onChange={e => setData(prev => ({ ...prev, budget: e.target.value }))}
            placeholder="Enter budget" min={1000} />
        </div>
        <div className="form-field">
          <label className="form-label">Priority</label>
          <select className="form-select" value={data.priority || ''}
            onChange={e => setData(prev => ({ ...prev, priority: e.target.value }))}>
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={data.description || ''}
            onChange={e => setData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Project description" rows={3} />
        </div>
      </div>
    ),
  },
  {
    title: 'Review & Submit',
    description: 'Verify all details before submitting',
    content: ({ data }) => (
      <div className="demo-wizard-review">
        <h4>Project Summary</h4>
        <div className="demo-review-grid">
          <div><span>Name:</span> <strong>{data.projectName || '—'}</strong></div>
          <div><span>Department:</span> <strong>{data.department || '—'}</strong></div>
          <div><span>Budget:</span> <strong>${parseInt(data.budget)?.toLocaleString() || '—'}</strong></div>
          <div><span>Priority:</span> <strong style={{ textTransform: 'capitalize' }}>{data.priority || '—'}</strong></div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span>Description:</span>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>{data.description || 'No description provided'}</p>
          </div>
        </div>
      </div>
    ),
  },
];

const bulkDemoItems = [
  { id: 'PRD-001', name: 'iPhone 15 Pro', category: 'Smartphones', price: 1299, stock: 45 },
  { id: 'PRD-002', name: 'MacBook Air M3', category: 'Laptops', price: 1599, stock: 18 },
  { id: 'PRD-003', name: 'iPad Air', category: 'Tablets', price: 749, stock: 27 },
  { id: 'PRD-004', name: 'Apple Watch Ultra', category: 'Wearables', price: 899, stock: 5 },
  { id: 'PRD-005', name: 'AirPods Pro 2', category: 'Audio', price: 249, stock: 60 },
  { id: 'PRD-006', name: 'iMac 24"', category: 'Desktops', price: 1899, stock: 7 },
];

const bulkColumns = [
  { key: 'id', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (v) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span> },
  { key: 'stock', label: 'Stock' },
];

const filterFields = [
  { key: 'name', label: 'Product Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: ['Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Audio', 'Desktops', 'Accessories'] },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'stock', label: 'Stock Quantity', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Discontinued'] },
];

const detailOrderFields = [
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount', render: (v) => <strong style={{ color: 'var(--accent)' }}>${v?.toLocaleString()}</strong> },
  { key: 'status', label: 'Status', render: (v) => <Badge variant={v}>{v}</Badge> },
  { key: 'payment', label: 'Payment', render: (v) => <Badge variant={v}>{v}</Badge> },
  { key: 'date', label: 'Date' },
];

const modalSections = [
  {
    key: 'base',
    title: 'Base Modal',
    desc: 'Core modal component with size variants (sm/md/lg/xl/fullscreen)',
    sizes: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
  },
  {
    key: 'form',
    title: 'Form Modal',
    desc: 'Data entry form inside a modal with validation and submit handling',
  },
  {
    key: 'image',
    title: 'Image Viewer',
    desc: 'Full-screen image gallery with zoom, pan, and keyboard navigation',
  },
  {
    key: 'wizard',
    title: 'Wizard',
    desc: 'Multi-step guided workflow with progress indicator and validation',
  },
  {
    key: 'detail',
    title: 'Detail Viewer',
    desc: 'Read-only record display with field grid and action buttons',
  },
  {
    key: 'bulk',
    title: 'Bulk Actions',
    desc: 'Batch operations with checkbox selection and confirm flow',
  },
  {
    key: 'filter',
    title: 'Filter Builder',
    desc: 'Advanced AND/OR rule groups for complex data filtering',
  },
];

const svgAttrs = 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const modalIcons = {
  base: `<svg ${svgAttrs}><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M6 2v20M18 2v20"/></svg>`,
  form: `<svg ${svgAttrs}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  image: `<svg ${svgAttrs}><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  wizard: `<svg ${svgAttrs}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>`,
  detail: `<svg ${svgAttrs}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  bulk: `<svg ${svgAttrs}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  filter: `<svg ${svgAttrs}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
};

export default function ModalDemo() {
  const { toast } = useToast();
  const [modals, setModals] = useState({});
  const [modalSize, setModalSize] = useState('md');

  const toggle = useCallback((key, value = true) => {
    setModals(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleBaseOpen = (size) => {
    setModalSize(size);
    toggle('base');
  };

  return (
    <div className="demo-page">
      <div className="demo-header">
        <h2>Modal Components Demo</h2>
        <p>Interactive showcase of all modal components. Each card demonstrates a different modal type — click to open.</p>
      </div>

      <div className="demo-grid">
        {/* Base Modal — Size Variants */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.base }} />
          <h3>{modalSections[0].title}</h3>
          <p>{modalSections[0].desc}</p>
          <div className="demo-card-actions">
            {modalSections[0].sizes.map(size => (
              <button key={size} className="btn-primary btn-sm" onClick={() => handleBaseOpen(size)}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Form Modal */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.form }} />
          <h3>{modalSections[1].title}</h3>
          <p>{modalSections[1].desc}</p>
          <div className="demo-card-actions">
            <button className="btn-primary btn-sm" onClick={() => toggle('form')}>Open Form</button>
          </div>
        </div>

        {/* Image Viewer */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.image }} />
          <h3>{modalSections[2].title}</h3>
          <p>{modalSections[2].desc}</p>
          <div className="demo-card-actions">
            <button className="btn-primary btn-sm" onClick={() => toggle('image')}>Open Gallery</button>
          </div>
        </div>

        {/* Wizard */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.wizard }} />
          <h3>{modalSections[3].title}</h3>
          <p>{modalSections[3].desc}</p>
          <div className="demo-card-actions">
            <button className="btn-primary btn-sm" onClick={() => toggle('wizard')}>Start Wizard</button>
          </div>
        </div>

        {/* Detail Viewer */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.detail }} />
          <h3>{modalSections[4].title}</h3>
          <p>{modalSections[4].desc}</p>
          <div className="demo-card-actions">
            <button className="btn-primary btn-sm" onClick={() => toggle('detail')}>View Detail</button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.bulk }} />
          <h3>{modalSections[5].title}</h3>
          <p>{modalSections[5].desc}</p>
          <div className="demo-card-actions">
            <button className="btn-primary btn-sm" onClick={() => toggle('bulk')}>Select Items</button>
          </div>
        </div>

        {/* Filter Builder */}
        <div className="demo-card">
          <div className="demo-card-icon" dangerouslySetInnerHTML={{ __html: modalIcons.filter }} />
          <h3>{modalSections[6].title}</h3>
          <p>{modalSections[6].desc}</p>
          <div className="demo-card-actions">
            <button className="btn-primary btn-sm" onClick={() => toggle('filter')}>Open Filters</button>
          </div>
        </div>
      </div>

      {/* ── MODAL INSTANCES ── */}

      {/* Base Modal */}
      <Modal open={modals.base} onClose={() => toggle('base', false)} title={`Base Modal (${modalSize})`} size={modalSize}
        footer={
          <div className="demo-modal-footer">
            <span className="demo-modal-info">Size: <strong>{modalSize}</strong> · Close via overlay or ESC</span>
            <button className="form-btn form-btn-cancel" onClick={() => toggle('base', false)}>Close</button>
          </div>
        }
      >
        <div className="demo-modal-content">
          <p>This is the base <strong>Modal</strong> component with the <code>{modalSize}</code> size variant.</p>
          <ul>
            <li><strong>Focus trap</strong> — Tab/Shift+Tab cycles through focusable elements</li>
            <li><strong>ESC</strong> closes the modal</li>
            <li><strong>Overlay click</strong> closes (configurable via <code>closeOnOverlay</code>)</li>
            <li><strong>Footer slot</strong> for action buttons</li>
            <li>Auto-restores focus to the triggering element on close</li>
          </ul>
          <div className="demo-color-palette">
            {['sm', 'md', 'lg', 'xl', 'fullscreen'].map(s => (
              <button key={s} className={`demo-color-swatch ${s === modalSize ? 'active' : ''}`}
                onClick={() => setModalSize(s)}>{s}</button>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Click a size above to switch live.</p>
        </div>
      </Modal>

      {/* Form Modal */}
      <FormModal
        open={modals.form}
        onClose={() => toggle('form', false)}
        title="New Employee"
        submitLabel="Create Employee"
        fields={[
          { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Jane Smith' },
          { key: 'email', label: 'Email', type: 'text', required: true, placeholder: 'jane@company.com' },
          { key: 'department', label: 'Department', type: 'select', required: true, options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'] },
          { key: 'salary', label: 'Salary ($)', type: 'number', required: true, min: 30000, step: 1000 },
          { key: 'startDate', label: 'Start Date', type: 'date', required: true },
          { key: 'notes', label: 'Notes', type: 'textarea', rows: 3 },
        ]}
        onSubmit={(formData) => {
          toast.success(`Employee "${formData.name}" created successfully`);
          return Promise.resolve();
        }}
      />

      {/* Image Modal */}
      <ImageModal
        open={modals.image}
        onClose={() => toggle('image', false)}
        gallery={galleryImages}
        initialIndex={0}
      />

      {/* Wizard Modal */}
      <WizardModal
        open={modals.wizard}
        onClose={() => toggle('wizard', false)}
        title="New Project Wizard"
        steps={wizardDemoSteps}
        finishLabel="Create Project"
        initialData={{}}
        onComplete={async (data) => {
          await new Promise(resolve => setTimeout(resolve, 800));
          toast.success(`Project "${data.projectName}" created with $${parseInt(data.budget)?.toLocaleString() || 0} budget`);
        }}
      />

      {/* Detail Modal */}
      <DetailModal
        open={modals.detail}
        onClose={() => toggle('detail', false)}
        title="Order Details"
        item={{ id: 'ORD-001', customer: 'Sarah Johnson', product: 'iPhone 15 Pro', amount: 1299, status: 'completed', payment: 'paid', date: '2026-07-12' }}
        fields={detailOrderFields}
        badge={{ label: 'completed', variant: 'completed' }}
        actions={[
          { label: 'Edit Order', variant: 'primary', onClick: () => toast.info('Edit mode would open') },
          { label: 'Delete', variant: 'danger', onClick: async () => {
            const confirmed = await confirm('Delete this order?', { title: 'Confirm Delete', confirmText: 'Delete', variant: 'danger' });
            if (confirmed) toast.success('Order deleted');
          }},
        ]}
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        open={modals.bulk}
        onClose={() => toggle('bulk', false)}
        title="Manage Products"
        actionLabel="Delete"
        actionVariant="danger"
        description="Select products to remove from inventory. This action cannot be undone."
        items={bulkDemoItems}
        columns={bulkColumns}
        onConfirm={async (selected) => {
          await new Promise(resolve => setTimeout(resolve, 600));
          toast.success(`${selected.length} product(s) deleted successfully`);
        }}
      />

      {/* Filter Modal */}
      <FilterModal
        open={modals.filter}
        onClose={() => toggle('filter', false)}
        fields={filterFields}
        onApply={(filters) => {
          const ruleCount = filters.groups.reduce((sum, g) => sum + g.rules.filter(r => r.field).length, 0);
          toast.success(`Applied ${ruleCount} filter rule(s) across ${filters.groups.length} group(s)`);
        }}
      />
    </div>
  );
}
