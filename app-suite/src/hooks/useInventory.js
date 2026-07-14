import createDataHook from './createDataHook';

const INITIAL_ITEMS = [
  { id: 'inv-1', name: 'Enterprise Suite License', sku: 'ESL-001', category: 'Software', stock: 48, price: 1200, createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'inv-2', name: 'Cloud Compute Instance',     sku: 'CCI-002', category: 'Infrastructure', stock: 120, price: 250, createdAt: '2026-06-05T10:30:00.000Z' },
  { id: 'inv-3', name: 'Developer Subscription',     sku: 'DS-003',  category: 'Software', stock: 200, price: 99, createdAt: '2026-06-10T12:15:00.000Z' },
  { id: 'inv-4', name: 'Database Replication Node',  sku: 'DRN-004', category: 'Infrastructure', stock: 15, price: 450, createdAt: '2026-06-15T14:45:00.000Z' },
  { id: 'inv-5', name: 'AI Inference Unit',          sku: 'AIU-005', category: 'AI', stock: 8, price: 2900, createdAt: '2026-06-20T09:00:00.000Z' },
  { id: 'inv-6', name: 'Smart Card Reader',          sku: 'SCR-006', category: 'Hardware', stock: 72, price: 35, createdAt: '2026-06-25T16:20:00.000Z' },
];

const useInventory = createDataHook({
  key: 'inventory_data',
  initialData: INITIAL_ITEMS,
  dataKey: 'items',
  idPrefix: 'inv-',
  prepend: true,
  onCreate: (input) => ({
    name: input.name,
    sku: input.sku.toUpperCase(),
    category: input.category,
    stock: Number(input.stock),
    price: Number(input.price),
  }),
  onUpdate: (item, fields) => ({
    ...item,
    name: fields.name,
    sku: fields.sku.toUpperCase(),
    category: fields.category,
    stock: Number(fields.stock),
    price: Number(fields.price),
  }),
});

export default useInventory;
