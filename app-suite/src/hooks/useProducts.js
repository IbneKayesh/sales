import createDataHook from './createDataHook';

const INITIAL_PRODUCTS = [
  { id: 'prod-1', name: 'Enterprise Suite License', sku: 'ESL-001', category: 'Software', description: 'Full enterprise license with 24/7 support', costPrice: 600, sellingPrice: 1200, taxRate: 8, margin: 50, variants: [
    { id: 'var-1', name: 'Standard', sku: 'ESL-001-STD', size: '', color: '', priceAdjustment: 0, stock: 10 },
    { id: 'var-2', name: 'Premium', sku: 'ESL-001-PRM', size: '', color: '#8b5cf6', priceAdjustment: 200, stock: 5 },
  ], createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'prod-2', name: 'Cloud Compute Instance', sku: 'CCI-002', category: 'Infrastructure', description: '64GB RAM, 16 vCPU cloud server instance', costPrice: 125, sellingPrice: 250, taxRate: 8, margin: 50, variants: [
    { id: 'var-3', name: 'Small', sku: 'CCI-002-S', size: '2GB RAM', color: '', priceAdjustment: -50, stock: 20 },
    { id: 'var-4', name: 'Medium', sku: 'CCI-002-M', size: '8GB RAM', color: '', priceAdjustment: 0, stock: 15 },
    { id: 'var-5', name: 'Large', sku: 'CCI-002-L', size: '32GB RAM', color: '', priceAdjustment: 100, stock: 8 },
  ], createdAt: '2026-06-05T10:30:00.000Z' },
  { id: 'prod-3', name: 'Developer Subscription', sku: 'DS-003', category: 'Software', description: 'Monthly developer access with API credits', costPrice: 49, sellingPrice: 99, taxRate: 5, margin: 51, variants: [], createdAt: '2026-06-10T12:15:00.000Z' },
  { id: 'prod-4', name: 'Database Replication Node', sku: 'DRN-004', category: 'Infrastructure', description: 'High-availability database replication node', costPrice: 225, sellingPrice: 450, taxRate: 8, margin: 50, variants: [], createdAt: '2026-06-15T14:45:00.000Z' },
  { id: 'prod-5', name: 'AI Inference Unit', sku: 'AIU-005', category: 'AI', description: 'Dedicated AI inference accelerator hardware', costPrice: 1800, sellingPrice: 2900, taxRate: 10, margin: 38, variants: [
    { id: 'var-6', name: 'Base', sku: 'AIU-005-B', size: '1x', color: '', priceAdjustment: 0, stock: 3 },
    { id: 'var-7', name: 'Pro', sku: 'AIU-005-P', size: '2x', color: '', priceAdjustment: 800, stock: 1 },
  ], createdAt: '2026-06-20T09:00:00.000Z' },
];


const useProducts = createDataHook({
  key: 'products_data',
  initialData: INITIAL_PRODUCTS,
  dataKey: 'products',
  idPrefix: 'prod-',
  prepend: true,
  onCreate: (input) => ({
    name: input.name,
    sku: input.sku.toUpperCase(),
    category: input.category,
    description: input.description || '',
    costPrice: Number(input.costPrice),
    sellingPrice: Number(input.sellingPrice),
    taxRate: Number(input.taxRate || 0),
    margin: Math.round(((Number(input.sellingPrice) - Number(input.costPrice)) / Number(input.sellingPrice)) * 100),
    variants: input.variants || [],
  }),
  onUpdate: (item, fields) => ({
    ...item,
    name: fields.name,
    sku: fields.sku.toUpperCase(),
    category: fields.category,
    description: fields.description || '',
    costPrice: Number(fields.costPrice),
    sellingPrice: Number(fields.sellingPrice),
    taxRate: Number(fields.taxRate || 0),
    margin: Math.round(((Number(fields.sellingPrice) - Number(fields.costPrice)) / Number(fields.sellingPrice)) * 100),
    variants: fields.variants || [],
  }),
});

export default useProducts;
