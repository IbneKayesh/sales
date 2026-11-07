task status: completed (require re-check)
step 1:
1. useUnifiedProfitROI.js, CalculatorForm.jsx, 05. Return Management > Resell/Repack/Scrap/Dispose value or refund to customer value, all the cost head will be based on Return Management / Returned Qty not to the full Qty (completed: updated cost calculations and subtotal per-unit based on returned_qty, added customer refund value per unit input)
2. 0.6 Profit & ROI summary will be based on Selected 01 Sales Target & Calculation Basis > Target Time Horizon, but after entries user can see result in different time horizon, like Input time horizon is Monthly, but user can select output as daily or weekly, also can be Input daily and see result  Monthly, also ROI result can see as total amount or unit wise (completed: added output horizon switcher and total vs per-unit ROI view mode)
3. Language toggle BN/EN: user can toggle between BN and EN, displaying only one language at a time throughout the calculator (completed: added EN/BN switcher button and single-language translations across all titles, options, breakdown items and cards)
4. Audit & Corrections:
   - Fixed Scrap/Salvage value integration into COGS reduction and net revenue.
   - Fixed return cost head evaluation when returned_qty is 0 (now strictly 0 rather than full batch quantity).
   - Fixed circular inaccuracy in target required selling price by isolating variable percentage selling fees.
   - Added 3PL / Marketplace Fulfillment stocking model (Daraz Mall, FBD, Pathao/Steadfast fulfillment) to cover modern eCommerce businesses.
   - Added Gross Profit & Gross Margin % (Revenue - COGS) and Operating Profit (EBITDA).
   - Added Break-Even Point (BEP units & BEP revenue) and Safety Margin % calculation.
   - Added Total Working Capital Required (initial cash outlay required to fund inventory and operations).
5. Return Management Real Solutions:
   - Resell/Repack: Product is repacked & resold; returned quantity is included into total sold quantity; increases expenses by return processing & courier costs only. Added courier cost collected from customer vs return freight paid to courier company.
   - Scrap: Product sold lower than actual sales price (by unit or total amount); increases net inventory loss and expenses; records scrap sales revenue.
   - Dispose: Zero sales recovery; 100% inventory write-off plus disposal/dumping fee (by unit or total); increases expenses and loss.
6. Target Profit Reverse Calculation (Profit & ROI Summary):
   - Enter targeted net profit (৳) to dynamically calculate required sales quantity (units) and required sales revenue/amount (৳).
   - Incorporates exact contribution margin per unit and net fixed burden offsets (fixed opex, returns, taxes less delivery and scrap income).
   - Real-time comparison with current sales target qty (surplus units achieved vs shortfall units needed).
   - Feasibility guard: flags infeasible profit goals if unit selling price is lower than unit variable cost.
   - Respects selected time horizon multiplier and single-language toggle (EN / BN).
7. In-Depth Explanations & Calculations with Tiny Info Button Popups:
   - Created reusable component `src/components/InfoButton.jsx` displaying a subtle circular `(i)` button that opens a comprehensive popup modal dialog (`Modal.jsx`).
   - Created `src/hooks/M06/profitExplainer.js` providing in-depth financial concept explanations, mathematical formulas, live step-by-step numbers breakdown, and actionable managerial tips.
   - Added across all 12 KPI cards, Target Profit Planner, and Comprehensive Breakdown items in Section 06.
   - Added across Sections 01-05 (Cost Entry Basis, Target Margin %, Planned Discount %, Taxes, Sourcing Models, Stocking Models, Sales Channels, and Return Solutions).
   - Fully localized with dedicated content in both English (EN) and Bengali (BN).
8. Bulk / Wholesale Sales Share Validation & Info Popups:
   - Added real-time sum validation for bulk price tiers sales share (`bulkPrices[].mix`).
   - If total sales share is not equal to 100% (under or over), dynamically displays a prominent red warning banner and status badge showing exact remaining or excess percentage.
   - Replaced static inline note with interactive `InfoButton` (`bulkTiers`) in the title header, showing weighted average price formulas and live tier breakdowns upon click.

task status: pending
step 2:
What I’ll improve
1. Verify every calculation
- Check every formula, input, output, and calculation.
- Test every selection and combination of options.
- Correct incorrect formulas and inconsistent results.
- Check edge cases, percentages, rounding, and currency calculations.
- Ensure changing one input updates all dependent results correctly.

2. Add missing business calculations
I'll review and add commonly needed business metrics, including:

Category Calculations
Profitability - Gross profit, net profit, profit margin
Pricing - Selling price, markup, target profit
Costs - Fixed costs, variable costs, operating expenses
Sales - Revenue, sales targets, daily/monthly targets
Break-even - Break-even units and revenue
Investment - Initial investment, ROI, payback period
Product selection - Product profitability comparison
Discounts - Discount impact, minimum profitable price
Inventory - Stock cost, inventory value, stock turnover
Business decisions - Best-case, expected-case, worst-case scenarios
Cash flow - Cash inflow, outflow, working capital
E-commerce - Platform fees, delivery, packaging, returns
Wholesale/Retail - Wholesale margin, retail margin, distributor profit

I'll also distinguish between accounting profit, cash flow, and actual money available to the business.

3. Improve business decision-making
The calculator should help users answer questions such as:

- Is this product worth selling?
- How much should I charge?
- How many units must I sell to avoid a loss?
- Which product gives me the highest profit?
- How much capital do I need to start?
- What happens if sales decrease by 20%?
- What happens if costs increase?
- Can I afford to offer a discount?
- Which business option is more profitable?
- How long will it take to recover my investment?

4. Improve Bangla and English content
Bangla: I'll use natural, friendly, conversational Bangla instead of overly formal or complicated wording.

For example:

Current/formal style - Improved conversational style

মোট মুনাফার পরিমাণ - মোট কত টাকা লাভ হচ্ছে
সমতা বিন্দু - কত বিক্রি করলে লাভ-লোকসান সমান হবে
প্রাথমিক বিনিয়োগ - ব্যবসা শুরু করতে কত টাকা লাগবে
নিট মুনাফার হার - সব খরচ বাদে কত শতাংশ লাভ থাকছে
পরিচালন ব্যয় - ব্যবসা চালাতে মোট খরচ

English: I'll make the wording simple, consistent, professional, and understandable even for someone without an accounting background.

5. Make the calculator easier to use
- Clear input labels and helpful examples.
- Simple explanations for business terms.
- Sensible default values.
- Easy-to-understand results.
- Warnings when a business is operating at a loss.
- Profitability indicators.
- Comparison between multiple products or business scenarios.
- Recommendations based on actual calculated results.
- Mobile-friendly and easy navigation.

6. Final testing
I'll test different business scenarios, including:

- Profitable businesses.
- Loss-making businesses.
- Zero-profit situations.
- Low-margin and high-margin products.
- Different tax, discount, and expense combinations.
- Small and large investments.
- Different product and business selections.

The goal is to make sure the calculator doesn't just display numbers—it helps people understand what those numbers mean and make better decisions.