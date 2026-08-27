# ShopEasy — Comprehensive Feature List

> A complete, client-side-only React e-commerce application built with Vite, React Router, and custom CSS.

---

## Table of Contents

1. [Tech Stack & Architecture](#1-tech-stack--architecture)
2. [Routing](#2-routing)
3. [Home Page](#3-home-page)
4. [Product Details Page](#4-product-details-page)
5. [Cart Page](#5-cart-page)
6. [Checkout Flow](#6-checkout-flow)
7. [Order Confirmation](#7-order-confirmation)
8. [Vendor / Seller System](#8-vendor--seller-system)
9. [Search & Filtering](#9-search--filtering)
10. [State Management](#10-state-management)
11. [Data Layer & Custom Hooks](#11-data-layer--custom-hooks)
12. [UI Components Library](#12-ui-components-library)
13. [Responsive Design](#13-responsive-design)
14. [Accessibility](#14-accessibility)
15. [Design System & CSS](#15-design-system--css)
16. [Utility Functions](#16-utility-functions)
17. [Icons](#17-icons)

---

## 1. Tech Stack & Architecture

- **React 19** with functional components and hooks
- **Vite 8** for fast dev/build
- **React Router DOM v7** for client-side routing
- **Plain CSS** — no Tailwind, Bootstrap, or UI frameworks
- **No backend** — all data is static/mock, served through custom hooks
- **Modular architecture** — clear separation: Pages → Components → Hooks → Data → Utils
- **API-ready design** — custom hooks abstract data access; swapping static data for API calls requires no component changes

### Project Structure

```
src/
├── components/
│   ├── cart/          (5 components)
│   ├── category/      (3 components)
│   ├── checkout/      (5 components)
│   ├── common/        (5 components)
│   ├── layout/        (2 components)
│   ├── product/       (6 components)
│   ├── review/        (2 components)
│   └── vendor/        (1 component)
├── pages/             (7 pages)
├── context/           (2 providers)
├── hooks/             (5 hooks)
├── data/              (6 data modules)
├── utils/             (5 utility files)
├── icons/             (30+ SVG icon components)
└── assets/            (images)
```

**Total: ~49 components, 7 pages, 2 context providers, 5 hooks, 6 data modules, 5 utilities, 30+ icons**

---

## 2. Routing

| Route | Page | Description |
|---|---|---|
| `/` | Home | Product listing with carousel, categories, filters |
| `/product/:slug` | ProductDetails | Product detail page with gallery, specs, reviews |
| `/cart` | Cart | Shopping cart with item selection |
| `/checkout` | Checkout | Multi-step checkout form |
| `/order-confirmation` | OrderConfirmation | Order success page with details |
| `/seller/:slug` | VendorProfile | Vendor/seller profile page |
| `*` | NotFound | 404 page with suggested products |

- SEO-friendly slugs with product IDs (e.g., `/product/wireless-bluetooth-headphones--1`)
- Graceful handling of invalid product IDs and unknown routes
- Breadcrumb navigation on product and vendor pages
- Dynamic document titles per page

---

## 3. Home Page

### Header
- Logo/store name with link to home
- **Search bar** — searches products by name, description, and category; navigates to filtered results via URL query params
- **Cart icon** with live item count badge
- Sticky header on scroll

### Hero Carousel
- Auto-rotating promotional slides (5-second interval)
- Manual navigation with prev/next arrows and dot indicators
- 3 slides: Summer Collection, New Arrivals, Home Essentials
- Each slide links to a category-filtered product listing

### Category Navigation Bar
- Horizontal scrollable category bar below the header
- 27 categories with images: Electronics, Clothing, Home & Kitchen, Sports, Accessories, Food & Drinks, Beauty, Books, Toys, Pet Supplies, Automotive, Garden, Baby & Kids, Health, Office, Travel, Jewelry, Music, Furniture, Art & Crafts, Shoes, Watches, Cameras, Phones, Laptops, Appliances, Outdoor
- Active state highlighting
- Hover effects with image zoom

### Product Grid
- Responsive product card grid (5 columns desktop → 1 column mobile)
- **Infinite scroll / Load More** pagination (20 items per batch)
- Sort dropdown: Name (A-Z), Price (Low/High), Top Rated, Most Reviews, Most in Stock
- Bottom category quick-links during pagination
- "All products loaded" indicator when no more items

### Product Cards
- Product image with hover zoom effect
- Product name (2-line clamp)
- Star rating with review count
- Price with original price (strikethrough) and discount percentage badge
- **Dynamic product tags** (max 2 per card):
  - ⚡ Flash Sale (30%+ discount)
  - 🏷️ Sale (20%+ discount)
  - 🏆 Best Seller (300+ reviews)
  - 📈 Popular (200+ reviews)
  - 🔥 Hot (4.7+ rating, 100+ reviews)
  - 🆕 New (200+ stock)
  - ⏰ Low Stock (≤5 left)
  - Sold Out (0 stock) with overlay and grayscale effect
- Vendor name with verified badge on each card
- Link to product detail page via SEO slug

### Filter Sidebar
- **Category filter** — clickable list with product counts per category
- **Price range filter** — min/max inputs with Apply button
- **Rating filter** — radio buttons: All, 4+, 3+, 2+
- **Stock filter** — radio buttons: All, In Stock, Upcoming (≤10), Out of Stock
- **Clear All** button when any filter is active
- Shows "X of Y products" count
- Sidebar layout on desktop

---

## 4. Product Details Page

### Product Gallery
- Main image with **hover-to-zoom** (2.5x magnification)
- Zoom follows mouse cursor position
- Thumbnail strip below (horizontal scroll)
- Thumbnail hover and click to switch main image
- Zoom hint overlay (appears/disappears on hover)

### Product Information
- Category badge
- Product name
- **Vendor info block** — logo, name, verified badge, rating, review count, location (links to vendor profile)
- Star rating with review count
- Price display with original price, discount percentage, and "Save X%"
- Product description
- **Quantity selector** — increment/decrement with min/max bounds

### Product Actions
- **Add to Cart** button (adds selected quantity)
- **Buy Now** button (adds to cart and navigates to cart)
- Stock status badge:
  - ✅ In Stock (X available)
  - ⚠️ Low Stock (Only X left)
  - ❌ Out of Stock
- Both buttons disabled when out of stock

### Specifications Table
- Key-value specifications from static data
- **Expandable/Collapsible** with Show More/Show Less toggle
- Smooth height transition animation

### Category-Specific Ad Banners
- Contextual promotional banner above product details
- Different banners per category (Electronics, Clothing, Home, Sports, Accessories, Food)
- Links to category-filtered product listing

### Customer Reviews
- **Review summary** — average rating, star display, review count
- **Rating breakdown** — horizontal bar chart showing distribution (5★ to 1★)
- Individual review cards:
  - Author avatar (first letter)
  - Author name and date
  - Star rating
  - Review text
  - **Admin replies** — nested replies from "ShopEasy Admin" with avatar, date, and text
  - Left border accent for reply section
- Empty state when no reviews

### Suggested Products
- "You May Also Like" section below reviews
- Products from the same category
- 4-column grid layout

---

## 5. Cart Page

### Cart Items
- **Per-item selection checkboxes** — select/deselect individual items
- **Select All / Deselect All** header with indeterminate state support
- **Delete Selected** button for bulk removal
- Items grouped by vendor with:
  - Vendor logo, name, and verified badge (links to vendor profile)
  - Vendor subtotal
- Each cart item shows:
  - Checkbox for selection
  - Product image (links to product page)
  - Product name (links to product page)
  - Vendor name with verified badge
  - Unit price
  - **Quantity selector** (inline, with min/max)
  - Remove button
  - Item subtotal
- Selected items have blue border highlight

### Cart Summary (Sidebar)
- **Per-vendor breakdown** for selected items:
  - Vendor name and item count
  - Subtotal per vendor
  - Delivery fee per vendor (with free shipping threshold info)
  - Coupon discount per vendor
- Overall subtotal, delivery, discount, and total
- "Proceed to Checkout" button (disabled when no items selected)
- "Continue Shopping" button
- Sticky sidebar on scroll

### Empty Cart State
- Cart icon and "Your cart is empty" message
- "Continue Shopping" button
- **Suggested products** section — top-rated products displayed in a 4-column grid

### Similar Products
- "You May Also Like" section below cart (when cart has items)
- Same-category products not already in cart
- 4-column grid

---

## 6. Checkout Flow

### Step Navigation
- 3-step progress indicator: Cart → Checkout → Confirmation
- Active, completed, and disabled states
- Connected lines between steps

### Customer Information
- Full Name (required)
- Phone Number (required)
- Email (optional)
- Form validation with inline error messages

### Delivery Information
- Delivery Address (required)
- City (required)
- Postal/ZIP Code (optional)
- Delivery Instructions textarea (optional)
- Per-vendor delivery fee note

### Billing Information
- **"Billing address same as delivery address"** checkbox (default: checked)
- When unchecked, shows:
  - Billing Name (required)
  - Billing Address (required)
  - Billing City (required)
  - Billing Postal/ZIP Code (optional)

### Order Summary (Checkout Sidebar)
- Scrollable item list with images, names, quantities, and prices
- **Per-vendor sections**:
  - Vendor name with verified badge
  - **Delivery Method Selector** — radio buttons per vendor:
    - Standard Delivery (e.g., 5-7 days, $5.99)
    - Express Delivery (e.g., 2-3 days, $12.99)
    - Overnight Delivery (e.g., next day, $24.99)
    - Free shipping when subtotal exceeds vendor threshold
  - **Payment Method Selector** — per vendor:
    - 💵 Cash on Delivery
    - 💳 Card / Online Payment (demo)
  - **Coupon code input** — per vendor:
    - Valid codes: SAVE10, SAVE20, FLAT15, FREESHIP
    - Apply/Remove functionality
    - Success/error feedback
    - Coupon hint text
  - Per-vendor subtotal, delivery, discount, and seller total
- Overall subtotal, delivery (total across sellers), platform discount, seller coupons discount, and grand total

### Form Validation
- Required field validation before order placement
- Inline error messages next to relevant fields
- Prevents checkout with missing required information

### Order Placement
- Generates unique order ID (timestamp + random, format: `ORD-XXXXX-XXXXXX`)
- Generates per-vendor sub-order IDs
- Updates AuthContext with customer information
- Clears cart after successful order
- Navigates to order confirmation with order data in route state
- Redirects to cart if no items selected

---

## 7. Order Confirmation

### Success Display
- Green checkmark icon and "Order Confirmed!" message
- Thank-you message

### Order Details
- **Order Reference** — main order ID
- **Multi-vendor notification** — when order contains items from multiple sellers, shows:
  - Number of sellers
  - Note that each seller ships separately
  - Individual vendor sub-order IDs

### Customer Information
- Name, phone, email

### Delivery Information
- Address, city, postal code
- Delivery method and estimated delivery
- Delivery instructions (if provided)

### Order Items
- **Multi-vendor layout** — when multiple vendors:
  - Vendor logo, name, verified badge (links to vendor profile)
  - Sub-order ID
  - Item list with images, names, quantities, prices
  - Delivery method and payment method per vendor
  - Per-vendor subtotal, delivery, coupon discount, and seller total
- **Single-vendor layout** — flat item list with vendor info per item

### Billing Information
- Name, address, city, postal code

### Payment & Total
- Payment method per vendor (or single method)
- Subtotal, delivery, discount, and grand total

### Actions
- "Continue Shopping" button (links to home)

### Suggested Products
- "You Might Also Like" section
- Top-rated products not in the order
- 4-column grid of product cards

---

## 8. Vendor / Seller System

### Vendor Data Model
- 7 vendors with: id, name, slug, logo, banner, description, rating, reviewCount, location, shippingFrom, responseTime, joinDate, verified status, deliveryMethods, paymentMethods, freeShippingThreshold, categories

### Vendor Profile Page (`/seller/:slug`)
- Breadcrumb navigation
- **Header section**:
  - Banner image background
  - Vendor logo
  - Name with verified badge
  - Rating, review count, location, product count

- **Sidebar**:
  - About section (description, location, ships from, response time, member since)
  - Seller Rating section (large rating display, star visualization, rating breakdown bar chart)

- **Main content**:
  - Product grid (all vendor products, paginated with "Load More")
  - Seller reviews section:
    - Review cards with customer avatar, name, date, rating, title, comment
    - Helpful count
    - Admin replies with nested display

### Vendor Badges
- `VendorBadge` component — small and large sizes
- Shows vendor logo, name, verified status, rating, review count, location
- Used on product cards, cart items, and other contexts

### Per-Vendor Cart & Checkout
- Cart items grouped by vendor
- Each vendor has its own:
  - Delivery methods and pricing
  - Payment methods
  - Coupon codes
  - Sub-order in confirmation

---

## 9. Search & Filtering

### Search
- Header search bar with form submission
- Searches across product name, description, and category
- URL-based: `/?search=query`
- Dynamic page title updates
- Empty results show suggested products

### Filtering (URL-param driven)
- Category filter via URL: `/?category=electronics`
- Filter sidebar with:
  - Category list with product counts
  - Price range (min/max with apply button)
  - Rating (radio: All, 4+, 3+, 2+)
  - Stock status (All, In Stock, Upcoming, Out of Stock)
- Clear All button
- Product count display ("X of Y products")
- Pagination resets on filter change

### Sorting
- Sort dropdown on product grid
- Options: Name (A-Z), Price (Low→High), Price (High→Low), Top Rated, Most Reviews, Most in Stock

---

## 10. State Management

### AuthContext
```
AuthContext
├── user               (guest user object with id, name, email, isGuest)
├── setUser()          (updates user data, sets isGuest=false)
├── isAuthenticated    (boolean, true if not guest)
├── isGuest            (boolean)
└── clearSession()     (resets to guest)
```
- Starts as guest user
- Updated on checkout with customer information
- No login/register UI

### CartContext
```
CartContext
├── cartItems                (array of cart items with quantity)
├── addToCart()              (add product with quantity)
├── removeFromCart()         (remove by product ID)
├── updateQuantity()         (set quantity for item)
├── clearCart()              (empty entire cart)
├── getCartTotal()           (sum of all item prices * quantities)
├── getCartItemCount()       (total quantity across all items)
├── cartByVendor             (items grouped by vendor for display)
├── selectedItems            (items selected for checkout)
├── selectedByVendor         (selected items grouped by vendor)
├── selectedItemIds          (Set of selected product IDs)
├── allItemsSelected         (boolean)
├── someItemsSelected        (boolean, for indeterminate checkbox)
├── toggleItemSelection()    (toggle single item)
├── selectAllItems()         (select all)
├── deselectAllItems()       (deselect all)
├── isItemSelected()         (check if item is selected)
├── vendorCoupons            (per-vendor applied coupons)
├── applyVendorCoupon()      (apply coupon to vendor)
├── removeVendorCoupon()     (remove coupon from vendor)
├── getVendorDiscount()      (calculate discount for vendor)
├── vendorDeliveryMethods    (per-vendor selected delivery method)
├── setVendorDeliveryMethod() (set delivery method for vendor)
├── getVendorDeliveryMethod() (get delivery method for vendor)
├── vendorPaymentMethods     (per-vendor selected payment method)
├── setVendorPaymentMethod() (set payment method for vendor)
├── getVendorPaymentMethod() (get payment method for vendor)
├── getVendorDelivery()      (calculate delivery fee for vendor)
└── totalDeliveryFee         (total delivery across selected vendors)
```
- Item selection system for partial checkout
- Per-vendor coupon, delivery, and payment state
- Auto-initializes default delivery/payment methods when vendors change

---

## 11. Data Layer & Custom Hooks

### Static Data Modules

| Module | Contents |
|---|---|
| `products.js` | 100+ products across 3 main categories (Electronics, Clothing, Home) with id, name, description, price, originalPrice, image, category, vendor_id, rating, reviewCount, stock, specifications, detailedSpecs |
| `categories.js` | 27 categories with id, name, image, description |
| `reviews.js` | Multiple reviews per product with author, rating, text, date, replies |
| `deliveryOptions.js` | 3 delivery options (Standard, Express, Overnight) with pricing and estimated days |
| `vendors.js` | 7 vendors with full profiles, delivery methods, payment methods, free shipping thresholds |
| `vendorReviews.js` | Vendor-specific reviews with customer info, ratings, titles, comments, helpful counts, admin replies |

### Custom Hooks

| Hook | Purpose |
|---|---|
| `useProducts(category, searchQuery)` | Full product filtering, sorting, pagination. Returns filtered products, all filter states, sort state, pagination controls. |
| `useProduct(slugOrId)` | Single product with reviews, suggested products, average rating, rating breakdown. Handles slug→ID extraction. |
| `useCategories()` | Categories with product counts computed from product data. |
| `useReviews(productId)` | Product reviews with average rating and rating breakdown. |
| `useDeliveryOptions()` | Delivery options, default option, and lookup by ID. |

---

## 12. UI Components Library

### Layout Components
| Component | File | Description |
|---|---|---|
| Header | `layout/Header.jsx` | Sticky header with logo, search bar, cart icon with count |
| Footer | `layout/Footer.jsx` | 3-column footer with branding, quick links, contact info |

### Common Components
| Component | File | Description |
|---|---|---|
| Carousel | `common/Carousel.jsx` | Auto-rotating hero carousel with arrows and dots |
| FilterBar | `common/FilterBar.jsx` | Horizontal filter bar with dropdowns (alternative to sidebar) |
| FilterSidebar | `common/FilterSidebar.jsx` | Vertical filter panel with category, price, rating, stock filters |
| QuantitySelector | `common/QuantitySelector.jsx` | +/- buttons with number input, min/max bounds |
| StepNav | `common/StepNav.jsx` | 3-step progress indicator (Cart→Checkout→Confirmation) |

### Product Components
| Component | File | Description |
|---|---|---|
| ProductCard | `product/ProductCard.jsx` | Product card with image, tags, vendor, rating, pricing |
| ProductGrid | `product/ProductGrid.jsx` | Responsive product grid with sort, pagination, load more |
| ProductGallery | `product/ProductGallery.jsx` | Image gallery with hover zoom and thumbnails |
| ProductDetails | `product/ProductDetails.jsx` | Product info: name, vendor, rating, price, description, quantity |
| ProductActions | `product/ProductActions.jsx` | Add to Cart / Buy Now buttons with stock status |
| SuggestedProducts | `product/SuggestedProducts.jsx` | "You May Also Like" product section |

### Cart Components
| Component | File | Description |
|---|---|---|
| CartItem | `cart/CartItem.jsx` | Individual cart item with checkbox, image, details, quantity, subtotal |
| CartList | `cart/CartList.jsx` | Cart items grouped by vendor with select all/delete selected |
| CartSummary | `cart/CartSummary.jsx` | Order summary sidebar with per-vendor breakdown |
| EmptyCart | `cart/EmptyCart.jsx` | Empty cart state with message and suggested products |
| SimilarProducts | `cart/SimilarProducts.jsx` | "You May Also Like" section for cart page |

### Checkout Components
| Component | File | Description |
|---|---|---|
| CustomerInformation | `checkout/CustomerInformation.jsx` | Name, phone, email form fields |
| DeliveryInformation | `checkout/DeliveryInformation.jsx` | Address, city, postal code, instructions |
| BillingInformation | `checkout/BillingInformation.jsx` | Billing form with same-as-delivery toggle |
| OrderSummary | `checkout/OrderSummary.jsx` | Full checkout summary with per-vendor delivery/payment/coupons |
| PaymentSelection | `checkout/PaymentSelection.jsx` | COD / Card payment selector |

### Review Components
| Component | File | Description |
|---|---|---|
| ReviewCard | `review/ReviewCard.jsx` | Individual review with avatar, rating, text, admin replies |
| ReviewList | `review/ReviewList.jsx` | Review summary + breakdown chart + list of review cards |

### Vendor Components
| Component | File | Description |
|---|---|---|
| VendorBadge | `vendor/VendorBadge.jsx` | Small/large vendor badge with logo, name, verified status |

---

## 13. Responsive Design

- **Desktop** (1024px+): 5-column product grid, sidebar filters, full layout
- **Tablet** (768px–1024px): 3-column grid, adjusted spacing
- **Mobile** (480px–768px): 2-column grid, stacked layout
- **Small Mobile** (<480px): Single column, 14px base font size

### Responsive Behaviors
- Product grid adapts: 5 → 3 → 2 → 1 columns
- Cart layout stacks sidebar below items on mobile
- Checkout form stacks columns on mobile
- Header search bar and cart icon remain accessible
- Carousel arrows and dots visible on all sizes
- Footer columns stack on mobile
- Category bar scrolls horizontally on mobile
- Filter sidebar becomes full-width on mobile
- Minimum touch target size of 44px for buttons/inputs
- Box shadow removed from app container on mobile

---

## 14. Accessibility

- **Semantic HTML** throughout (header, main, footer, nav, section, article)
- **ARIA labels** on interactive elements (search, cart, quantity, checkboxes)
- **Focus-visible states** with 2px primary color outline
- **Screen reader only** class (`.sr-only`) for hidden accessible text
- **Skip to content** link
- **Alt text** on all product images
- **Keyboard navigation** supported on all interactive elements
- **prefers-reduced-motion** — disables animations for users who prefer it
- **44px minimum touch targets** on buttons and inputs
- **Form labels** properly associated with inputs
- **Required field indicators** (red asterisk)
- **Inline validation errors** next to form fields
- **Color contrast** — WCAG AA compliant color palette
- **No color-only status communication** — icons/badges supplement colors
- **Proper heading hierarchy** (h1→h2→h3)
- **Role attributes** on custom interactive elements (e.g., `role="group"` on quantity selector)
- **Indeterminate checkbox** state for "Select All" when some items are selected

---

## 15. Design System & CSS

### CSS Variables
- **Colors**: Primary (blue), secondary (slate), success (green), warning (amber), danger (red), info (sky), 10 neutral grays
- **Typography**: System font stack, 8 size variables (xs→4xl)
- **Spacing**: 14 spacing variables (0.25rem→4rem)
- **Border Radius**: 7 values (0.25rem→9999px full)
- **Shadows**: 4 levels (sm, md, lg, xl)
- **Transitions**: 3 speeds (fast 150ms, normal 200ms, slow 300ms)
- **Container**: 1200px max-width with responsive padding

### Utility Classes
- `.container` — centered max-width wrapper
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger` — button variants
- `.form-group`, `.form-label`, `.form-input`, `.form-error` — form elements
- `.rating`, `.rating-star` — star rating display
- `.price`, `.price-original`, `.price-discount` — price styling
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger` — status badges
- `.card` — card container
- `.spinner` — loading spinner
- `.page`, `.page-title` — page layout
- `.grid`, `.grid-2`, `.grid-3`, `.grid-4` — responsive grids
- `.section`, `.section-title` — section layout

### Component-Specific CSS
- All component styles in `App.css` (single file, ~1800 lines)
- Global reset and variables in `index.css`
- No CSS modules, no CSS-in-JS, no preprocessors

---

## 16. Utility Functions

| Function | File | Description |
|---|---|---|
| `formatCurrency(amount, currency)` | `formatCurrency.js` | Formats number as USD currency string using `Intl.NumberFormat` |
| `calculateCart(cartItems, deliveryFee, discount)` | `calculateCart.js` | Calculates subtotal, delivery, discount, total, and item count |
| `generateOrderId()` | `generateOrderId.js` | Generates unique order ID: `ORD-{timestamp}-{random}` |
| `slugify(text)` | `slugify.js` | Converts text to URL-friendly slug |
| `productSlug(name, id)` | `slugify.js` | Generates product slug with embedded ID for uniqueness |
| `extractProductId(slug)` | `slugify.js` | Extracts product ID from slug string |
| `getProductTags(product)` | `productTags.js` | Generates dynamic product tags based on discount, rating, reviews, stock |

---

## 17. Icons

30+ custom SVG icon components in `src/icons/index.jsx`:

| Icon | Usage |
|---|---|
| CartIcon | Header cart, empty cart, order confirmation |
| SearchIcon | Header search |
| HomeIcon | 404 page |
| CloseIcon | Cart item remove |
| CheckIcon | Step nav completion, order confirmation |
| MoreIcon | General use |
| StarIcon | Rating display |
| ZoomIcon | Product gallery zoom hint |
| TrashIcon | Delete actions |
| ChevronRight/LeftIcon | Carousel navigation |
| MinusIcon/PlusIcon | Quantity controls |
| FilterIcon | Filter components |
| PackageIcon | Order items |
| TruckIcon | Delivery information |
| CreditCardIcon/CreditCardSmallIcon | Payment sections |
| MailIcon | Email fields |
| PhoneIcon | Phone fields |
| MapPinIcon | Address fields |
| UserIcon | Customer information |
| TagIcon | Coupon/discount |
| ArrowRightIcon | CTAs |
| ShoppingBagIcon | Shopping actions |
| RefreshIcon | Reload actions |
| ShieldIcon | Security/trust indicators |

---

## Summary Statistics

| Metric | Count |
|---|---|
| Pages | 7 |
| Components | 49 |
| Context Providers | 2 |
| Custom Hooks | 5 |
| Data Modules | 6 |
| Utility Functions | 7 |
| Icon Components | 30+ |
| Product Categories | 27 |
| Products | 100+ |
| Vendors | 7 |
| CSS Lines | ~1,800+ |
| Total Source Files | ~72 |
