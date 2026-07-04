import React, { useState, createContext, useContext, useEffect } from "react";
import {
  DEMO_INVOICES,
  DEMO_CUSTOMERS,
  getInvoicesForShop,
  getProductsForShop,
  STATUS_COLORS,
} from "@/hooks/useVmartData";
import { loadAllOrders } from "@/utils/vmartStorage";

const ShopContext = createContext();

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};

export const ShopProvider = ({ children, shopId }) => {
  const [invoices, setInvoices] = useState(getInvoicesForShop(shopId));
  const [customers, setCustomers] = useState([...DEMO_CUSTOMERS]);
  const [orders, setOrders] = useState(() =>
    loadAllOrders().filter((o) => o.shopId === shopId)
  );
  const [products, setProducts] = useState(getProductsForShop(shopId));

  useEffect(() => {
    const refresh = () =>
      setOrders(loadAllOrders().filter((o) => o.shopId === shopId));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("vmart-orders-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("vmart-orders-updated", refresh);
    };
  }, [shopId]);

  const getInvoiceById = (id) => invoices.find((i) => i.id === id);
  const dueInvoices = invoices.filter((i) => i.due > 0 && i.status !== "COMPLETED");

  const pendingOrders = orders.filter(
    (o) =>
      ["PENDING", "DELIVERED"].includes(o.status) &&
      !invoices.some((i) => i.orderId === o.id)
  );

  const updateStatus = (invoiceId, newStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    );
  };

  const recordPayment = (invoiceId, amount) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = Math.min(inv.paid + amount, inv.total);
        const newDue = inv.total - newPaid;
        const newStatus = newDue === 0 ? "PAID" : inv.status;
        return { ...inv, paid: newPaid, due: newDue, status: newStatus };
      })
    );
  };

  const createInvoiceFromOrder = (order, deliveryCharge = 0, discount = 0, deliveryMan = "") => {
    const customer = customers.find((c) => c.id === order.customerId);
    const subtotal = order.total;
    const total = subtotal + deliveryCharge - discount;
    const newInv = {
      id: `INV-${Date.now()}`,
      invoiceNo: `INV-${Date.now()}`,
      shopId,
      orderId: order.id,
      customerId: order.customerId,
      customerName: customer?.name || "Unknown",
      customerMobile: customer?.mobile || "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      status: "PENDING",
      deliveryStatus: "PENDING",
      deliveryMan,
      items: order.items.map((i) => ({ ...i })),
      subtotal,
      deliveryCharge,
      discount,
      total,
      paid: 0,
      due: total,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const createBlankInvoice = ({
    customerId,
    customerName,
    customerMobile,
    items,
    deliveryCharge = 0,
    discount = 0,
    deliveryMan = "",
  }) => {
    const subtotal = items.reduce(
      (acc, i) => acc + (i.price - (i.discount || 0)) * i.qty,
      0
    );
    const total = subtotal + deliveryCharge - discount;
    const newInv = {
      id: `INV-${Date.now()}`,
      invoiceNo: `INV-${Date.now()}`,
      shopId,
      orderId: null,
      customerId,
      customerName,
      customerMobile,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
      status: "PENDING",
      deliveryStatus: "PENDING",
      deliveryMan,
      items,
      subtotal,
      deliveryCharge,
      discount,
      total,
      paid: 0,
      due: total,
    };
    setInvoices((prev) => [newInv, ...prev]);
    return newInv;
  };

  const updateInvoiceItems = (
    invoiceId,
    items,
    deliveryCharge = 0,
    discount = 0,
    deliveryMan = "",
    deliveryStatus = ""
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const subtotal = items.reduce(
          (acc, i) => acc + (i.price - (i.discount || 0)) * i.qty,
          0
        );
        const finalDelivery =
          deliveryCharge !== undefined ? deliveryCharge : inv.deliveryCharge || 0;
        const finalDiscount = discount !== undefined ? discount : inv.discount || 0;
        const finalDelMan = deliveryMan !== undefined ? deliveryMan : inv.deliveryMan || "";
        const finalDelStat =
          deliveryStatus !== undefined && deliveryStatus !== ""
            ? deliveryStatus
            : inv.deliveryStatus || "PENDING";
        const total = subtotal + finalDelivery - finalDiscount;
        return {
          ...inv,
          items,
          subtotal,
          deliveryCharge: finalDelivery,
          discount: finalDiscount,
          deliveryMan: finalDelMan,
          deliveryStatus: finalDelStat,
          total,
          due: Math.max(0, total - inv.paid),
        };
      })
    );
  };

  const updateCustomer = (customerId, updates) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
  };

  const addCustomer = ({ name, mobile }) => {
    const newCust = { id: Date.now(), name, mobile };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const addProduct = (product) => {
    setProducts((prev) => [{ ...product, id: Date.now(), shopId }, ...prev]);
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const value = {
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
    addCustomer,
    STATUS_COLORS,
    addProduct,
    updateProduct,
    removeProduct,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
