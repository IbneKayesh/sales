import createDataHook from './createDataHook';

const initialSales = [
  {
    id: 'sale-1',
    customerName: 'Acme Corp',
    product: 'Enterprise Suite License',
    quantity: 5,
    unitPrice: 1200,
    total: 6000,
    createdAt: '2026-07-10T10:00:00.000Z',
  },
  {
    id: 'sale-2',
    customerName: 'Globex Corporation',
    product: 'Cloud Compute Instance',
    quantity: 12,
    unitPrice: 250,
    total: 3000,
    createdAt: '2026-07-11T14:30:00.000Z',
  },
  {
    id: 'sale-3',
    customerName: 'Initech LLC',
    product: 'Developer Subscription',
    quantity: 8,
    unitPrice: 99,
    total: 792,
    createdAt: '2026-07-12T09:15:00.000Z',
  },
  {
    id: 'sale-4',
    customerName: 'Umbrella Corp',
    product: 'Database Replication Node',
    quantity: 2,
    unitPrice: 450,
    total: 900,
    createdAt: '2026-07-13T16:20:00.000Z',
  },
];

const useSales = createDataHook({
  key: 'sales_data',
  initialData: initialSales,
  dataKey: 'sales',
  idPrefix: 'sale-',
  prepend: true,
  onCreate: (input) => ({
    customerName: input.customerName,
    product: input.product,
    quantity: Number(input.quantity),
    unitPrice: Number(input.unitPrice),
    total: Number(input.quantity) * Number(input.unitPrice),
  }),
  onUpdate: (item, fields) => {
    const qty = fields.quantity !== undefined ? Number(fields.quantity) : item.quantity;
    const price = fields.unitPrice !== undefined ? Number(fields.unitPrice) : item.unitPrice;
    return { ...item, ...fields, quantity: qty, unitPrice: price, total: qty * price };
  },
});

export default useSales;
