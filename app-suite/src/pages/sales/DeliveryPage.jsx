import React, { useState } from 'react';
import { IconSearch } from '@/assets/icons';
import styles from './DeliveryPage.module.css';

const MOCK_DELIVERIES = [
  { id: 'DEL-001', order: 'ORD-001', customer: 'Acme Corp', item: 'Enterprise Suite', qty: 5, carrier: 'FedEx', status: 'In Transit', eta: '2026-07-15' },
  { id: 'DEL-002', order: 'ORD-002', customer: 'Globex Inc', item: 'Cloud Compute', qty: 12, carrier: 'UPS', status: 'Processing', eta: '2026-07-18' },
  { id: 'DEL-003', order: 'ORD-004', customer: 'Umbrella Corp', item: 'DB Replication', qty: 2, carrier: 'DHL', status: 'Delivered', eta: '2026-07-12' },
  { id: 'DEL-004', order: 'ORD-005', customer: 'Stark Industries', item: 'AI Unit', qty: 1, carrier: 'FedEx', status: 'Pending Pickup', eta: '2026-07-20' },
];

const statusStyles = {
  'Pending Pickup': styles.statusPending,
  Processing: styles.statusProcessing,
  'In Transit': styles.statusTransit,
  Delivered: styles.statusDelivered,
};

const DeliveryPage = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_DELIVERIES.filter(
    (d) => d.customer.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()) || d.carrier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Deliveries</h2>
          <p className={styles.subtitle}>Track shipment and delivery status</p>
        </div>
        <div className={styles.searchWrapper}>
          <IconSearch className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search deliveries..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.timeline}>
          {filtered.map((d, i) => (
            <div key={d.id} className={styles.deliveryCard}>
              <div className={styles.cardLeft}>
                <div className={styles.timelineDot} />
                {i < filtered.length - 1 && <div className={styles.timelineLine} />}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.deliveryId}>{d.id}</span>
                    <span className={styles.orderRef}>Order {d.order}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${statusStyles[d.status]}`}>{d.status}</span>
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Customer</span>
                    <span className={styles.detailValue}>{d.customer}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Item</span>
                    <span className={styles.detailValue}>{d.item} × {d.qty}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Carrier</span>
                    <span className={styles.detailValue}>{d.carrier}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>ETA</span>
                    <span className={styles.detailValue}>{d.eta}</span>
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
