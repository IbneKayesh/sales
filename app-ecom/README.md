# React + Vite

# Build a Simple, Modular React E-commerce App

Create a **simple, fast, clean client-side e-commerce application using React**. The application should be easy to understand, easy to maintain, and easy to extend later when a backend/API is introduced.

The goal is **not to build a complex production marketplace**. Build a small but complete shopping experience with a straightforward UI and all essential e-commerce flows.

## Core Requirements

* React-based application.
* Client-side only.
* No backend.
* No API calls for now.
* Use **static/mock data exposed through custom React hooks**.
* Structure the application in a **modular, component-based architecture**.
* Use reusable components wherever practical.
* Use React Context where global state is required.
* Create an `AuthContext` for global session/user information, even though there is **no login/register page**.
* Do not implement authentication screens.
* The user can enter their delivery/customer information during checkout.
* Use **plain CSS written from scratch**.
* Do **not** use Tailwind, Bootstrap, Material UI, Ant Design, Chakra UI, or any other third-party CSS/UI library.
* Keep the UI lightweight, responsive, accessible, and easy to navigate.
* Avoid unnecessary animations, complex interactions, or over-engineering.

---

# Application Pages

## 1. Home Page

Create a clean e-commerce homepage containing:

### Header

* Logo/store name.
* Home navigation.
* Product/category navigation where useful.
* Cart icon/link with cart item count.
* Simple responsive mobile navigation.
* No login/register UI.

### Categories Section

Display a list/grid of product categories.

Each category should:

* Have a name.
* Optionally have an image/icon.
* Be clickable.
* Navigate/filter to products belonging to that category.

### Products Section

Display a list/grid of products.

Each product card should include:

* Product image.
* Product name.
* Short description.
* Price.
* Optional original price/discount.
* Rating.
* Add to Cart button.
* View Product button/card link.

Create reusable components such as:

* `Header`
* `CategoryCard`
* `CategoryList`
* `ProductCard`
* `ProductGrid`
* `Footer`

---

# 2. Product Details Page

Create a product details page accessible from product cards.

Display:

* Product image/gallery.
* Product name.
* Price.
* Discount/original price if applicable.
* Rating.
* Product description.
* Available quantity/stock status.
* Quantity selector.
* Add to Cart button.
* Buy Now button if appropriate.
* Category.
* Product specifications/details.

## Suggested Products

Below the product information, display related/suggested products.

Suggested products should be based on:

* Same category.
* Similar product type.
* Or another simple static-data-based recommendation strategy.

Do not implement a complicated recommendation algorithm.

## Product Reviews

Display a reviews section containing:

* Average rating.
* Rating breakdown if practical.
* Review count.
* Individual reviews.
* Reviewer name.
* Rating.
* Review text.
* Review date.

Reviews should come from static mock data for now.

Create reusable components such as:

* `ProductDetails`
* `ProductGallery`
* `QuantitySelector`
* `ProductActions`
* `SuggestedProducts`
* `ReviewList`
* `ReviewCard`
* `Rating`

---

# 3. Cart Page

Create a simple shopping cart page.

Display:

* Cart items.
* Product image.
* Product name.
* Price.
* Quantity selector.
* Item subtotal.
* Remove item button.
* Cart subtotal.
* Delivery/shipping cost.
* Discount if applicable.
* Final total.

Allow the user to:

* Increase/decrease quantity.
* Remove products.
* Continue shopping.
* Proceed to checkout.

## Similar Products

If the cart contains products, display a small "You may also like" / "Similar Products" section below the cart.

Use the existing static product data and a simple category-based matching strategy.

## Empty Cart

Create a proper empty-cart state:

* Clear message.
* Continue Shopping button.
* No broken layout.

Create reusable components:

* `CartItem`
* `CartList`
* `CartSummary`
* `EmptyCart`
* `SimilarProducts`

---

# 4. Checkout / Payment Confirmation Flow

Create a simple checkout flow.

There should be **no login or registration requirement**.

The customer directly enters their information.

## Customer Information

Collect:

* Full name.
* Phone number.
* Email (optional if desired).
* Delivery address.
* City.
* Postal/ZIP code if applicable.
* Additional delivery instructions.

## Delivery Information

Display/select:

* Delivery method.
* Estimated delivery information.
* Delivery charge.

Keep this simple. Do not build a complex shipping system.

## Billing Information

Provide billing information fields where necessary:

* Billing name.
* Billing address.
* City.
* Postal/ZIP code.

Include an option such as:

* `Billing address same as delivery address`

When selected, reuse the delivery information instead of asking the user to enter it again.

## Order Summary

Before confirmation, show:

* Products.
* Quantities.
* Subtotal.
* Delivery fee.
* Discounts if applicable.
* Final total.

## Payment

Since this is a client-only demo, **do not integrate a real payment gateway**.

Create a simple payment selection UI such as:

* Cash on Delivery.
* Card / Online Payment (demo only).

For online payment, do not process real payments. Treat it as a placeholder that can later be connected to a payment provider/backend.

## Confirmation Page

After the user confirms the order, show a clear confirmation screen containing:

* Success message.
* Order/reference number generated on the client.
* Customer name.
* Delivery address.
* Delivery information.
* Order items.
* Billing information.
* Payment method.
* Total amount.
* Estimated delivery information.

Provide buttons such as:

* Continue Shopping.
* View Order Summary.

---

# State Management

Use React state/context appropriately.

Create an `AuthContext` for global session/user information.

Even though there is no login page, the context should support a guest/customer session, for example:

```text
AuthContext
├── user
├── setUser
├── isAuthenticated
├── isGuest
└── clearSession
```

The checkout flow should be able to store the customer's entered information in this context/session state.

Also create a cart state/context, for example:

```text
CartContext
├── cartItems
├── addToCart()
├── removeFromCart()
├── updateQuantity()
├── clearCart()
├── getCartTotal()
└── getCartItemCount()
```

Do not introduce Redux or another state-management library.

Use React Context + hooks.

---

# Static Data

Do not connect to an API.

Create local mock/static data for:

* Products.
* Categories.
* Product reviews.
* Suggested products if necessary.
* Delivery options.

Expose the data through custom hooks rather than importing raw data everywhere.

For example:

```text
useProducts()
useProduct(productId)
useCategories()
useReviews(productId)
useDeliveryOptions()
```

Make the hooks easy to replace later with API calls.

The components should not need to know whether the data comes from static data or an API.

---

# Suggested Project Structure

Use a modular structure similar to:

```text
src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── product/
│   ├── category/
│   ├── cart/
│   ├── checkout/
│   └── review/
│
├── pages/
│   ├── Home/
│   ├── ProductDetails/
│   ├── Cart/
│   ├── Checkout/
│   └── OrderConfirmation/
│
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
├── hooks/
│   ├── useProducts.js
│   ├── useProduct.js
│   ├── useCategories.js
│   ├── useReviews.js
│   └── useDeliveryOptions.js
│
├── data/
│   ├── products.js
│   ├── categories.js
│   ├── reviews.js
│   └── deliveryOptions.js
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
│
├── utils/
│   ├── formatCurrency.js
│   ├── calculateCart.js
│   └── generateOrderId.js
│
├── App.jsx
└── main.jsx
```

Adjust the structure if a simpler organization is more appropriate, but maintain clear separation between:

**pages → components → hooks → data/state → utilities**

---

# Routing

Use client-side routing for:

* `/`
* `/product/:id`
* `/cart`
* `/checkout`
* `/order-confirmation`

If a routing library is already part of the project, use it. Otherwise use a lightweight standard React routing approach appropriate for the project.

Handle invalid product IDs and unknown routes gracefully.

---

# CSS Requirements

Write **all CSS from scratch**.

Do not use:

* Tailwind CSS.
* Bootstrap.
* Material UI.
* Ant Design.
* Chakra UI.
* CSS component libraries.
* Prebuilt design systems.

Create a small set of CSS variables for:

* Colors.
* Typography.
* Spacing.
* Border radius.
* Shadows.
* Container width.

Use a consistent design system throughout the app.

The UI should be:

* Clean.
* Minimal.
* Modern.
* Responsive.
* Mobile-friendly.
* Easy to scan.
* Comfortable for shopping.
* Accessible.

Avoid excessive gradients, animations, huge typography, or decorative elements that make shopping harder.

---

# Responsive Design

Support:

* Desktop.
* Tablet.
* Mobile.

Product grids should automatically adapt to screen size.

The header, cart, checkout forms, product details, and order confirmation should all work comfortably on small screens.

Use CSS media queries written manually.

---

# UX Requirements

Prioritize simplicity.

Important UX behaviors:

* Product cards should be easy to click.
* Add-to-cart should provide clear feedback.
* Cart count should update immediately.
* Cart quantities should update immediately.
* Product prices should be clearly visible.
* Checkout should be short and easy to understand.
* Clearly distinguish required and optional fields.
* Show validation errors next to relevant fields.
* Prevent checkout when required information is missing.
* Preserve cart state while navigating.
* Show useful empty/loading/error states where appropriate.
* Do not require account creation.
* Do not make the user navigate through unnecessary steps.

---

# Accessibility

Follow basic accessibility best practices:

* Use semantic HTML.
* Use proper labels for form inputs.
* Ensure buttons have meaningful labels.
* Provide alt text for product images.
* Maintain reasonable color contrast.
* Support keyboard navigation.
* Use visible focus states.
* Do not rely only on color to communicate status.

---

# Demo Data

Include enough realistic mock data to make the application feel complete:

* At least 5 categories.
* At least 15 products.
* Multiple products per category.
* Multiple reviews across products.
* Different product prices.
* Some discounted products.
* Different ratings.
* At least 2 delivery options.

Use placeholder/product images that can easily be replaced later.

---

# Architecture Principle

Design the application so that replacing mock data with APIs later is straightforward.

For example, this:

```text
Component
   ↓
Custom Hook
   ↓
Static Data
```

should later be replaceable with:

```text
Component
   ↓
Custom Hook
   ↓
API Service
   ↓
Backend
```

Do not put mock data directly inside UI components.

Keep business logic out of presentational components wherever practical.

---

# Code Quality

Write clean, readable React code.

Requirements:

* Functional components.
* React hooks.
* Reusable components.
* Meaningful component/file names.
* Avoid unnecessarily large components.
* Avoid duplicated UI/business logic.
* Keep calculations in utilities/hooks where appropriate.
* Keep static data separate from components.
* Use consistent naming conventions.
* Add comments only where they provide useful context.
* Avoid premature abstraction and over-engineering.

---

# Important Scope Limitations

Do **not** add:

* Login page.
* Registration page.
* Forgot password.
* Admin dashboard.
* Backend.
* Database.
* Real payment processing.
* Real authentication.
* Product management.
* Complex search engine.
* Complex recommendation engine.
* Wishlist unless it is extremely simple and does not distract from the core requirements.
* Complex animations.
* Third-party UI/CSS frameworks.

The application should feel like a **small, polished, easy-to-use e-commerce frontend**, not a large enterprise application.

## Final Goal

Build a complete, working client-side shopping experience:

**Home → Product → Add to Cart → Cart → Checkout → Payment Selection → Order Confirmation**

The result should be visually clean, responsive, modular, easy to understand, and ready for future API/backend integration without requiring a major rewrite.