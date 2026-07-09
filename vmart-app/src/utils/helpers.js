/**
 * Calculate average rating from an array of reviews.
 * @param {Array} reviews - Array of review objects with `rating` field.
 * @returns {number} Average rating (0 if no reviews).
 */
export function calcAvg(reviews) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

/**
 * Format an ISO date string to a human-readable Indian-locale format.
 * @param {string} iso - ISO date string.
 * @returns {string} Formatted date (e.g., "15 Jan 2025") or empty string on error.
 */
export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Generate a short unique ID based on timestamp + random characters.
 * @returns {string} Unique ID string.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Calculate the subtotal for an order/invoice item (after discount).
 * @param {{ qty: number, price: number, discount?: number }} item - Item with qty, price, and optional discount %.
 * @returns {number} Subtotal after discount.
 */
export function calcSubtotal(item) {
  const lineTotal = item.qty * Number(item.price_mrrat);
  const discAmount = Number(item.price_dspct) > 0 ? (lineTotal * Number(item.price_dspct)) / 100 : 0;
  return lineTotal - discAmount;
}

/**
 * Resolve an invoice ID to its invoice number.
 * @param {Array} invoices - Array of invoice objects.
 * @param {string} invoiceId - The invoice ID to look up.
 * @returns {string} Invoice number or the original ID if not found.
 */
export function invoiceNumberFromId(invoices, invoiceId) {
  const inv = invoices.find((i) => i.id === invoiceId);
  return inv?.invoiceNumber || invoiceId;
}
