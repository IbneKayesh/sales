const formatNumber = (val, dec = 2) => {
  const num = Number(val) || 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
};

// Safe number conversion (handles null, undefined, NaN, "", etc.)
const validNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Safe divide
const divNumber = (a, b) =>
  validNumber(b) === 0 ? 0 : validNumber(a) / validNumber(b);

export { formatNumber, validNumber, divNumber };
