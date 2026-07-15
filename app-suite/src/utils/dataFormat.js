/**
 * dataFormat.js — reusable formatting utilities for consistent display across the app.
 *
 * Usage:
 *   import { fmtCurrency, fmtDate, fmtDateTime, fmtNumber } from '@/utils/dataFormat';
 */

/**
 * Format a number as USD currency.
 * @param {number|string} n
 * @returns {string} e.g. "$1,234.56"
 */
export const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

/**
 * Format an ISO date string to a short human-readable date.
 * @param {string|Date} iso
 * @returns {string} e.g. "Jan 5, 2026"
 */
export const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return String(iso);
  }
};

/**
 * Format an ISO date string to a full human-readable date with weekday.
 * @param {string|Date} iso
 * @returns {string} e.g. "Tuesday, January 5, 2026"
 */
export const fmtDateFull = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return String(iso);
  }
};

/**
 * Format an ISO date string to a long human-readable date (full month).
 * @param {string|Date} iso
 * @returns {string} e.g. "January 5, 2026"
 */
export const fmtDateLong = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return String(iso);
  }
};

/**
 * Format an ISO date string to include both date and time.
 * @param {string|Date} iso
 * @returns {string} e.g. "Jan 5, 2026, 3:45 PM"
 */
export const fmtDateTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return String(iso);
  }
};

/**
 * Format a number with locale-aware thousand separators.
 * @param {number|string} n
 * @returns {string} e.g. "1,234"
 */
export const fmtNumber = (n) => {
  if (n == null || isNaN(Number(n))) return '';
  return Number(n).toLocaleString('en-US');
};

/**
 * Format a percentage value.
 * @param {number|string} n
 * @param {number} [decimals=0]
 * @returns {string} e.g. "45%"
 */
export const fmtPercent = (n, decimals = 0) => {
  if (n == null || isNaN(Number(n))) return '';
  return `${Number(n).toFixed(decimals)}%`;
};
