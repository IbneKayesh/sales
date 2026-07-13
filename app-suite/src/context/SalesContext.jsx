import React, { createContext, useContext, useState, useEffect } from 'react';

const SalesContext = createContext();

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

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState(() => {
    const saved = sessionStorage.getItem('sales_data');
    return saved ? JSON.parse(saved) : initialSales;
  });

  useEffect(() => {
    sessionStorage.setItem('sales_data', JSON.stringify(sales));
  }, [sales]);

  const listSales = () => sales;

  const addSale = (sale) => {
    const newSale = {
      customerName: sale.customerName,
      product: sale.product,
      quantity: Number(sale.quantity),
      unitPrice: Number(sale.unitPrice),
      id: `sale-${Math.random().toString(36).substring(2, 9)}`,
      total: Number(sale.quantity) * Number(sale.unitPrice),
      createdAt: new Date().toISOString(),
    };
    setSales((prev) => [newSale, ...prev]);
    return newSale;
  };

  const updateSale = (id, updatedFields) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const qty = updatedFields.quantity !== undefined ? Number(updatedFields.quantity) : s.quantity;
          const price = updatedFields.unitPrice !== undefined ? Number(updatedFields.unitPrice) : s.unitPrice;
          return {
            ...s,
            ...updatedFields,
            quantity: qty,
            unitPrice: price,
            total: qty * price,
          };
        }
        return s;
      })
    );
  };

  const deleteSale = (id) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SalesContext.Provider value={{ sales, listSales, addSale, updateSale, deleteSale }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
