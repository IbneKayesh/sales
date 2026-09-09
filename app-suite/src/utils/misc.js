import { getStorageData } from "./storage";

const formatNumber = (val, comma = false) => {
  const n = Number(val);

  if (!Number.isFinite(n)) return "0.00";

  const bsins = getStorageData()?.bsins;
  const dcpnt = Number(bsins?.bsins_dcpnt) || 2;

  return n.toLocaleString("en-US", {
    useGrouping: comma,
    minimumFractionDigits: dcpnt,
    maximumFractionDigits: dcpnt,
  });
};

// Safe number conversion (handles null, undefined, NaN, "", etc.)
const validNumber = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const bsins = getStorageData()?.bsins;
  const dcpnt = bsins?.bsins_dcpnt || 2;
  return Number(n.toFixed(Number(dcpnt) || 0));
};

const validNumber_v1 = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Safe divide
const divNumber = (a, b) =>
  validNumber(b) === 0 ? 0 : validNumber(a) / validNumber(b);

// Currency formatting (USD)
const formatCurrency = (n, fractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);

export { formatNumber, validNumber, divNumber, formatCurrency };
