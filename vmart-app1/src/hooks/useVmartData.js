// ─────────────────────────────────────────────────────────────────────────────
// VMART DEMO DATA  — single source of truth for all hooks
// ─────────────────────────────────────────────────────────────────────────────

// ── SHOPS ────────────────────────────────────────────────────────────────────
export const DEMO_SHOPS = [
  { id: 1, name: "Green Mart",    address: "12 Main Road, Dhaka",     phone: "01711000001", productsCount: 8  },
  { id: 2, name: "Blue Store",    address: "45 College Ave, Chittagong", phone: "01711000002", productsCount: 6 },
  { id: 3, name: "Fresh Corner",  address: "7 Lake Road, Sylhet",     phone: "01711000003", productsCount: 5  },
  { id: 4, name: "Janani Store",  address: "Hossain Market, Badda, Dhaka",     phone: "0123456789", productsCount: 5  },
];

// ── USERS ────────────────────────────────────────────────────────────────────
export const DEMO_USERS = [
  { id: 101, email: "shop1@vmart.com",  mobile: "01711000001", password: "123456", role: "SHOP",     name: "Green Mart Owner",  shopId: 1, address: "12 Main Road, Dhaka" },
  { id: 102, email: "shop2@vmart.com",  mobile: "01711000002", password: "123456", role: "SHOP",     name: "Blue Store Owner",  shopId: 2, address: "45 College Ave, Chittagong" },
  { id: 103, email: "shop3@vmart.com",  mobile: "01711000003", password: "123456", role: "SHOP",     name: "Fresh Corner Owner",shopId: 3, address: "7 Lake Road, Sylhet" },
  { id: 201, email: "john@test.com",    mobile: "01812000001", password: "123456", role: "CUSTOMER", name: "John Doe",          shopId: null, address: "House 1, Road 2, Dhaka" },
  { id: 202, email: "sara@test.com",    mobile: "01812000002", password: "123456", role: "CUSTOMER", name: "Sara Ahmed",        shopId: null, address: "Flat 5, Block A, Mirpur" },
  { id: 203, email: "staff1@sgd.com",   mobile: "01700000001", password: "123456", role: "SHOP",     name: "SGD Admin",         shopId: 1, address: "Corporate HQ" },
];

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
export const DEMO_PRODUCTS = [
  // Green Mart (shopId: 1)
  { id: 1001, shopId: 1, shopName: "Green Mart",   name: "Organic Rice 5kg",    price: 480,  category: "Grocery",    stock: 50, icon: "🌾" },
  { id: 1002, shopId: 1, shopName: "Green Mart",   name: "Fresh Milk 1L",       price: 75,   category: "Dairy",      stock: 30, icon: "🥛" },
  { id: 1003, shopId: 1, shopName: "Green Mart",   name: "Bread Loaf",          price: 60,   category: "Bakery",     stock: 20, icon: "🍞" },
  { id: 1004, shopId: 1, shopName: "Green Mart",   name: "Eggs (12 pcs)",       price: 140,  category: "Dairy",      stock: 40, icon: "🥚" },
  { id: 1005, shopId: 1, shopName: "Green Mart",   name: "Cooking Oil 1L",      price: 195,  category: "Grocery",    stock: 25, icon: "🫙" },
  { id: 1006, shopId: 1, shopName: "Green Mart",   name: "Sugar 1kg",           price: 130,  category: "Grocery",    stock: 60, icon: "🍬" },
  { id: 1007, shopId: 1, shopName: "Green Mart",   name: "Dal (Lentil) 1kg",    price: 160,  category: "Grocery",    stock: 35, icon: "🫘" },
  { id: 1008, shopId: 1, shopName: "Green Mart",   name: "Mineral Water 1.5L",  price: 25,   category: "Beverage",   stock: 100, icon: "💧" },
  // Blue Store (shopId: 2)
  { id: 2001, shopId: 2, shopName: "Blue Store",   name: "A4 Paper Ream",       price: 450,  category: "Stationery", stock: 15, icon: "📄" },
  { id: 2002, shopId: 2, shopName: "Blue Store",   name: "Blue Pen Box (10)",   price: 120,  category: "Stationery", stock: 8,  icon: "✒️"  },
  { id: 2003, shopId: 2, shopName: "Blue Store",   name: "Notebook A5",         price: 80,   category: "Stationery", stock: 40, icon: "📒" },
  { id: 2004, shopId: 2, shopName: "Blue Store",   name: "Ink Cartridge",       price: 750,  category: "Electronics",stock: 5,  icon: "🖨️"  },
  { id: 2005, shopId: 2, shopName: "Blue Store",   name: "Stapler",             price: 220,  category: "Stationery", stock: 12, icon: "📌" },
  { id: 2006, shopId: 2, shopName: "Blue Store",   name: "File Folder (10 pcs)",price: 180,  category: "Stationery", stock: 20, icon: "🗂️"  },
  // Fresh Corner (shopId: 3)
  { id: 3001, shopId: 3, shopName: "Fresh Corner", name: "Apple 1kg",           price: 320,  category: "Fruits",     stock: 25, icon: "🍎" },
  { id: 3002, shopId: 3, shopName: "Fresh Corner", name: "Banana Dozen",        price: 80,   category: "Fruits",     stock: 40, icon: "🍌" },
  { id: 3003, shopId: 3, shopName: "Fresh Corner", name: "Tomato 1kg",          price: 60,   category: "Vegetables", stock: 30, icon: "🍅" },
  { id: 3004, shopId: 3, shopName: "Fresh Corner", name: "Potato 1kg",          price: 45,   category: "Vegetables", stock: 50, icon: "🥔" },
  { id: 3005, shopId: 3, shopName: "Fresh Corner", name: "Onion 1kg",           price: 55,   category: "Vegetables", stock: 45, icon: "🧅" },
];

// ── CUSTOMERS (for shop owner view) ─────────────────────────────────────────
export const DEMO_CUSTOMERS = [
  { id: 201, name: "Kayesh",    mobile: "017226888266", email: "ibnekayesh91@gmail.com",  address: "5th Floor, Family Bazar, Sadhinota Soroni, Uttar Badda, Dhaka",    totalOrders: 4, totalSpent: 2340 },
  { id: 202, name: "Sara Ahmed",  mobile: "01812000002", email: "sara@test.com",  address: "Flat 5, Block A, Mirpur",   totalOrders: 2, totalSpent: 1120 },
  { id: 204, name: "Rafiq Islam", mobile: "01913000001", email: "",               address: "Village: Comilla, District: Comilla", totalOrders: 1, totalSpent: 650 },
  { id: 205, name: "Nadia Khan",  mobile: "01614000001", email: "",               address: "Road 12, Gulshan, Dhaka",   totalOrders: 3, totalSpent: 1890 },
];

// ── ORDERS (per customer) ────────────────────────────────────────────────────
export const DEMO_ORDERS = [
  // John's orders (customerId: 201)
  {
    id: "ORD-2001", orderNo: "ORD-2001", customerId: 201, shopId: 1, shopName: "Green Mart",
    date: "2026-06-25", status: "COMPLETED",
    items: [
      { productId: 1001, name: "Organic Rice 5kg", price: 480, qty: 2 },
      { productId: 1002, name: "Fresh Milk 1L",    price: 75,  qty: 3 },
    ],
    total: 1185,
  },
  {
    id: "ORD-2002", orderNo: "ORD-2002", customerId: 201, shopId: 2, shopName: "Blue Store",
    date: "2026-06-28", status: "PENDING",
    items: [
      { productId: 2001, name: "A4 Paper Ream",    price: 450, qty: 1 },
      { productId: 2002, name: "Blue Pen Box (10)",price: 120, qty: 2 },
    ],
    total: 690,
  },
  {
    id: "ORD-2003", orderNo: "ORD-2003", customerId: 201, shopId: 1, shopName: "Green Mart",
    date: "2026-07-01", status: "DRAFT",
    items: [
      { productId: 1003, name: "Bread Loaf",       price: 60,  qty: 2 },
      { productId: 1004, name: "Eggs (12 pcs)",    price: 140, qty: 1 },
    ],
    total: 260,
  },
  {
    id: "ORD-2004", orderNo: "ORD-2004", customerId: 201, shopId: 3, shopName: "Fresh Corner",
    date: "2026-07-02", status: "DELIVERED",
    items: [
      { productId: 3001, name: "Apple 1kg",        price: 320, qty: 1 },
      { productId: 3002, name: "Banana Dozen",     price: 80,  qty: 1 },
    ],
    total: 400,
  },
  // Sara's orders (customerId: 202)
  {
    id: "ORD-2005", orderNo: "ORD-2005", customerId: 202, shopId: 1, shopName: "Green Mart",
    date: "2026-06-30", status: "PAID",
    items: [
      { productId: 1005, name: "Cooking Oil 1L",  price: 195, qty: 2 },
      { productId: 1006, name: "Sugar 1kg",       price: 130, qty: 1 },
    ],
    total: 520,
  },
  {
    id: "ORD-2006", orderNo: "ORD-2006", customerId: 202, shopId: 2, shopName: "Blue Store",
    date: "2026-07-03", status: "DRAFT",
    items: [
      { productId: 2003, name: "Notebook A5",     price: 80,  qty: 3 },
    ],
    total: 240,
  },
];

// ── INVOICES (per shop) ───────────────────────────────────────────────────────
export const DEMO_INVOICES = [
  {
    id: "INV-1001", invoiceNo: "INV-1001", shopId: 1, orderId: "ORD-2001",
    customerId: 201, customerName: "John Doe", customerMobile: "01812000001",
    date: "2026-06-25", dueDate: "2026-07-05", status: "COMPLETED",
    items: [
      { productId: 1001, name: "Organic Rice 5kg", price: 480, qty: 2 },
      { productId: 1002, name: "Fresh Milk 1L",    price: 75,  qty: 3 },
    ],
    subtotal: 1185, discount: 0, total: 1185, paid: 1185, due: 0,
  },
  {
    id: "INV-1002", invoiceNo: "INV-1002", shopId: 1, orderId: "ORD-2002",
    customerId: 201, customerName: "John Doe", customerMobile: "01812000001",
    date: "2026-06-28", dueDate: "2026-07-08", status: "PENDING",
    items: [
      { productId: 1003, name: "Bread Loaf",       price: 60,  qty: 2 },
      { productId: 1004, name: "Eggs (12 pcs)",    price: 140, qty: 1 },
    ],
    subtotal: 260, discount: 0, total: 260, paid: 0, due: 260,
  },
  {
    id: "INV-1003", invoiceNo: "INV-1003", shopId: 1, orderId: null,
    customerId: 205, customerName: "Nadia Khan", customerMobile: "01614000001",
    date: "2026-07-01", dueDate: "2026-07-11", status: "DELIVERED",
    items: [
      { productId: 1005, name: "Cooking Oil 1L",  price: 195, qty: 3 },
      { productId: 1007, name: "Dal (Lentil) 1kg",price: 160, qty: 2 },
    ],
    subtotal: 905, discount: 50, total: 855, paid: 400, due: 455,
  },
  {
    id: "INV-1004", invoiceNo: "INV-1004", shopId: 1, orderId: null,
    customerId: 204, customerName: "Rafiq Islam", customerMobile: "01913000001",
    date: "2026-07-02", dueDate: "2026-07-12", status: "PAID",
    items: [
      { productId: 1006, name: "Sugar 1kg",        price: 130, qty: 3 },
      { productId: 1008, name: "Mineral Water 1.5L", price: 25, qty: 6 },
    ],
    subtotal: 540, discount: 0, total: 540, paid: 540, due: 0,
  },
  // Blue Store invoices (shopId: 2)
  {
    id: "INV-2001", invoiceNo: "INV-2001", shopId: 2, orderId: "ORD-2002",
    customerId: 201, customerName: "John Doe", customerMobile: "01812000001",
    date: "2026-06-28", dueDate: "2026-07-08", status: "PENDING",
    items: [
      { productId: 2001, name: "A4 Paper Ream",    price: 450, qty: 1 },
      { productId: 2002, name: "Blue Pen Box (10)",price: 120, qty: 2 },
    ],
    subtotal: 690, discount: 0, total: 690, paid: 200, due: 490,
  },
  {
    id: "INV-2002", invoiceNo: "INV-2002", shopId: 2, orderId: null,
    customerId: 202, customerName: "Sara Ahmed", customerMobile: "01812000002",
    date: "2026-07-01", dueDate: "2026-07-11", status: "COMPLETED",
    items: [
      { productId: 2003, name: "Notebook A5",      price: 80,  qty: 5 },
      { productId: 2005, name: "Stapler",          price: 220, qty: 1 },
    ],
    subtotal: 620, discount: 20, total: 600, paid: 600, due: 0,
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
export const findUser = (userId) =>
  DEMO_USERS.find(
    (u) =>
      u.email === userId ||
      u.mobile === userId ||
      u.email.toLowerCase() === userId.toLowerCase()
  );

export const getOrdersForCustomer = (customerId) =>
  DEMO_ORDERS.filter((o) => o.customerId === customerId);

export const getOrdersForShop = (shopId) =>
  DEMO_ORDERS.filter((o) => o.shopId === shopId);

export const getInvoicesForShop = (shopId) =>
  DEMO_INVOICES.filter((i) => i.shopId === shopId);

export const getProductsForShop = (shopId) =>
  DEMO_PRODUCTS.filter((p) => p.shopId === shopId);

export const STATUS_COLORS = {
  DRAFT:     { bg: "#f1f5f9", color: "#64748b" },
  PENDING:   { bg: "#fffbeb", color: "#d97706" },
  DELIVERED: { bg: "#eff6ff", color: "#2563eb" },
  PAID:      { bg: "#f0fdf4", color: "#16a34a" },
  COMPLETED: { bg: "#f0fdf4", color: "#15803d" },
  Overdue:   { bg: "#fef2f2", color: "#dc2626" },
};
