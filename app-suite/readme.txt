task status: completed (step 1 and step 2 both re-checked)
step 1 re-check task list (one by one):
[x] 1. Return Management cost heads based on Returned Qty + resell/repack/scrap/dispose + per-unit customer refund — re-checked, fixed scrap double-count, zero-return logistics, hidden refund field, qty-based gross sales
[x] 2. Output time horizon switcher + total vs per-unit ROI view — re-checked, fixed per-unit values being scaled by the horizon (unit cost, target price, unit COGS/profit and their info popups), scaled qty rows/BEP/required qty consistently, calendar-consistent horizon days (365/12, 182.5)
[x] 3. BN/EN single-language toggle across the calculator — re-checked, dictionaries at parity (197/197, no duplicates), localized 32 hard-coded result labels (breakdown sub-lines, scrap/disposal callouts, target planner, remove buttons) and the horizon status line; InfoButton + explainer chrome verified bilingual
[x] 4. Audit & corrections (COGS, zero returns, target price, 3PL model, gross/operating profit, BEP, working capital) — re-checked; per-unit value selling costs were classed as fixed (inflated BEP and target-profit qty), fixed by splitting variable vs fixed selling; target price and BEP now share one net fixed burden; % return handling isolated from the price; P&L identities and 3PL model verified
[x] 5. Return Management real solutions (resell/repack, scrap, dispose economics) — verified: resell re-sells 100% of qty, scrap sells only non-returned units and books recovery + write-off, dispose books zero recovery + disposal fee, profit ordering resell > scrap > dispose
[x] 6. Target profit reverse calculation — verified required qty/revenue, surplus vs shortfall, feasibility guard when price <= variable cost; over-asking units caused by the fixed-burden bug is fixed (50,000 target now needs 780 units, was 830)
[x] 7. InfoButton + profitExplainer coverage, reusable with no hard-coded copy — verified 23 explainer metrics all wired (12 KPI cards, target planner, breakdown rows, sections 01-05), 66 info buttons, InfoButton is props-only and bilingual
[x] 8. Bulk/wholesale sales share validation + bulkTiers info popup — verified banner + status pill show exact remaining/excess, share display rounded, weighted average normalised by total share, live tier breakdown in the popup

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

InfoButton.jsx - it will reusable components, no hard coded code is there.

task status: completed (re-checked)
step 2:
[x] 1. Verify every calculation
   - Extracted the whole calculation into a pure engine: src/hooks/M06/profitCalculator.js (no React), so it can be tested directly.
   - Added scripts/verify-profit-calculator.mjs (npm run test:roi): 118 checks across resell/scrap/dispose x total-qty/per-unit.
   - Verified identities: netProfit = netRevenue - cogs - opex, netProfit = qty x unit contribution - fixed burden, cashProfit = netProfit, BEP is minimal and covers costs, target-profit qty is minimal and reaches the goal, recommended price hits the target margin, max discount lands on break-even.
   - Edge cases: zero qty, zero returns, all units returned, 100% discount, zero price, refunds, fixed-income-only, loss-making. Percentages are clamped to 0-100 and returns are capped at the batch qty.
   - Fixed: scrap/dispose break-even and target-profit qty were understated because returned units were treated as if they sold at full price. Contribution now uses revenue actually earned per purchased unit (regular sales + scrap).
   - Fixed: target price / break-even price now subtract scrap recovery per unit, so they agree with BEP and the goal-seek.
   - Fixed: Cost Markup (%) now uses (net price - landed cost) / landed cost instead of net profit / total expenses, matching its explanation.
   - Fixed: sales-drop scenarios now respect committed inventory (unsold units keep their cost) instead of pretending the batch shrinks.
   - Fixed: payback is not reported when there is no sales volume.
[x] 2. Add missing business calculations
   - Payback period in days + annualised ROI (was computed but never shown).
   - Break-even net price, break-even list price, maximum safe discount, profit given up to the planned discount.
   - Inventory turnover per year and days inventory held (annualised, so different horizons compare).
   - Daily and monthly sales targets in units and revenue, from the selected input horizon.
   - Sales cushion before a loss, -20% / base / +20% sales scenarios and a +10% cost-shock scenario.
   - Cash inflow, cash outflow and cash left, explicitly reconciled with accounting net profit.
   - Working capital, ROI (existing) plus annualised ROI; contribution margin now exact for every return disposition.
[x] 3. Improve business decision-making
   - New Decision Snapshot panel: plain-language verdict (profitable / thin / loss), minimum units, maximum discount, payback, sales cushion, target-profit gap, cost-shock profit.
   - Loss, thin-margin, infeasible target-profit and no-safe-discount states are flagged in red/amber.
   - Every new metric has a bilingual InfoButton explainer with formula, live numbers and a practical tip (7 new explainer entries).
[x] 4. Improve Bangla and English content
   - Rewrote key BN labels in everyday wording, e.g. net profit -> সব খরচ বাদে কত টাকা লাভ থাকছে, BEP units -> কত পিস বেচলে লাভ-লোকসান সমান হবে, working capital -> ব্যবসা শুরু করতে কত টাকা লাগবে, OPEX -> ব্যবসা চালাতে মোট খরচ, margin -> সব খরচ বাদে কত শতাংশ লাভ থাকছে.
   - New copy added in both EN and BN; dictionaries checked at parity (252/252, no duplicate keys).
[x] 5. Make the calculator easier to use
   - Decision Snapshot turns raw numbers into recommendations; warnings appear when the business operates at a loss or has no discount room.
   - Auto-fit responsive grids for the new panels (mobile-friendly); existing defaults, placeholders and explanations kept.
   - Loss / thin-margin badges and tone colours on the new KPI cards.
[x] 6. Final testing
   - npm run test:roi -> 118 checks passed, 0 failed.
   - npx eslint on profitCalculator.js, profitExplainer.js, useUnifiedProfitROI.js and CalculatorForm.jsx -> clean.
   - npm run build -> succeeds.

Known gap (not implemented): multi-product comparison / "which product is most profitable" needs a multi-product store, which this single-product form does not have. Product-level choice is covered by the -20%/+20% and cost-shock scenarios instead.

step 1: still completed. Step 2 moved the calculation into profitCalculator.js and re-verified all step 1 behaviour (including scrap/dispose economics) with the test suite.
