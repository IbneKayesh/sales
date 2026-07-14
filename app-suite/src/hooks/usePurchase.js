import createDataHook from './createDataHook';

const INITIAL_PURCHASES = [
  { id: 'PO-001', vendor: 'TechMart Supplies', item: 'Server Racks', qty: 4, total: 4800, status: 'Pending', date: '2026-07-14', createdAt: '2026-07-10T08:00:00.000Z' },
  { id: 'PO-002', vendor: 'Global Parts Co.', item: 'Network Switches', qty: 10, total: 2500, status: 'Approved', date: '2026-07-13', createdAt: '2026-07-11T10:30:00.000Z' },
  { id: 'PO-003', vendor: 'OfficeDepot Pro', item: 'Workstations', qty: 8, total: 12000, status: 'Delivered', date: '2026-07-10', createdAt: '2026-07-09T12:15:00.000Z' },
  { id: 'PO-004', vendor: 'CloudStack Inc.', item: 'SSL Certificates', qty: 3, total: 450, status: 'Pending', date: '2026-07-12', createdAt: '2026-07-10T14:45:00.000Z' },
  { id: 'PO-005', vendor: 'TechMart Supplies', item: 'Cooling Units', qty: 2, total: 5800, status: 'Approved', date: '2026-07-11', createdAt: '2026-07-09T09:00:00.000Z' },
];

const usePurchase = createDataHook({
  key: 'purchase_data',
  initialData: INITIAL_PURCHASES,
  dataKey: 'purchases',
  idFn: (items) => `PO-${String(items.length + 1).padStart(3, '0')}`,
  onCreate: (input) => ({
    ...input,
    total: Number(input.qty) * Number(input.unitPrice || 0),
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
  }),
  onUpdate: (item, fields) => {
    const qty = fields.qty !== undefined ? Number(fields.qty) : item.qty;
    const unitPrice = fields.unitPrice !== undefined ? Number(fields.unitPrice) : item.total / item.qty;
    return { ...item, ...fields, qty, total: qty * unitPrice };
  },
});

export default usePurchase;
