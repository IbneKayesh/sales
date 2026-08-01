/**
 * Shared helpers for print documents (Journal Voucher / Client Invoice)
 */

export const fmt = (v) =>
  (Number(v) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const MetaItem = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 0,
      lineHeight: 1.25,
      minWidth: 0,
    }}
  >
    <span
      style={{
        fontSize: 7,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#555",
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 10, fontWeight: 600, color: "#000" }}>
      {value || "—"}
    </span>
  </div>
);

/* --------------------------------------------------------------------------
   Amount in words (BDT style: Crore / Lakh / Thousand / Hundred)
   -------------------------------------------------------------------------- */
const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const twoDigits = (n) => {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? " " + ONES[o] : "");
};

const threeDigits = (n) => {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return (
    (h ? ONES[h] + " Hundred" + (rest ? " " : "") : "") +
    (rest ? twoDigits(rest) : "")
  );
};

const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  let words = "";
  if (crore) words += threeDigits(crore) + " Crore ";
  if (lakh) words += threeDigits(lakh) + " Lakh ";
  if (thousand) words += threeDigits(thousand) + " Thousand ";
  if (rest) words += threeDigits(rest);
  return words.trim();
};

export const amountInWords = (amount) => {
  const total = Number(amount) || 0;
  let taka = Math.floor(total);
  let paisa = Math.round((total - taka) * 100);
  // Handle rounding overflow (e.g. 1.999 -> 1 Taka 100 Paisa)
  if (paisa === 100) {
    taka += 1;
    paisa = 0;
  }
  let words = numberToWords(taka) + " Taka";
  if (paisa > 0) words += " and " + numberToWords(paisa) + " Paisa";
  return words + " Only";
};

/* --------------------------------------------------------------------------
   Default signer name used on printed documents (until wired to Settings).
   -------------------------------------------------------------------------- */
export const DEFAULT_SIGNER_NAME = "Ibne Kayesh";

/* --------------------------------------------------------------------------
   Company / seller header shown at the top of printed documents.
   NOTE: Hardcoded defaults for now - wire to Settings/localStorage later.
   -------------------------------------------------------------------------- */
const COMPANY_DEFAULTS = {
  name: "AppSuite Inc.",
  address: "House 12, Road 5, Gulshan-1, Dhaka 1212, Bangladesh",
  taxId: "BIN: 001234567-0101 | TIN: 123-456-789",
};

export const CompanyHeader = ({ name, address, taxId }) => {
  const company = {
    name: name ?? COMPANY_DEFAULTS.name,
    address: address ?? COMPANY_DEFAULTS.address,
    taxId: taxId ?? COMPANY_DEFAULTS.taxId,
  };
  return (
    <div style={{ textAlign: "center", marginBottom: 4 }}>
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.04em" }}>
        {company.name}
      </div>
      <div style={{ fontSize: 8, color: "#333", marginTop: 1 }}>
        {company.address}
      </div>
      {company.taxId && (
        <div style={{ fontSize: 8, color: "#555", marginTop: 1 }}>
          {company.taxId}
        </div>
      )}
    </div>
  );
};
