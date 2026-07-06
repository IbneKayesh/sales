// ── Sample Seed Data for Virtual Mart ──
// Auto-seeds on first load so the app has content to display.
// Uses emoji placeholders instead of real images.

import { load, save, KEYS } from "./utils/storage";

const sampleShops = [
  { name: "Fresh Mart", description: "Fresh fruits, vegetables, and daily essentials delivered to your doorstep.", contact: "+91-9876543210", address: "12, MG Road, Bangalore" },
  { name: "TechWorld", description: "Latest gadgets, electronics, and accessories at the best prices.", contact: "+91-8765432109", address: "45, Brigade Road, Bangalore" },
  { name: "Style Hub", description: "Trendy clothing, footwear, and accessories for men and women.", contact: "+91-7654321098", address: "78, Commercial Street, Bangalore" },
  { name: "Home Essentials", description: "Everything you need to make your home beautiful and functional.", contact: "+91-6543210987", address: "23, Indiranagar, Bangalore" },
  { name: "Organic Basket", description: "100% organic and natural products sourced directly from farmers.", contact: "+91-5432109876", address: "56, Koramangala, Bangalore" },
];

const sampleProducts = [
  // ── Fresh Mart (Groceries) ──
  { name: "Organic Bananas (1 dozen)", category: "Groceries", shop: "Fresh Mart", price: 60, discount: 0, stock: 50, image: "" },
  { name: "Fresh Apples (1 kg)", category: "Groceries", shop: "Fresh Mart", price: 180, discount: 10, stock: 30, image: "" },
  { name: "Farm Fresh Eggs (12 pcs)", category: "Groceries", shop: "Fresh Mart", price: 90, discount: 0, stock: 40, image: "" },
  { name: "Basmati Rice (5 kg)", category: "Groceries", shop: "Fresh Mart", price: 450, discount: 5, stock: 20, image: "" },
  { name: "Mixed Vegetables (1 kg)", category: "Groceries", shop: "Fresh Mart", price: 80, discount: 0, stock: 35, image: "" },
  { name: "Fresh Milk (1 litre)", category: "Groceries", shop: "Fresh Mart", price: 56, discount: 0, stock: 60, image: "" },

  // ── TechWorld (Electronics) ──
  { name: "Wireless Bluetooth Earbuds", category: "Electronics", shop: "TechWorld", price: 2499, discount: 20, stock: 15, image: "" },
  { name: "Smart Watch Pro", category: "Electronics", shop: "TechWorld", price: 5999, discount: 15, stock: 10, image: "" },
  { name: "USB-C Fast Charger (65W)", category: "Electronics", shop: "TechWorld", price: 1299, discount: 0, stock: 25, image: "" },
  { name: "Laptop Stand Adjustable", category: "Electronics", shop: "TechWorld", price: 899, discount: 10, stock: 18, image: "" },
  { name: "Portable Bluetooth Speaker", category: "Electronics", shop: "TechWorld", price: 1599, discount: 25, stock: 12, image: "" },

  // ── Style Hub (Clothing) ──
  { name: "Men's Cotton T-Shirt", category: "Clothing", shop: "Style Hub", price: 599, discount: 30, stock: 40, image: "" },
  { name: "Women's Floral Dress", category: "Clothing", shop: "Style Hub", price: 1299, discount: 20, stock: 20, image: "" },
  { name: "Denim Jacket", category: "Clothing", shop: "Style Hub", price: 1999, discount: 15, stock: 12, image: "" },
  { name: "Casual Sneakers", category: "Clothing", shop: "Style Hub", price: 2499, discount: 10, stock: 18, image: "" },
  { name: "Premium Sunglasses", category: "Clothing", shop: "Style Hub", price: 1499, discount: 0, stock: 25, image: "" },

  // ── Home Essentials (Home) ──
  { name: "Scented Candle Set (3 pcs)", category: "Home", shop: "Home Essentials", price: 349, discount: 0, stock: 30, image: "" },
  { name: "Bamboo Kitchen Organizer", category: "Home", shop: "Home Essentials", price: 799, discount: 10, stock: 15, image: "" },
  { name: "Microfiber Cleaning Cloth (6 pack)", category: "Home", shop: "Home Essentials", price: 249, discount: 0, stock: 45, image: "" },
  { name: "Decorative Throw Pillow", category: "Home", shop: "Home Essentials", price: 449, discount: 5, stock: 22, image: "" },

  // ── Organic Basket (Groceries) ──
  { name: "Cold Pressed Coconut Oil (500ml)", category: "Groceries", shop: "Organic Basket", price: 399, discount: 0, stock: 20, image: "" },
  { name: "Organic Honey (250g)", category: "Groceries", shop: "Organic Basket", price: 299, discount: 5, stock: 15, image: "" },
  { name: "Multigrain Atta (5 kg)", category: "Groceries", shop: "Organic Basket", price: 320, discount: 8, stock: 18, image: "" },
  { name: "Green Tea (100 bags)", category: "Groceries", shop: "Organic Basket", price: 249, discount: 0, stock: 25, image: "" },
  { name: "Almonds (500g)", category: "Groceries", shop: "Organic Basket", price: 599, discount: 12, stock: 10, image: "" },
];

export function seedSampleData() {
  // Only seed if no shops or products exist yet
  const existingShops = load(KEYS.SHOPS);
  const existingProducts = load(KEYS.PRODUCTS);

  if (existingShops.length === 0) {
    save(KEYS.SHOPS, sampleShops);
  }

  if (existingProducts.length === 0) {
    save(KEYS.PRODUCTS, sampleProducts);
  }

  return { shopsSeeded: existingShops.length === 0, productsSeeded: existingProducts.length === 0 };
}
