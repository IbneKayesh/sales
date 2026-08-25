export const vendors = [
  {
    id: "v1",
    name: "TechGear Official",
    slug: "techgear-official",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100",
    banner: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
    description: "Official store for premium electronics and gadgets. Authorized retailer with full warranty support.",
    rating: 4.8,
    reviewCount: 2450,
    productCount: 156,
    joinDate: "2023-01-15",
    location: "San Francisco, CA",
    verified: true,
    responseTime: "Within 2 hours",
    shippingFrom: "California, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "5-7 business days", price: 5.99, freeOver: 50 },
      { id: "express", name: "Express Delivery", description: "2-3 business days", price: 12.99, freeOver: null },
      { id: "overnight", name: "Overnight Shipping", description: "Next business day", price: 24.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card", "paypal"]
  },
  {
    id: "v2",
    name: "FashionHub Store",
    slug: "fashionhub-store",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100",
    banner: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
    description: "Trendy clothing and accessories for the modern lifestyle. New collections added weekly.",
    rating: 4.6,
    reviewCount: 1890,
    productCount: 234,
    joinDate: "2022-06-20",
    location: "New York, NY",
    verified: true,
    responseTime: "Within 4 hours",
    shippingFrom: "New York, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "5-7 business days", price: 3.99, freeOver: 40 },
      { id: "express", name: "Express Delivery", description: "2-3 business days", price: 9.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card", "paypal", "klarna"]
  },
  {
    id: "v3",
    name: "HomeEssentials",
    slug: "homeessentials",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100",
    banner: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    description: "Quality home and kitchen products. Making your home beautiful since 2020.",
    rating: 4.7,
    reviewCount: 1245,
    productCount: 189,
    joinDate: "2020-03-10",
    location: "Chicago, IL",
    verified: true,
    responseTime: "Within 6 hours",
    shippingFrom: "Illinois, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "7-10 business days", price: 7.99, freeOver: 75 },
      { id: "express", name: "Express Delivery", description: "3-5 business days", price: 14.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card", "paypal"]
  },
  {
    id: "v4",
    name: "SportZone Pro",
    slug: "sportzone-pro",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100",
    banner: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    description: "Professional sports equipment and fitness gear. Trusted by athletes worldwide.",
    rating: 4.5,
    reviewCount: 987,
    productCount: 145,
    joinDate: "2021-08-05",
    location: "Austin, TX",
    verified: true,
    responseTime: "Within 3 hours",
    shippingFrom: "Texas, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "5-7 business days", price: 4.99, freeOver: 60 },
      { id: "express", name: "Express Delivery", description: "2-3 business days", price: 11.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card"]
  },
  {
    id: "v5",
    name: "AccessoriesWorld",
    slug: "accessoriesworld",
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
    banner: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    description: "Premium accessories for everyday use. Quality guaranteed.",
    rating: 4.4,
    reviewCount: 756,
    productCount: 178,
    joinDate: "2022-01-20",
    location: "Miami, FL",
    verified: true,
    responseTime: "Within 8 hours",
    shippingFrom: "Florida, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "5-7 business days", price: 2.99, freeOver: 30 },
      { id: "express", name: "Express Delivery", description: "2-3 business days", price: 8.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card", "paypal", "klarna", "applepay"]
  },
  {
    id: "v6",
    name: "FreshMarket",
    slug: "freshmarket",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100",
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
    description: "Fresh and organic food products delivered to your doorstep. Farm to table goodness.",
    rating: 4.9,
    reviewCount: 2100,
    productCount: 167,
    joinDate: "2021-04-15",
    location: "Portland, OR",
    verified: true,
    responseTime: "Within 1 hour",
    shippingFrom: "Oregon, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "3-5 business days", price: 6.99, freeOver: 50 },
      { id: "express", name: "Express Delivery", description: "1-2 business days", price: 14.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card", "paypal"]
  },
  {
    id: "v7",
    name: "GadgetWorld",
    slug: "gadgetworld",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    description: "Latest gadgets and tech accessories at competitive prices. Fast shipping worldwide.",
    rating: 4.3,
    reviewCount: 654,
    productCount: 123,
    joinDate: "2023-05-10",
    location: "Seattle, WA",
    verified: false,
    responseTime: "Within 12 hours",
    shippingFrom: "Washington, USA",
    deliveryMethods: [
      { id: "standard", name: "Standard Delivery", description: "5-7 business days", price: 4.99, freeOver: 40 },
      { id: "express", name: "Express Delivery", description: "2-3 business days", price: 10.99, freeOver: null }
    ],
    paymentMethods: ["cod", "card"]
  }
];

export const getVendorById = (id) => {
  return vendors.find(v => v.id === id) || null;
};

export const getVendorBySlug = (slug) => {
  return vendors.find(v => v.slug === slug) || null;
};

/**
 * Get delivery fee for a vendor based on subtotal and selected delivery method
 */
export const getVendorDeliveryFee = (vendorId, subtotal, deliveryMethodId = "standard") => {
  const vendor = getVendorById(vendorId);
  if (!vendor) return 0;
  const method = vendor.deliveryMethods.find(m => m.id === deliveryMethodId) || vendor.deliveryMethods[0];
  if (method.freeOver && subtotal >= method.freeOver) return 0;
  return method.price;
};

/**
 * Get payment method labels
 */
export const PAYMENT_METHOD_LABELS = {
  cod: "Cash on Delivery",
  card: "Credit / Debit Card",
  paypal: "PayPal",
  klarna: "Klarna - Pay Later",
  applepay: "Apple Pay"
};

export const PAYMENT_METHOD_ICONS = {
  cod: "💵",
  card: "💳",
  paypal: "🅿️",
  klarna: "🔄",
  applepay: "🍎"
};

export default vendors;
