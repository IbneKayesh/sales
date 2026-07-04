// ─────────────────────────────────────────────────────────────────────────────
// useShopInvoices — Invoice + Due management for SHOP role
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  DEMO_INVOICES,
  DEMO_ORDERS,
  DEMO_CUSTOMERS,
  DEMO_PRODUCTS,
  STATUS_COLORS,
  getInvoicesForShop,
  getOrdersForShop,
  getProductsForShop,
} from "@/hooks/useVmartData";

const useShopInvoices = (shopId) => {
  const [invoices, setInvoices]   = useState(getInvoicesForShop(shopId));
  const [customers, setCustomers] = useState([...DEMO_CUSTOMERS]);
  const [orders]                  = useState(getOrdersForShop(shopId));
  const [products]                = useState(getProductsForShop(shopId));

  // ── Get invoice by ID ─────────────────────────────────────────────────────
  const getInvoiceById = (id) => invoices.find((i) => i.id === id);

  // ── Due invoices (due > 0) ────────────────────────────────────────────────
  const dueInvoices = invoices.filter(
    (i) => i.due > 0 && i.status !== "COMPLETED"
  );

  // ── Update invoice status ─────────────────────────────────────────────────
  const updateStatus = (invoiceId, newStatus) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      )
    );
  };

  // ── Mark payment (partial or full) ───────────────────────────────────────
  const recordPayment = (invoiceId, amount) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = Math.min(inv.paid + amount, inv.total);
        const newDue  = inv.total - newPaid;
        const newStatus = newDue === 0 ? "PAID" : inv.status;
        return { ...inv, paid: newPaid, due: newDue, status: newStatus };
      })
    );
  };

  // ── Create invoice from an order ──────────────────────────────────────────
  const createInvoiceFromOrder = (order) => {
    const newInvoice = {
      id:             `INV-${Date.now()}`,
      invoiceNo:      `INV-${Date.now()}`,
      shopId,
      orderId:        order.id,
      customerId:     order.customerId,
      customerName:   customers.find((c) => c.id === order.customerId)?.name || "Unknown",
      customerMobile: customers.find((c) => c.id === order.customerId)?.mobile || "",
      date:           new Date().toISOString().split("T")[0],
      dueDate:        new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      status:         "PENDING",
      items:          order.items.map((i) => ({ ...i })),
      subtotal:       order.total,
      discount:       0,
      total:          order.total,
      paid:           0,
      due:            order.total,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  // ── Create invoice directly (no order) ───────────────────────────────────
  const createBlankInvoice = (customerId, customerName, customerMobile, items, discount = 0) => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
    const total    = subtotal - discount;
    const newInvoice = {
      id:             `INV-${Date.now()}`,
      invoiceNo:      `INV-${Date.now()}`,
      shopId,
      orderId:        null,
      customerId,
      customerName,
      customerMobile,
      date:           new Date().toISOString().split("T")[0],
      dueDate:        new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      status:         "PENDING",
      items,
      subtotal,
      discount,
      total,
      paid:           0,
      due:            total,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  // ── Update invoice items ──────────────────────────────────────────────────
  const updateInvoiceItems = (invoiceId, items, discount = 0) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
        const total    = subtotal - discount;
        const due      = total - inv.paid;
        return { ...inv, items, subtotal, discount, total, due: Math.max(0, due) };
      })
    );
  };

  // ── Update customer info ──────────────────────────────────────────────────
  const updateCustomer = (customerId, updates) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
  };

  // ── Pending orders (not yet invoiced) ────────────────────────────────────
  const pendingOrders = orders.filter(
    (o) =>
      (o.status === "PENDING" || o.status === "DELIVERED") &&
      !invoices.some((i) => i.orderId === o.id)
  );

  return {
    invoices,
    dueInvoices,
    customers,
    orders,
    products,
    pendingOrders,
    getInvoiceById,
    updateStatus,
    recordPayment,
    createInvoiceFromOrder,
    createBlankInvoice,
    updateInvoiceItems,
    updateCustomer,
    STATUS_COLORS,
  };
};

export default useShopInvoices;
