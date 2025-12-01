# Cost Price Calculation Implementation

## Overview
Implemented dynamic cost price calculation that distributes extra costs (cost_amount + other_cost) proportionally across all products in a purchase order.

## Changes Made

### 1. ProductComponent.jsx
**File:** `frontend-app/src/pages/purchase/ProductComponent.jsx`

#### Added formData Prop
- Added `formData` to component props to access `cost_amount` and `other_cost`

#### Implemented useEffect Hook (Lines 39-78)
Created a reactive calculation that:
- Monitors changes to `formData.cost_amount`, `formData.other_cost`, and `formDataOrderItems.length`
- Calculates total extra cost: `extraCost = cost_amount + other_cost`
- Distributes extra cost proportionally across all products based on their total_amount
- Updates each product's `cost_price` automatically

#### Cost Price Formula
For each product:
```javascript
baseCostPrice = total_amount / product_qty
extraCostShare = (product_total_amount / grand_total_amount) * total_extra_cost
finalCostPrice = baseCostPrice + (extraCostShare / product_qty)
```

Where:
- `total_amount` = (product_price × product_qty) - discount_amount + tax_amount
- `grand_total_amount` = sum of all products' total_amount
- `total_extra_cost` = cost_amount + other_cost

#### Updated productPrice_BT Function
- Removed outdated comments
- Added clear documentation that cost_price is now calculated reactively
- Displays: `Product Price (Cost Price)` format

### 2. PurchaseFormComponent.jsx
**File:** `frontend-app/src/pages/purchase/PurchaseFormComponent.jsx`

#### Updated ProductComponent Usage (Line 233)
- Added `formData={formData}` prop to pass cost_amount and other_cost to ProductComponent

## How It Works

### Reactive Calculation Flow
1. User changes `cost_amount` or `other_cost` in the payment section
2. useEffect hook detects the change
3. System calculates total extra cost
4. Extra cost is distributed proportionally to each product based on their contribution to the total
5. Each product's `cost_price` is updated automatically
6. UI displays updated cost price in the Price column

### Example Calculation
**Scenario:**
- Product A: total_amount = 1000 BDT, qty = 10
- Product B: total_amount = 500 BDT, qty = 5
- Grand Total: 1500 BDT
- Extra Cost (cost_amount + other_cost): 300 BDT

**Product A:**
- Base cost price: 1000 / 10 = 100 BDT/unit
- Extra cost share: (1000 / 1500) × 300 = 200 BDT
- Final cost price: 100 + (200 / 10) = 120 BDT/unit

**Product B:**
- Base cost price: 500 / 5 = 100 BDT/unit
- Extra cost share: (500 / 1500) × 300 = 100 BDT
- Final cost price: 100 + (100 / 5) = 120 BDT/unit

## Benefits
1. ✅ **Automatic Calculation**: Cost price updates automatically when extra costs change
2. ✅ **Proportional Distribution**: Extra costs are fairly distributed based on product value
3. ✅ **Real-time Updates**: UI reflects changes immediately
4. ✅ **No Manual Intervention**: Users don't need to manually recalculate
5. ✅ **Accurate Costing**: True cost per unit includes all overhead costs

## Testing Recommendations
1. Add products to the order
2. Enter `cost_amount` (e.g., shipping cost)
3. Enter `other_cost` (e.g., handling fees)
4. Verify that cost_price in the Price column updates automatically
5. Edit product quantities and verify cost_price recalculates
6. Add/remove products and verify distribution adjusts accordingly
