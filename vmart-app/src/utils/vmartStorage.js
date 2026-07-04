// Centralized persistence for vmart demo data (cart, orders, users, wishlist)
import { DEMO_ORDERS } from "@/hooks/useVmartData";
import { getStorageData, setStorageData } from "@/utils/storage";

const mergeOrders = (stored, customerId) => {
  const demo = customerId
    ? DEMO_ORDERS.filter((o) => o.customerId === customerId)
    : DEMO_ORDERS;
  const storedIds = new Set(stored.map((o) => o.id));
  return [...stored, ...demo.filter((o) => !storedIds.has(o.id))];
};

export const loadCustomerOrders = (customerId) => {
  const stored = getStorageData()?.vmartOrders?.[customerId] || [];
  return mergeOrders(stored, customerId);
};

export const saveCustomerOrders = (customerId, orders) => {
  const data = getStorageData();
  setStorageData({
    vmartOrders: { ...(data.vmartOrders || {}), [customerId]: orders },
  });
};

export const loadAllOrders = () => {
  const data = getStorageData();
  const stored = Object.values(data.vmartOrders || {}).flat();
  const storedIds = new Set(stored.map((o) => o.id));
  return [...stored, ...DEMO_ORDERS.filter((o) => !storedIds.has(o.id))];
};

export const appendOrder = (order) => {
  const data = getStorageData();
  const customerOrders = data.vmartOrders?.[order.customerId] || [];
  const updated = [order, ...customerOrders.filter((o) => o.id !== order.id)];
  setStorageData({
    vmartOrders: { ...(data.vmartOrders || {}), [order.customerId]: updated },
  });
  window.dispatchEvent(new Event("vmart-orders-updated"));
};

export const updateStoredOrders = (customerId, orders) => {
  saveCustomerOrders(customerId, orders);
  window.dispatchEvent(new Event("vmart-orders-updated"));
};

export const loadCart = (customerId) => {
  return getStorageData()?.vmartCart?.[customerId] || {};
};

export const saveCart = (customerId, cart) => {
  const data = getStorageData();
  setStorageData({
    vmartCart: { ...(data.vmartCart || {}), [customerId]: cart },
  });
};

export const loadRegisteredUsers = () => getStorageData()?.vmartRegisteredUsers || [];

export const saveRegisteredUser = (user) => {
  const existing = loadRegisteredUsers();
  const idx = existing.findIndex(
    (u) =>
      u.id === user.id ||
      (user.email && u.email === user.email) ||
      (user.mobile && u.mobile === user.mobile)
  );
  const next =
    idx >= 0
      ? existing.map((u, i) => (i === idx ? { ...u, ...user } : u))
      : [...existing, user];
  setStorageData({ vmartRegisteredUsers: next });
};

export const loadWishlist = (customerId) => {
  return getStorageData()?.vmartWishlist?.[customerId] || [];
};

export const saveWishlist = (customerId, ids) => {
  const data = getStorageData();
  setStorageData({
    vmartWishlist: { ...(data.vmartWishlist || {}), [customerId]: ids },
  });
};
