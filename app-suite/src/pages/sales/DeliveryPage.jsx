import { useState } from 'react';
import { IconSearch } from '@/assets/icons';
import './DeliveryPage.css';

const MOCK_DELIVERIES = [
  { id: 'DEL-001', order: 'ORD-001', customer: 'Acme Corp', item: 'Enterprise Suite', qty: 5, carrier: 'FedEx', status: 'In Transit', eta: '2026-07-15' },
  { id: 'DEL-002', order: 'ORD-002', customer: 'Globex Inc', item: 'Cloud Compute', qty: 12, carrier: 'UPS', status: 'Processing', eta: '2026-07-18' },
  { id: 'DEL-003', order: 'ORD-004', customer: 'Umbrella Corp', item: 'DB Replication', qty: 2, carrier: 'DHL', status: 'Delivered', eta: '2026-07-12' },
  { id: 'DEL-004', order: 'ORD-005', customer: 'Stark Industries', item: 'AI Unit', qty: 1, carrier: 'FedEx', status: 'Pending Pickup', eta: '2026-07-20' },
];

// Map status to badge variant classes from framework.css
const badgeVariant = {
  'Pending Pickup': 'badge badge-warning',
  Processing: 'badge badge-info',
  'In Transit': 'badge badge-accent',
  Delivered: 'badge badge-success',
};

const DeliveryPage = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_DELIVERIES.filter(
    (d) => d.customer.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()) || d.carrier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex flex-column h-100" style={{boxSizing:'border-box', color:'var(--color-text-primary)', fontFamily:'var(--font-body)'}}>
      {/* ── Header — uses d-flex, gap, px/py utilities ────────────────── */}
      <div className="d-flex ai-center jc-between gap-4 px-5 py-4 border-bottom" style={{backgroundColor:'rgba(0,0,0,0.15)'}}>
        <div>
          <h2 className="fs-16 fw-600 text-primary" style={{fontFamily:'var(--font-display)', margin:0}}>Deliveries</h2>
          <p className="fs-11 text-muted" style={{margin:'2px 0 0 0'}}>Track shipment and delivery status</p>
        </div>
        <div className="pos-relative d-flex ai-center">
          <IconSearch className="pos-absolute pointer-events-none" style={{left:'10px', width:'14px', height:'14px', color:'var(--color-text-muted)'}} />
          <input className="delivery-search" placeholder="Search deliveries..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-6 px-5">
        <div className="d-flex flex-column" style={{gap:0}}>
          {filtered.map((d, i) => (
            <div key={d.id} className="d-flex gap-4 pos-relative">
              {/* ── Timeline column ──────────────────────────────── */}
              <div className="d-flex flex-column ai-center" style={{width:'20px', flexShrink:0}}>
                <div className="delivery-dot" />
                {i < filtered.length - 1 && <div className="delivery-line" />}
              </div>

              {/* ── Card body ────────────────────────────────────── */}
              <div className="delivery-card flex-1">
                <div className="d-flex jc-between ai-center mb-3">
                  <div>
                    <span className="fw-600 fs-13 text-primary">{d.id}</span>
                    <span className="order-ref fs-10 text-muted ml-2">{'Order ' + d.order}</span>
                  </div>
                  <span className={badgeVariant[d.status]}>{d.status}</span>
                </div>

                <div className="detail-grid">
                  <div className="d-flex flex-column" style={{gap:'1px'}}>
                    <span className="detail-label">Customer</span>
                    <span className="detail-value">{d.customer}</span>
                  </div>
                  <div className="d-flex flex-column" style={{gap:'1px'}}>
                    <span className="detail-label">Item</span>
                    <span className="detail-value">{d.item} × {d.qty}</span>
                  </div>
                  <div className="d-flex flex-column" style={{gap:'1px'}}>
                    <span className="detail-label">Carrier</span>
                    <span className="detail-value">{d.carrier}</span>
                  </div>
                  <div className="d-flex flex-column" style={{gap:'1px'}}>
                    <span className="detail-label">ETA</span>
                    <span className="detail-value">{d.eta}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
