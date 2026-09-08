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
  if (n === 0) return "";

  const h = Math.floor(n / 100);
  const rest = n % 100;

  let words = "";

  if (h) {
    words += ONES[h] + " Hundred";
  }

  if (rest) {
    words += (words ? " " : "") + twoDigits(rest);
  }

  return words;
};

const numberToWords = (num) => {
  if (!Number.isFinite(num)) return "Zero";

  num = Math.floor(Math.abs(num));

  if (num === 0) return "Zero";

  // BDT numbering system
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  let words = "";

  /*
   * IMPORTANT:
   * crore can itself be larger than 999.
   * So recursively convert it instead of passing it to threeDigits().
   */
  if (crore) {
    words += numberToWords(crore) + " Crore ";
  }

  if (lakh) {
    words += threeDigits(lakh) + " Lakh ";
  }

  if (thousand) {
    words += threeDigits(thousand) + " Thousand ";
  }

  if (rest) {
    words += threeDigits(rest);
  }

  return words.trim();
};

export const amountInWords = (amount) => {
  // Handle null, undefined, "", NaN, Infinity, etc.
  const total = Number(amount);

  if (!Number.isFinite(total)) {
    return "Zero Taka Only";
  }

  // Negative amounts
  const isNegative = total < 0;
  const absoluteTotal = Math.abs(total);

  let taka = Math.floor(absoluteTotal);
  let paisa = Math.round((absoluteTotal - taka) * 100);

  // Handle rounding overflow
  if (paisa === 100) {
    taka += 1;
    paisa = 0;
  }

  let words = numberToWords(taka) + " Taka";

  if (paisa > 0) {
    words += " and " + numberToWords(paisa) + " Paisa";
  }

  if (isNegative) {
    words = "Negative " + words;
  }

  return words + " Only";
};